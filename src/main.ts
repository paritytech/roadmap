import { fetchProjectItems } from "./fetchProjectItems";
import { config } from "./config";
import { promises as fs } from "fs";

const OUTPUT_FILE = `${process.cwd()}/dist/roadmap.json`

const { projectId, org } = config;

(async () => {
  const project = await fetchProjectItems({ org, projectId, first: 100 })
  await fs.mkdir("./dist", { recursive: true })
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(project))
  console.log(`Created ${OUTPUT_FILE} 👍`)
})().catch(e => {
  console.error(e);
  process.exit(1);
})
