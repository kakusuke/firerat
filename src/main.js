const { app, BrowserWindow, BrowserView, ipcMain, session, shell } = require('electron')
const ElectronStore = require('electron-store')
const contextMenu = require('electron-context-menu')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const appId = 'firerat.' + process.env.NODE_ENV

const store = new ElectronStore({
  name: appId
})

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      session: session.fromPartition(appId, {cache: true})
    },
  })

  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  const getContentBounds = bounds => {
    const headerHeight = 30
    const winBounds = win.getBounds()
    const contentBounds = win.getContentBounds()
    const height = bounds.height - (winBounds.height - contentBounds.height) - headerHeight
    const width = bounds.width - (winBounds.width - contentBounds.width)
    return {height: Math.max(0, height), width: Math.max(0, width), x: 0, y: headerHeight}
  }

  let services = store.get('services') || [
      {sessionId: 'gmail', url: 'https://mail.google.com/', label: 'GMail'},
      {sessionId: 'google', url: 'https://google.com', label: 'Google'}
    ]

  let views = []
  function createViews() {
    views = services.map(target => {
      const view = new BrowserView({
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true,
          session: session.fromPartition('persist:' + appId + '.' + target.sessionId, {cache: true})
        },
      })
      view.setBounds(getContentBounds(win.getBounds()))
      view.setBackgroundColor('#fff')
      view.webContents.loadURL(target.url)

      win.on('will-resize', (e, bounds) => {
        view.setBounds(getContentBounds(bounds))
      })

      contextMenu({
        window: view.webContents,
        prepend: (defaultActions, parameters, browserWindow) => [
          {
            label: 'Open link in browser',
            visible: parameters.linkURL.trim().length > 0,
            click: () => {
              shell.openExternal(parameters.linkURL.trim())
            }
          }
        ]
      })

      return view
    })
  }

  createViews()

  let activeViewIndex = -1
  const activate = index => {
    if (activeViewIndex === index) return
    activeViewIndex = index

    const view = views[index]
    win.setBrowserView(view)
    if (view != null) {
      view.setBounds(getContentBounds(win.getBounds()))
    }
  }

  ipcMain.on('selectservice', (e, message) => {
    activate(message.index)
  })

  ipcMain.on('setservice', (e, message) => {
    services = message
    win.webContents.send('changeservice', services)
  })

  ipcMain.on('saveservice', (e, message) => {
    services = message
    store.set('services', services)
    win.setBrowserView(null)
    views.forEach(view => view.webContents.destroy())
    createViews()
  })

  ipcMain.on('editpreference', () => store.openInEditor())

  win.on('ready-to-show', () => {
    win.webContents.send('changeservice', services)
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


