import { fetchProjectItems } from "./fetchProjectItems";
import { config } from "./config";
import * as fs from "fs";

const OUTPUT_FILE = `${process.cwd()}/dist/roadmap.json`

const { projectId, org } = config;

(async () => {
  try {
    const project = await fetchProjectItems({ org, projectId, first: 100 })
    console.log(project)
    try {
      await fs.mkdir('./dist', () => {
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(project), )
        console.log(`Created ${OUTPUT_FILE} 👍`)
      })
    } catch (e) {
      console.error(e)
    }
  } catch (e) {
    console.error(e)
  }

})().catch(console.error)
