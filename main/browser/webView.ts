import { BrowserView, BrowserWindow } from "electron";

const lifetimeWebViews: object = {};

export class WebView extends BrowserView {
  private window: BrowserWindow = null;
  private id: number;

  public constructor(window: BrowserWindow, url: string) {
    super({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        allowRunningInsecureContent: true,
        nativeWindowOpen: true,
        devTools: true,
        enableRemoteModule: false,
      },
    });
    lifetimeWebViews[this.webContents.id] = this;
    this.id = this.webContents.id;
    this.window = window;
    this.setBackgroundColor('#ffffff');
    window.setBrowserView(this);
    const self = this;
    this.webContents.loadURL(url).then(resizeWebView);
    const resizingCondition =
      process.env.RESPONSIVE_RESIZING === 'true' ? 'resize' : 'resized';
    window.on(<any>resizingCondition, resizeWebView);
    if (resizingCondition === 'resized') {
      window.on('maximize', resizeWebView);
      window.on('unmaximize', resizeWebView);
    }

    function resizeWebView(): void {
      const { width, height } = self.window.getContentBounds();
      self.setBounds({
        width: width,
        height: height - 40,
        x: 0,
        y: 40,
      });
    }
  }

  public static destroyWebView(webview: WebView): void {
    delete lifetimeWebViews[webview.id];
  }

  public static fromId(id: number): WebView {
    return lifetimeWebViews[id];
  }
}
