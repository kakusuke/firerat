const { Menu } = require('electron')

const buildContextMenu = (context) => {
  return Menu.buildFromTemplate([
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'past'},
  ])
}
module.exports = buildContextMenu
