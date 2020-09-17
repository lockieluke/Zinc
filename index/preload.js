const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

let hovered = hoveringimagedom = null, hoveringtext = hoveringimage = false, mouseX = mouseY = 0;

document.addEventListener('contextmenu', event => {
    event.preventDefault()

    if (hoveringtext) {
        ipcRenderer.send('textcontextmenu', [mouseX, mouseY])
    } else if (hoveringimage) {
        ipcRenderer.send('imagecontextmenu', [mouseX, mouseY, event.target.src])
    } else {
        ipcRenderer.send('contextmenu', [mouseX, mouseY])
    }
});

document.addEventListener('mousemove', event => {
    hovered = event.target

    if (event.target instanceof HTMLInputElement) {
        hoveringtext = true
    } else {
        hoveringtext = false
    }

    if (event.target instanceof HTMLImageElement || event.target instanceof HTMLPictureElement) {
        hoveringimage = true
        hoveringimagedom = event.target
    } else {
        hoveringimage = false
        hoveringimagedom = null
    }
});

document.addEventListener('mousemove', event => {
    mouseX = event.pageX
    mouseY = event.pageY
});
