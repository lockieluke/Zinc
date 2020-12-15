import {ipcMain} from 'electron';

let mouseX = 0;
let mouseY = 0;

ipcMain.on('send-mouse-pos', function (event, args) {
    const mouseEventArgs: number[] = args;
    mouseX = mouseEventArgs[0];
    mouseY = mouseEventArgs[1];
});

export class mouseEvent {
    public static getMouseX(): number {
        return mouseX;
    }

    public static getMouseY(): number {
        return mouseY;
    }
}