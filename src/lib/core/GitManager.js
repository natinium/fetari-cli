import { Octokit } from "@octokit/rest";
import Bitbucket from "bitbucket";
import ExecWrapper from "../wrappers/ExecWrapper.js";
import SpinnerWrapper from "../wrappers/SpinnerWrapper.js";
// Inside GitManager.js
import Config from './Config.js';


class GitManager {
  async initializeRepo(projectPath) {
    const spinner = new SpinnerWrapper("Initializing git repository...");
    spinner.start();
    try {
      await ExecWrapper.run("git", ["init"], { cwd: projectPath });
      spinner.succeed("Git repository initialized!");
    } catch (error) {
      spinner.fail("Failed to initialize git repository.");
      throw error;
    }
  }

  async createRemoteRepo(answers) {
    const { platform, repoName, description, isPrivate } = answers;
    const spinner = new SpinnerWrapper(
      `Creating remote repository on ${platform}...`
    );
    spinner.start();

    try {
      let repoUrl = "";

      if (platform === "GitHub") {
        const octokit = new Octokit({ auth: Config.githubToken });
        const response = await octokit.repos.createForAuthenticatedUser({
          name: repoName,
          description,
          private: isPrivate,
        });
        repoUrl = response.data.ssh_url;
      } else if (platform === "Bitbucket") {
        const bitbucket = new Bitbucket({
          auth: {
            username: Config.bitbucketUser,
            password: Config.bitbucketAppPassword,
          },
        });
        const response = await bitbucket.repositories.create({
          repo_slug: repoName,
          description,
          is_private: isPrivate,
        });
        repoUrl = response.data.links.clone.find(
          (link) => link.name === "ssh"
        ).href;
      }

      // Add remote origin
      await ExecWrapper.run("git", ["remote", "add", "origin", repoUrl], {
        cwd: process.cwd(),
      });

      spinner.succeed("Remote repository created and linked!");
    } catch (error) {
      spinner.fail("Failed to create remote repository.");
      throw error;
    }
  }
}

export default GitManager;
