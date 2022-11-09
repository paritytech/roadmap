import * as dotenv from "dotenv";

dotenv.config()

const auth = process.env.ACCESS_TOKEN
const org = process.env.GITHUB_ORG;
const projectId: number = parseInt(process.env.PROJECT_ID!, 10);

if (!projectId || isNaN(projectId)) throw new Error('A numeric PROJECT_ID must be provided. https://github.com/orgs/<GITHUB_ORG>/projects/<PROJECT_ID>')
if (!org) throw new Error('GITHUB_ORG must be provided')
if (!auth) throw new Error('ACCESS_TOKEN must be provided')

export const config = {
  auth,
  org,
  projectId
}
