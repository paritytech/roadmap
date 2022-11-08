import {GetProjectsQuery, IssueState, IssueStateReason} from "./generated/graphql-operations";

export type ProjectDetails = {
  projectsUrl: string
  projectsResourcePath: string
  name: string
  items: ProjectItem[]
}

type ProjectCustomFields = {
  [k: string]: any
}

export type ProjectItem = {
  id: string
  content: {
    body: string,
    title: string,
    bodyHTML: any,
    bodyUrl: any,
    bodyText: string,
    state: IssueState,
    stateReason?: IssueStateReason | null,
    closed: boolean,
    closedAt?: any | null,
    updatedAt: any,
    publishedAt?: any | null,
    author?: { avatarUrl: any, login: string, url: any } | null
    labels?: { name: string, url: string, color: string }[] | undefined
    customFields: ProjectCustomFields
  }
}
