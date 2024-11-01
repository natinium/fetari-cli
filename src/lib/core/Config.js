import dotenv from "dotenv";

class Config {
  constructor() {
    dotenv.config();
    this.githubToken = process.env.GITHUB_TOKEN;
    this.bitbucketUser = process.env.BITBUCKET_USER;
    this.bitbucketAppPassword = process.env.BITBUCKET_APP_PASSWORD;
  }
}

export default new Config();
