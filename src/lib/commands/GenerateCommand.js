// lib/commands/GenerateCommand.js
import PromptParser from "../core/PromptParser.js";
import TemplateManager from "../core/TemplateManager.js";
import GitManager from "../core/GitManager.js";
import Logger from "../core/Logger.js";

class GenerateCommand {
  constructor() {
    this.promptParser = new PromptParser();
    this.templateManager = new TemplateManager();
    this.gitManager = new GitManager();
    this.logger = new Logger();
  }

  async execute() {
    try {
      // Step 1: Gather basic project information
      this.logger.info("Step 1: Gathering project information...");
      const mainAnswers = await this.promptParser.parse("MainPrompt.js");
      this.logger.success("Project information gathered.");

      // Step 2: Dynamic prompts based on project type
      const projectType = mainAnswers.projectType;
      this.logger.info(
        `Step 2: Gathering ${projectType}-specific information...`
      );

      const typePromptFileName = `${projectType}Prompt.js`;
      const typeAnswers = await this.promptParser.parse(
        typePromptFileName,
        mainAnswers
      );
      this.logger.success(`${projectType}-specific information gathered.`);

      // Merge answers
      const answers = { ...mainAnswers, ...typeAnswers };

      // Step 3: Fetch and setup the template
      this.logger.info("Step 3: Setting up the project template...");
      await this.templateManager.setupTemplate(answers);
      this.logger.success("Project template set up.");

      // Rest of the code remains the same...
    } catch (error) {
      this.logger.error(
        "An error occurred during project generation:",
        error.message
      );
      process.exit(1);
    }
  }
}

export default GenerateCommand;
