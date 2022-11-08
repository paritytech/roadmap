import { GetProjectsDocument, GetProjectsQuery, GetProjectsQueryVariables } from "./generated/graphql-operations";
import { ProjectDetails, ProjectItem } from "./types";
import { print } from "graphql/index";
import { octokit } from "./octokit";

export async function fetchProjectItems(
  params: GetProjectsQueryVariables,
  recursiveCollection?: ProjectDetails
): Promise<ProjectDetails> {
  console.log(`Fetching projects`, params)
  // @ts-ignore
  const project: GetProjectsQuery = await fetchProject(params).catch(console.error)

  console.log(project)

  if (project.organization?.projectV2?.items?.edges) {
    const { hasNextPage, endCursor } = project.organization?.projectV2?.items?.pageInfo
    const items: ProjectItem[] = [];

    project.organization?.projectV2?.items?.edges
      ?.map(item => item?.node)
      ?.map(item => {
        if (item) {
          if (item.content && Object.keys(item.content).length > 0 && item.content.__typename === "Issue") {
            let projectItem: ProjectItem = {
              id: item.id,
              content: {
                ...item.content,
                customFields: {}
              },
            }

            if (item.fieldValues) {
              item.fieldValues.edges
                ?.map(fv => {
                  if (!fv?.node) return;

                  switch(fv.node.__typename) {
                    case "ProjectV2ItemFieldLabelValue":
                      projectItem.content.labels = fv.node.labels?.nodes
                        ?.filter(label => !!label)
                        ?.map(label => {
                          return {
                            name: label!.name,
                            url: label!.url,
                            color: label!.color,
                          }
                        })
                      break;
                    case "ProjectV2ItemFieldSingleSelectValue":
                      if (fv.node?.field.__typename === "ProjectV2SingleSelectField") {
                        projectItem.content.customFields[fv.node.field.name] = fv.node.name
                      }
                      break
                    case "ProjectV2ItemFieldNumberValue":
                      if (fv.node?.field.__typename === "ProjectV2Field") {
                        projectItem.content.customFields[fv.node.field.name] = fv.node.number
                      }
                      break
                  }
                })
            }

            items.push(projectItem)
          }


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
    .catch(console.error)
}
