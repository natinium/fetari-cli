import path from "path";
import plop from "node-plop";
import Logger from "../core/Logger.js";

class AddCommand {
  constructor() {
    this.logger = new Logger();
  }

  async execute(type) {
    try {
      const plopfilePath = path.resolve(process.cwd(), "plopfile.js");
      const plopInstance = plop(plopfilePath);

      let generatorName = "";
      switch (type) {
        case "component":
          generatorName = "component";
          break;
        case "screen":
          generatorName = "screen";
          break;
        case "route":
          generatorName = "route";
          break;
        default:
          this.logger.error(`Unknown type: ${type}`);
          return;
      }

      const generator = plopInstance.getGenerator(generatorName);
      await generator.runPromptsAndActions();
      this.logger.success(`${type} added successfully!`);
    } catch (error) {
      this.logger.error("An error occurred while adding:", error);
    }
  }
}

export default AddCommand;
