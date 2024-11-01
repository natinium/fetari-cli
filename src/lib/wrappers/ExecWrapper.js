import execa from "execa";

class ExecWrapper {
  static async run(command, args = [], options = {}) {
    try {
      const result = await execa(command, args, options);
      return result;
    } catch (error) {
      throw new Error(
        `Command failed: ${command} ${args.join(" ")}\n${error.message}`
      );
    }
  }
}

export default ExecWrapper;
