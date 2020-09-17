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

<<<<<<< HEAD
document.addEventListener('mousemove', async event => {
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
=======
>>>>>>> 58ddcdbca585226d4ff47b69f36b319a9fb1292f

document.addEventListener('mousemove', async event => {
    mouseX = event.pageX
    mouseY = event.pageY
});
