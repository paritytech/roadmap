import * as dotenv from "dotenv";

dotenv.config()

const auth = process.env.ACCESS_TOKEN
const org = process.env.GITHUB_ORG;
const projectId: number = parseInt(process.env.PROJECT_ID!, 10);

if (!projectId || isNaN(projectId)) throw new Error('PROJECT_ID must be provided')
if (!org) throw new Error('GITHUB_ORG must be provided')
if (!auth) throw new Error('GITHUB_TOKEN must be provided')

export const config = {
  auth,
  org,
  projectId
}
