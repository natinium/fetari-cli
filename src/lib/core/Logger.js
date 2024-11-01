import chalk from "chalk";

class Logger {
  success(message) {
    console.log(chalk.green(message));
  }

  error(message, error) {
    console.error(chalk.red(message));
    if (error) console.error(error);
  }

  info(message) {
    console.log(chalk.blue(message));
  }
}

export default Logger;
