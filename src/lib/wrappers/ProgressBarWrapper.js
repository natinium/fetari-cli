import ProgressBar from "progress";

class ProgressBarWrapper {
  constructor(format, options) {
    this.bar = new ProgressBar(format, options);
  }

  update(value) {
    this.bar.update(value);
  }

  tick() {
    this.bar.tick();
  }

  isComplete() {
    return this.bar.complete;
  }
}

export default ProgressBarWrapper;
