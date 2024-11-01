// lib/core/PromptParser.js
import inquirer from "inquirer";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PromptParser {
  async parse(promptFileName, previousAnswers = {}) {
    const promptFilePath = path.resolve(
      __dirname,
      "../../prompts",
      promptFileName
    );
    const promptFileUrl = pathToFileURL(promptFilePath).href;
    const promptModule = await import(promptFileUrl);
    const prompts = await promptModule.default(previousAnswers);
    return inquirer.prompt(prompts);
  }
}

export default PromptParser;
