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
        `Step 2: Gathering ${projectType}-specific information...`,
      );

      const typePromptFileName = `${projectType}Prompt.js`;
      const typeAnswers = await this.promptParser.parse(
        typePromptFileName,
        mainAnswers,
      );
      this.logger.success(`${projectType}-specific information gathered.`);

      // Merge answers
      const answers = { ...mainAnswers, ...typeAnswers };

      // Step 3: Fetch and setup the template
      this.logger.info("Step 3: Setting up the project template...");
      await this.templateManager.setupTemplate(answers);
      this.logger.success("Project template set up.");

      // Step 4: Git initialization (optional)
      if (answers.initGit) {
        this.logger.info("Step 4: Initializing Git repository...");
        await this.gitManager.initializeRepo(answers.projectName);
        this.logger.success("Git repository initialized.");
      }

      // Step 5: Remote repository setup (optional)
      if (answers.createRemoteRepo) {
        this.logger.info("Step 5: Creating remote Git repository...");
        await this.gitManager.createRemoteRepo(answers);
        this.logger.success("Remote Git repository created.");
      }

      this.logger.success("Project setup complete!");

      // Instructions on what to do next
      this.logger.info("\nNext steps:");
      this.logger.info(
        `1. Navigate to your project directory: cd ${answers.projectName}`,
      );
      this.logger.info("2. Install dependencies: npm install");
      this.logger.info("3. Start the development server: npm start");
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
