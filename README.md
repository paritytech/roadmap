# ParityTech Roadmap

[![GitHub Issue Sync](https://github.com/paritytech/roadmap/actions/workflows/github-issue-sync.yml/badge.svg)](https://github.com/paritytech/roadmap/actions/workflows/github-issue-sync.yml)


GitHub Action + Octokit application, which generates `roadmap.json` from the GH Project and deploys this to https://paritytech.github.io/roadmap/roadmap.json every 9:00 and 21:00 each day
The authentication to Octokit on production is done through the GitHub action, where we generate token from GitHub App.
In order to test it locally - generate [personal access token](https://github.com/settings/personal-access-tokens/new) 

### Env
- **PROJECT_ID** [required] https://github.com/orgs/<GITHUB_ORG>/projects/<PROJECT_ID>
- **GITHUB_ORG** [required] https://github.com/<GITHUB_ORG>
- **ACCESS_TOKEN** [required] Access Token mainly for Octokit to be able to query GraphQL API. 
    For development: Create [personal access token](https://github.com/settings/personal-access-tokens/new)
    For production: Create GitHub App for authentication, and set up ROADMAP_APP_ID & ROADMAP_APP_PRIVATE_KEY in secrets   

    **Permissions**:
  - Metadata Access: Read-only
  - Organization - Projects: Read-only
  - Repository - Projects: Read-only
