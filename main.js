const { app, BrowserWindow, BrowserView, ipcMain, session } = require('electron')
const path = require('path')
const ElectronStore = require("electron-store");

const appId = 'firerat' + (process.env.FIRE_RAT_SESSION_PREFIX || '')

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
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
      session: session.fromPartition(appId, {cache: true})
    },
  })

  win.loadFile('index.html')

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
    createViews()
  })

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


