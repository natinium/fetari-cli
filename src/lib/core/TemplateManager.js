// lib/core/TemplateManager.js
import degit from "degit";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath, pathToFileURL } from "url";
import SpinnerWrapper from "../wrappers/SpinnerWrapper.js";
import Logger from "../core/Logger.js";

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TemplateManager {
  constructor() {
    this.logger = new Logger();
  }

  async setupTemplate(answers) {
    const { projectType, projectName, description, author } = answers;

    try {
      // Step 1: Build the template configuration path dynamically
      this.logger.info("Loading template configuration...");

      const pathSegments = [projectType];
      const possibleKeys = ["framework", "language"];
      for (const key of possibleKeys) {
        if (answers[key]) {
          pathSegments.push(answers[key]);
        }
      }

      // The tool is the name of the .js file
      const templateConfigHandlers = {
        basic: (answers) => `${answers.complexity}.js`,
        frontend: (answers) => `${answers.tool}.js`,
        backend: (answers) => `${answers.framework}.js`,
        fullstack: (answers) => `${answers.stack}.js`,
        library: (answers) => `${answers.language}.js`,
        default: (answers) => `${answers.templateVariant}.js`,
      };

      function getTemplateConfigFileName(answers) {
        const handler =
          templateConfigHandlers[answers.projectType] ||
          templateConfigHandlers.default;
        return handler(answers);
      }

      const templateConfigFileName = getTemplateConfigFileName(answers);

      const templateConfigPath = path.resolve(
        __dirname,
        "../../templates",
        ...pathSegments,
        templateConfigFileName
      );
      
      // Check if the template configuration file exists
      if (!fs.existsSync(templateConfigPath)) {
        throw new Error(
          `Template configuration not found at ${templateConfigPath}`
        );
      }

      const templateConfigUrl = pathToFileURL(templateConfigPath).href;
      const templateConfigModule = await import(templateConfigUrl);
      const templateConfig = templateConfigModule.default;

      const templateVariant = answers.templateVariant;
      const templateVariantConfig = templateConfig.variants[templateVariant];

      if (!templateVariantConfig) {
        throw new Error(
          `Template variant "${templateVariant}" not found in template configuration.`
        );
      }

      this.logger.success("Template configuration loaded.");

      // Step 2: Fetching template repository
      this.logger.info("Fetching template repository...");
      const spinner = new SpinnerWrapper("Cloning repository...");
      spinner.start();

      try {
        const emitter = degit(templateVariantConfig.repoUrl, {
          cache: false,
          force: true,
          verbose: false,
        });

        // Handle degit events for more granular feedback
        emitter.on("info", (info) => {
          spinner.text = info.message;
        });

        // Cloning template
        await emitter.clone(projectName);
        spinner.succeed("Repository cloned.");
        this.logger.success("Template repository fetched.");
      } catch (error) {
        spinner.fail("Failed to clone repository.");
        // Handle specific errors
        if (error.code === "MISSING_REF") {
          this.logger.error(
            `Failed to clone repository: The specified reference "${error.ref}" does not exist. Please check the repository URL and ensure it is correct.`
          );
        } else if (error.code === "ENOTFOUND") {
          this.logger.error(
            "Failed to clone repository: Network error. Please check your internet connection."
          );
        } else {
          this.logger.error("Failed to clone repository.", error.message);
        }
        process.exit(1);
      }

      // Step 3: Remove .git directory if exists
      this.logger.info("Removing unnecessary files...");
      await fs.remove(path.join(projectName, ".git"));
      this.logger.success("Unnecessary files removed.");

      // Step 4: Update package.json if it exists
      const packageJsonPath = path.join(projectName, "package.json");
      if (await fs.pathExists(packageJsonPath)) {
        this.logger.info("Updating package.json with project information...");
        const packageJson = await fs.readJSON(packageJsonPath);

        // Update package.json fields
        packageJson.name = projectName;
        packageJson.version = "1.0.0";
        packageJson.description = description || "";
        packageJson.author = author || "";

        await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
        this.logger.success("package.json updated.");
      }
    } catch (error) {
      // Handle errors that occur outside the cloning process
      this.logger.error("Failed to set up the template.", error.message);
      process.exit(1);
    }
  }
}

export default TemplateManager;
