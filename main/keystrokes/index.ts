import { BrowserWindow, globalShortcut } from "electron";

export default class electronLocalKeystroke {
  private static registeredKeystrokes: string[] = [];
  private static registeredKeystrokesFn: Function[] = [];
  private static registeredKeystrokesWnd: BrowserWindow[] = [];

  public static registerLocalKeyStroke(
    keystroke: string,
    window: BrowserWindow,
    callback: Function,
  ): void {
    this.registeredKeystrokes.push(keystroke);
    this.registeredKeystrokesFn.push(callback);
    this.registeredKeystrokesWnd.push(window);

    this.repeatRegisteringLocalKeystrokes();

    const self = this;
    window.on('blur', function () {
      globalShortcut.unregisterAll();
    });
    window.on('focus', function () {
      self.repeatRegisteringLocalKeystrokes();
    });
  }

  private static repeatRegisteringLocalKeystrokes(): void {
    for (let i = 0; i < this.registeredKeystrokes.length; i++) {
      const self = this;
      globalShortcut.register(this.registeredKeystrokes[i], function () {
        if (self.registeredKeystrokesWnd[i].isFocused())
          self.registeredKeystrokesFn[i]();
      });
    }
  }
}
