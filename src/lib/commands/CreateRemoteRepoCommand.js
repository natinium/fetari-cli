import inquirer from "inquirer";
import GitManager from "../core/GitManager.js";
import Logger from "../core/Logger.js";

class CreateRemoteRepoCommand {
  constructor() {
    this.gitManager = new GitManager();
    this.logger = new Logger();
  }

  async execute() {
    try {
      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "platform",
          message: "Select the platform for the remote repository:",
          choices: ["GitHub", "Bitbucket"],
        },
        {
          type: "input",
          name: "repoName",
          message: "Enter the repository name:",
        },
        {
          type: "input",
          name: "description",
          message: "Enter the repository description (optional):",
        },
        {
          type: "confirm",
          name: "isPrivate",
          message: "Should the repository be private?",
          default: false,
        },
      ]);

      await this.gitManager.createRemoteRepo(answers);
      this.logger.success("Remote repository created and linked successfully!");
    } catch (error) {
      this.logger.error(
        "An error occurred while creating the remote repository:",
        error
      );
    }
  }
}

export default CreateRemoteRepoCommand;
