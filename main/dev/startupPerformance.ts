export default class StartupPerformance {

  private countup: number = 0;
  private readonly timer: NodeJS.Timeout = null;

  public constructor() {
    this.timer = setInterval(() => {
      this.countup += 100;
    }, 100);
  }

  public finishedStartup(callback: (startupTime) => void) {
    clearInterval(this.timer);
    callback(this.countup);
  }
}