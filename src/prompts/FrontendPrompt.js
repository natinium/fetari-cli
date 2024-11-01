// prompts/FrontendPrompt.js
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function (previousAnswers) {
  const templatesDir = path.resolve(__dirname, "../templates/frontend");

  return [
    {
      type: "list",
      name: "framework",
      message: "Select the frontend framework:",
      choices: () => {
        try {
          const frameworks = fs
            .readdirSync(templatesDir)
            .filter((name) =>
              fs.statSync(path.join(templatesDir, name)).isDirectory()
            );
          return frameworks;
        } catch (error) {
          console.error("Error reading frameworks:", error);
          return [];
        }
      },
    },
    {
      type: "list",
      name: "language",
      message: "Select the programming language:",
      choices: (answers) => {
        const framework = answers.framework;
        const languagesDir = path.join(templatesDir, framework);
        if (fs.existsSync(languagesDir)) {
          const languages = fs
            .readdirSync(languagesDir)
            .filter((name) =>
              fs.statSync(path.join(languagesDir, name)).isDirectory()
            );
          return languages;
        }
        return [];
      },
    },
    {
      type: "list",
      name: "tool",
      message: "Select the build tool:",
      choices: (answers) => {
        const toolsDir = path.join(
          templatesDir,
          answers.framework,
          answers.language
        );
        if (fs.existsSync(toolsDir)) {
          const tools = fs
            .readdirSync(toolsDir)
            .filter((file) => file.endsWith(".js"))
            .map((file) => path.basename(file, ".js"));
          return tools;
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
          answers.framework,
          answers.language,
          `${answers.tool}.js`
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
