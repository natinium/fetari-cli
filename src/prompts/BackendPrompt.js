// prompts/BackendPrompt.js
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function (previousAnswers) {
  const templatesDir = path.resolve(__dirname, "../templates/backend");

  return [
    {
      type: "list",
      name: "framework",
      message: "Select the backend framework:",
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
        const frameworkLanguages = {
          Express: ["JavaScript", "TypeScript"],
          Laravel: ["PHP"],
          // Add other frameworks as needed
        };
        const languages = frameworkLanguages[answers.framework];
        if (languages) {
          return languages;
        }
        return [];
      },
      when: (answers) => {
        const frameworkLanguages = {
          Laravel: ["PHP"],
        };
        return !frameworkLanguages[answers.framework];
      },
    },
    {
      type: "list",
      name: "tool",
      message: "Select the build tool:",
      choices: (answers) => {
        try {
          const toolsDir = path.join(
            templatesDir,
            answers.framework,
            answers.language || ""
          );
          if (fs.existsSync(toolsDir)) {
            const tools = fs
              .readdirSync(toolsDir)
              .map((file) => path.basename(file, ".js"));
            return tools;
          }
          return [];
        } catch (error) {
          console.error("Error reading tools:", error);
          return [];
        }
      },
      when: (answers) => {
        const toolsDir = path.join(
          templatesDir,
          answers.framework,
          answers.language || ""
        );
        return fs.existsSync(toolsDir);
      },
    },
    {
      type: "list",
      name: "templateVariant",
      message: "Select the template variant:",
      choices: async (answers) => {
        try {
          const templateConfigPath = path.join(
            templatesDir,
            answers.framework,
            answers.language || "",
            answers.tool || "",
            "templateConfig.js"
          );
          if (fs.existsSync(templateConfigPath)) {
            const templateConfigUrl = pathToFileURL(templateConfigPath).href;
            const templateConfigModule = await import(templateConfigUrl);
            const templateConfig = templateConfigModule.default;
            return Object.keys(templateConfig.variants);
          }
          return [];
        } catch (error) {
          console.error("Error reading template variants:", error);
          return [];
        }
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
