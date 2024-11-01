
# Fetari CLI

Fetari CLI is a command-line tool that simplifies the process of scaffolding new projects with pre-configured templates and essential development tools. It streamlines project setup by guiding users through creating a new project with ready-made configurations.

## Features

- **Project Scaffolding**: Quickly generate new projects with standardized templates.
- **Interactive Setup**: Provides prompts for user input to tailor the project configuration.

## Installation

To install `fetari-cli` directly from GitHub, use:

```bash
git clone https://github.com/natinium/fetari-cli.git
cd fetari-cli
npm install
npm link
```

This will globally link the `fetari-cli` command, making it available for use in your terminal.

## Usage

To generate a new project, use the following command:

```bash
fetari generate
```

### Project Generation Steps

1. Run `fetari generate`.
2. The CLI will prompt you to enter information for project setup (e.g., project name, type, configurations).
3. Once inputs are complete, Fetari CLI will scaffold a new project with all necessary files and configurations.

---

With Fetari CLI, starting new projects is faster, easier, and standardized, making it ideal for teams or individual developers looking to streamline their workflow.