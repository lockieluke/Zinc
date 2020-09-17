const {ipcRenderer} = require('electron');

let mouseX = 0
let mouseY = 0

document.addEventListener('contextmenu', async event => {
    event.preventDefault()

    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        ipcRenderer.send('textcontextmenu', [mouseX, mouseY])
    } else if (event.target instanceof HTMLImageElement || event.target instanceof HTMLPictureElement) {
        ipcRenderer.send('imagecontextmenu', [mouseX, mouseY, event.target.src])
    } else if (event.target.hasAttribute('href')) {
        ipcRenderer.send('anchorcontextmenu', [mouseX, mouseY])
    } else {
        ipcRenderer.send('contextmenu', [mouseX, mouseY])
    }
});

document.addEventListener('mousemove', async event => {
    mouseX = event.pageX
    mouseY = event.pageY
});
