const {ipcRenderer} = require('electron')

const newtabBtn = document.getElementById('newtab')

newtabBtn.addEventListener('click', ()=>{
    ipcRenderer.send('newtab')
})

const newwinBtn = document.getElementById('newwin')

newwinBtn.addEventListener('click', ()=>{
    ipcRenderer.send('newwin')
})

const quitBtn = document.getElementById('quitBtn')

quitBtn.addEventListener('click', ()=>{
    ipcRenderer.send('quit', !optioned)
})

const aboutBtn = document.getElementById('about')

aboutBtn.addEventListener('click', ()=>{
    ipcRenderer.send('about')
})

const reloadBtn = document.getElementById('reload')
let optioned = true

reloadBtn.addEventListener('click', ()=>{
    ipcRenderer.send('reloadpage', !optioned)
})

const historyBtn = document.getElementById('history')

historyBtn.addEventListener('click', ()=>{
    ipcRenderer.send('navi-history')
})

document.body.addEventListener('keydown', (event)=>{
    if (event.key === "Alt") {
        event.preventDefault()
        reloadBtn.getElementsByTagName('h6').item(0).innerText = "Reload Without Cache"
        quitBtn.getElementsByTagName('h6').item(0).innerText = "Close Window"
        optioned = false
    }
})

document.body.addEventListener('keyup', (event)=>{
    if (event.key === "Alt") {
        event.preventDefault()
        reloadBtn.getElementsByTagName('h6').item(0).innerText = "Reload"
        quitBtn.getElementsByTagName('h6').item(0).innerText = "Quit"
        optioned = true
    }
})

const homeBtn = document.getElementById('home')

homeBtn.addEventListener('click', ()=>{
    ipcRenderer.send('home')
})

const newtabBtn = document.getElementById('newtab')

newtabBtn.addEventListener('click', ()=>{
    ipcRenderer.send('home', true)
})