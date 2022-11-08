import {GetProjectsQuery, IssueState, IssueStateReason} from "./generated/graphql-operations";

export type ProjectDetails = {
  projectsUrl: string
  projectsResourcePath: string
  name: string
  items: ProjectItem[]
}

export type ProjectCustomFields = {
  [k: string]: any
}

export type ProjectItemLabels = {
  name: string,
  url: string,
  color: string
}[] | undefined

export type ProjectItem = {
  id: string
  content: {
    // ISSUE fields explained here https://docs.github.com/en/graphql/reference/objects#issue
    title: string,
    body: string,
    bodyHTML: any,
    bodyUrl: any,
    bodyText: string,
    state: IssueState, // OPEN / CLOSED
    stateReason?: IssueStateReason | null, // COMPLETED / NOT_PLANNED / REOPENED
    closed: boolean,
    closedAt?: any | null,
    updatedAt: any,
    publishedAt?: any | null,
    author?: { avatarUrl: any, login: string, url: any } | null
    // Labels from https://docs.github.com/en/graphql/reference/objects#projectv2itemfieldlabelvalue
    labels?: ProjectItemLabels
    // Custom fields are coming from various or types
    // - ProjectV2ItemFieldNumberValue - https://docs.github.com/en/graphql/reference/objects#projectv2itemfieldnumbervalue
    // - ProjectV2ItemFieldSingleSelectValue - https://docs.github.com/en/graphql/reference/objects#projectv2itemfieldsingleselectvalue
    customFields: ProjectCustomFields
  }
}
