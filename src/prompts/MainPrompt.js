export default function () {
  return [
    {
      type: "input",
      name: "projectName",
      message: "Enter the project name:",
      validate: (input) => (input ? true : "Project name cannot be empty."),
    },
    {
      type: "input",
      name: "description",
      message: "Enter the project description (optional):",
    },
    {
      type: "input",
      name: "author",
      message: "Enter the author name:",
    },
    {
      type: "list",
      name: "projectType",
      message: "Select the project type:",
      choices: [
        "frontend",
        "backend",
        "mobile",
        "desktop",
        "modules",
        "cli-tool",
        "basic",
        "Sample"
      ],
    },
  ];
}
