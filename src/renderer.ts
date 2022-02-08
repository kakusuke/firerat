/// <reference path="./@types/preload.d.ts"/>
import './index.css'

const container = document.querySelector('ul')
const table = document.querySelector('table tbody')

services.on('change', target => {
  container.replaceChildren(
    el('li', [{
      click: () => services.select({index: -1})
    }], '+'),
    ...target.map((service: any, index: any) => el('li', [{
        click: () => services.select({index})
      }], [
      el('span', service.label),
    ]))
  )

  table.replaceChildren(...target.map((service: any, index: any) => {
    return el('tr', [
      el('td', [
        el('input', [['value', service.sessionId], {
          blur: (e: any) => services.set(state => state.map((s: any, i: any) => i === index ? {...s, sessionId: e.target.value} : s))
        }], [])
      ]),
      el('td', [
        el('input', [['value', service.label], {
          blur: (e: any) => services.set(state => state.map((s: any, i: any) => i === index ? {...s, label: e.target.value} : s))
        }], [])
      ]),
      el('td', [
        el('input', [['value', service.url], {
          blur: (e: any) => services.set(state => state.map((s: any, i: any) => i === index ? {...s, url: e.target.value} : s))
        }], [])
      ]),
      el('td', [
        el('button', [{
          click: () => services.set(state => state.filter((s: any, i: any) => i !== index))
        }], '-')
      ]),
    ])
  }), el('tr', [
    el('td', [['colspan', 4]], [
      el('button', [{
        click: () => {
          services.set(state => state.concat([{sessionId: 'default', label: 'new', url: ''}]))
        }
      }], '+')
    ])
  ]), el('tr', [
    el('td', [['colspan', 4]], [
      el('button', [{
        click: () => {
          services.save()
        }
      }], 'save')
    ])
  ])
  )
})

function el(name: string, attrs?: any, children?: any, events?: any): HTMLElement {
  if (arguments.length === 2) {
    children = attrs
    attrs = []
  }
  children = children || []
  if (!(children instanceof Array)) {
    children = [children]
  }

  const elm = document.createElement(name)
  attrs.forEach((attr: any) => {
    if (attr instanceof Array) {
      elm.setAttribute(attr[0], attr[1])
    } else {
      Object.keys(attr).forEach(key => elm.addEventListener(key, attr[key]))
    }
  })
  elm.append(...children.map((child: any) => {
    if (typeof child === 'string') {
      return document.createTextNode(child)
    } else {
      return child
    }
  }))
  return elm
}


document.querySelector('#preference').addEventListener('click', () => services.editPreference())
