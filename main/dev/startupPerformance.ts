export default class StartupPerformance {

  private countup: number = 0;
  private timer: NodeJS.Timeout = null;

  public constructor() {
    this.timer = setInterval(() => {
      this.countup += 100;
    }, 100);
  }

  public finishedStartup(callback: (startupTime: number) => void) {
    clearInterval(this.timer);
    this.timer = null;
    callback(this.countup);
  }

  public splitStartup(callback: (startupTime: number) => void) {
    callback(this.countup);
  }
}