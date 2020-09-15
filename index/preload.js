const {ipcRenderer} = require('electron')

let hovered = null
let hoveringtext = false
let hoveringimage = false
let hoveringimagedom = null
let mouseX = 0
let mouseY = 0

document.addEventListener('contextmenu', (event)=>{
    event.preventDefault()

    if (hoveringtext) {
        ipcRenderer.send('textcontextmenu', [mouseX, mouseY])
    } else if (hoveringimage) {
        ipcRenderer.send('imagecontextmenu', [mouseX, mouseY, event.target.src])
    } else {
        ipcRenderer.send('contextmenu', [mouseX, mouseY])
    }
})

document.addEventListener('mousemove', (event)=>{
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
})

document.addEventListener('mousemove', (event)=>{
    mouseX = event.pageX
    mouseY = event.pageY
})

function getDataUrl(img) {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // Set width and height
    canvas.width = img.width;
    canvas.height = img.height;
    // Draw the image
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg');
}