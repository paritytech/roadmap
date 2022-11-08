# ParityTech Roadmap

GitHub Action + Octokit application, which generates `roadmap.json` from the GH Project and deploys this to https://paritytech.github.io/roadmap/roadmap.json every 9:00 and 21:00 each day

### Env
- **PROJECT_ID** [required] https://github.com/orgs/<GITHUB_ORG>/projects/<PROJECT_ID>
- **GITHUB_ORG** [required] https://github.com/<GITHUB_ORG>
- **ACCESS_TOKEN** [required] Access Token mainly for Octokit to be able to query GraphQL API

    **Permissions**:
  - Administration Access: Read-only
  - Contents Access: Read-only
  - Metadata Access: Read-only
