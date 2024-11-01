#!/usr/bin/env node

import { Command } from "commander";
import GenerateCommand from "../lib/commands/GenerateCommand.js";
import AddCommand from "../lib/commands/AddCommand.js";
import CreateRemoteRepoCommand from "../lib/commands/CreateRemoteRepoCommand.js";

const program = new Command();

program
  .version("1.0.0")
  .description("Fetari CLI - Automate project scaffolding");

program
  .command("generate")
  .description("Initiate the project scaffolding process")
  .action(async () => {
    try {
      const generateCommand = new GenerateCommand();
      await generateCommand.execute();
    } catch (error) {
      console.error("An error occurred:", error);
      process.exit(1);
    }
  });

program
  .command("add <type>")
  .description("Add new components or files to an existing project")
  .action(async (type) => {
    try {
      const addCommand = new AddCommand();
      await addCommand.execute(type);
    } catch (error) {
      console.error("An error occurred:", error);
      process.exit(1);
    }
  });

program
  .command("create-remote-repo")
  .description("Automate the creation of a remote repository")
  .action(async () => {
    try {
      const createRemoteRepoCommand = new CreateRemoteRepoCommand();
      await createRemoteRepoCommand.execute();
    } catch (error) {
      console.error("An error occurred:", error);
      process.exit(1);
    }
  });

program.parse(process.argv);
