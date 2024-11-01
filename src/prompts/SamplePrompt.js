export default function (previousAnswers) {
  return [
    {
      type: "list",
      name: "framework",
      message: "Select the frontend framework:",
      choices: ["React", "Vue", "Angular", "Svelte", "Vanilla"],
    },
    {
      type: "list",
      name: "language",
      message: "Select the programming language:",
      choices: ["JavaScript", "TypeScript"],
    },
    {
      type: "list",
      name: "tool",
      message: "Select the build tool:",
      choices: ["CRA", "Vite", "NextJs", "Gatsby"],
      when: (answers) => answers.framework === "React",
    },
    {
      type: "list",
      name: "templateVariant",
      message: "Select the template variant:",
      choices: ["base", "advanced"],
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
