import ora from "ora";

class SpinnerWrapper {
  constructor(text) {
    this.spinner = ora(text);
  }

  start() {
    this.spinner.start();
  }

  succeed(text) {
    this.spinner.succeed(text);
  }

  fail(text) {
    this.spinner.fail(text);
  }
}

export default SpinnerWrapper;
