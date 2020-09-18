const {ipcRenderer} = require('electron')

const closeBtn = document.getElementById('closebtn')
closeBtn.addEventListener('click', async () => {
    ipcRenderer.send('close');
});

const maxBtn = document.getElementById('maxbtn')
maxBtn.addEventListener('click', async () => {
    ipcRenderer.send('togglemax');
});

const minBtn = document.getElementById('minBtn')

minBtn.addEventListener('click', async () => {
    ipcRenderer.send('minimize');
})

const win = require('electron').remote.getCurrentWindow()

win.addListener('maximize', ()=>{
    resizeWebview()
})

win.addListener('resize', async ()=>{
    await resizeWebview()
})