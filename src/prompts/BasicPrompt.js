// prompts/FrontendPrompt.js
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function () {
  const templatesDir = path.resolve(__dirname, "../templates/basic");

  return [
    {
      type: "list",
      name: "complexity",
      message: "Select the project complexity level:",
      choices: () => {
        const complexityDir = path.join(
          templatesDir,
        );
        if (fs.existsSync(complexityDir)) {
          const complexity = fs
            .readdirSync(complexityDir)
            .filter((file) => file.endsWith(".js"))
            .map((file) => path.basename(file, ".js"));
          return complexity;
        }
        return [];
      },
    },
    {
      type: "list",
      name: "templateVariant",
      message: "Select the template variant:",
      choices: async (answers) => {
        const templateConfigPath = path.join(
          templatesDir,
          `${answers.complexity}.js`,
        );
        if (fs.existsSync(templateConfigPath)) {
          const templateConfigUrl = pathToFileURL(templateConfigPath).href;
          const templateConfigModule = await import(templateConfigUrl);
          const templateConfig = templateConfigModule.default;
          return Object.keys(templateConfig.variants);
        }
        return [];
      },
    },
    {
      type: "confirm",
      name: "initGit",
      message: "Initialize a git repository?",
      default: true,
    },
    {
      type: "confirm",
      name: "createRemoteRepo",
      message: "Create a remote repository?",
      default: false,
    },
  ];
}
