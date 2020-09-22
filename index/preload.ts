const {ipcRenderer} = require('electron');

let mouseX: number = 0
let mouseY: number = 0

document.addEventListener('contextmenu', async (event: MouseEvent) => {
    event.preventDefault()

    const element: HTMLElement = <HTMLElement> event.target

    if (element.hasAttribute('href') || event.target instanceof HTMLAnchorElement) {
        ipcRenderer.send('anchorcontextmenu', [mouseX, mouseY])
    } else {
        if (element.className === 'LC20lb DKV0Md') {
            ipcRenderer.send('anchorcontextmenu', [mouseX, mouseY])
        } else if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
            ipcRenderer.send('textcontextmenu', [mouseX, mouseY])
        } else if (event.target instanceof HTMLImageElement || event.target instanceof HTMLPictureElement) {
            ipcRenderer.send('imagecontextmenu', [mouseX, mouseY, element.getAttribute('src').toString()])
        } else {
            ipcRenderer.send('contextmenu', [mouseX, mouseY])
        }
    }
});

document.addEventListener('mousemove', async (event: MouseEvent) => {
    mouseX = event.pageX
    mouseY = event.pageY
});

// document.addEventListener('mouseover', (event: MouseEvent)=>{
//     const element: HTMLElement = <HTMLElement> event.target
//     if (element.hasAttribute('href')) {
//         alert('HAS HREF')
//     }
// })
