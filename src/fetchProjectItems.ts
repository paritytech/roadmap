import {
  GetProjectsDocument,
  GetProjectsQuery,
  GetProjectsQueryVariables, Label,
} from "./generated/graphql-operations";
import {ProjectDetails, ProjectItem, ProjectItemLabels} from "./types";
import { print } from "graphql/index";
import { octokit } from "./octokit";

export async function fetchProjectItems(
  params: GetProjectsQueryVariables,
  recursiveCollection?: ProjectDetails
): Promise<ProjectDetails> {
  console.log(`Fetching projects`, params)
  // @ts-ignore
  const project: GetProjectsQuery = await fetchProject(params).catch((e) => {
    console.error(e)
    process.exit(1)
  })

  console.log(project)

  if (project.organization?.projectV2?.items?.edges) {
    const { hasNextPage, endCursor } = project.organization?.projectV2?.items?.pageInfo
    const items: ProjectItem[] = [];

    project.organization?.projectV2?.items?.edges
      ?.map(itemEdge => itemEdge?.node)
      ?.map(item => {
        if (item && item.content && Object.keys(item.content).length > 0 && item.content.__typename === "Issue") {
          let projectItem: ProjectItem = {
            id: item.id,
            content: {
              ...item.content,
              customFields: {}
            },
          }

          if (item.fieldValues) {
            // FieldValues include
            // - Custom fields of ProjectV2
            // - Issue fields (like labels, milestones etc)
            // Here we extract Labels and all Custom Fields into projectItem
            item.fieldValues.edges?.map(fv => {
              if (!fv?.node) return;

              // Depends on __typename the node might have different keys,
              // that's why we need to check the type explicitly
              switch(fv.node.__typename) {
                case "ProjectV2ItemFieldLabelValue":
                  // Extract ProjectItemLabels
                  projectItem.content.labels = getItemLabels(fv.node.labels?.nodes)
                  break;
                case "ProjectV2ItemFieldSingleSelectValue":
                  // Extract all Single Select type of Custom fields
                  if (fv.node?.field.__typename === "ProjectV2SingleSelectField") {
                    projectItem.content.customFields[fv.node.field.name] = fv.node.name
                  }
                  break
                case "ProjectV2ItemFieldNumberValue":
                  // Extract all Number type of Custom fields
                  if (fv.node?.field.__typename === "ProjectV2Field") {
                    projectItem.content.customFields[fv.node.field.name] = fv.node.number
                  }
                  break
              }
            })
          }

          items.push(projectItem)
        }
      })

    if (items?.length && recursiveCollection?.items) {
      // concat ProjectItems[] to existing ProjectDetails
      recursiveCollection.items = recursiveCollection.items.concat(items)
    } else {
      // initialize ProjectDetails
      const { name, projectsUrl, projectsResourcePath } = project.organization
      recursiveCollection = {
        name,
        projectsUrl,
        projectsResourcePath,
        items
      } as ProjectDetails;
    }

    return hasNextPage
      ? await fetchProjectItems({ ...params, after: endCursor }, recursiveCollection)
      : recursiveCollection
  } else {
    throw new Error(`No items found in a project ¯\_(ツ)_/¯; params: ${JSON.stringify(params)}`)
  }
}

async function fetchProject(params: GetProjectsQueryVariables) {
  return await octokit.graphql<GetProjectsQuery>(print(GetProjectsDocument), params)
    .catch(e => {
      console.error(e)
      process.exit(1)
    })
}

function getItemLabels(labels: ({
  __typename: "Label";
  name: string;
  color: string;
  url: any;
} | null)[] | null | undefined): ProjectItemLabels {
  return labels
    ?.filter(label => !!label)
    ?.map(label => {
      return {
        name: label!.name,
        url: label!.url,
        color: label!.color,
      }
    })
}
