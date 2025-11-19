
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Obter o token do header Authorization
  const authHeader = getHeader(event, 'Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'Token de autorização ausente ou inválido.'
    })
  }

  const githubToken = "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"//authHeader.substring(7) // Remove "Bearer "

  if (!githubToken) {
    throw createError({
      statusCode: 401,
      message: 'Token do GitHub ausente.'
    })
  }

  const body = await readBody(event)
  const {
    owner,
    repo,
    state = 'OPEN',
    creator = null,
    dificuldade = null,
    per_page = 30,
    page = 1
  } = body

  if (!owner || !repo) {
    throw createError({
      statusCode: 400,
      message: 'Proprietário e repositório são obrigatórios.'
    })
  }

  try {
    // Montar a query GraphQL
    // const query = `
    //   query GetIssues($owner: String!, $repo: String!, $first: Int!, $after: String) {
    //     repository(owner: $owner, name: $repo) {
    //       issues(first: $first, after: $after) {
    //         totalCount
    //         pageInfo {
    //           hasNextPage
    //           endCursor
    //         }
    //         nodes {
    //           id
    //           number
    //           title
    //           body
    //           state
    //           url
    //           createdAt
    //           updatedAt
    //           labels(first: 10) {
    //             nodes {
    //               name
    //             }
    //           }
    //           assignees(first: 5) {
    //             nodes {
    //               login
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // `
    const query = `query {
  search(query: "repo:partithura/frontend-vuetify is:issue milestone:"MIGRAÇÃO: Gestão" type:Bug", type: ISSUE, first: 100) {
    nodes {
      ... on Issue {
        number
        title
        body
        state
        createdAt
        updatedAt
        labels(first: 10) {
          nodes {
            id
            name
            color
          }
        }
        projectItems(first: 20) {
          nodes {
            fieldValues(first: 20) {
              nodes {
                ... on ProjectV2ItemFieldSingleSelectValue {
                  field {
                    ... on ProjectV2FieldCommon {
                      name
                    }
                  }
                  name
                }
              }
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`

    const variables = {
      owner,
      repo,
      first: per_page,
      after: null, // Pode usar para paginação
      state,
      creator: creator || undefined
    }

    const response = await $fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        'Content-Type': 'application/json'
      },
      // body: { query, variables }
      body: { query }
    })

    if (response.errors) {
      throw new Error(response.errors[0].message)
    }

    const issues = response.data.search.nodes
    .map(issue => {
      // Extrair campo customizado "Dificuldade Consolidada"
      // let dificuldadeValue = null
      let extraFields;
      if (issue?.projectItems?.nodes) {
        for (const item of issue.projectItems.nodes) {
          if (item?.fieldValues?.nodes) {
            extraFields = item.fieldValues.nodes.map(f=>{
              return { 
                [f?.field?.name]:f?.name
              }
            }).filter(f=>{
              return Object.keys(f).length > 0
            })
          }
        }
      }

      return {
        id: issue.id,
        number: issue.number,
        title: issue.title,
        body: issue.body,
        state: issue.state.toLowerCase(),
        url: issue.url,
        created_at: issue.createdAt,
        updated_at: issue.updatedAt,
        labels: issue?.labels?.nodes?.map(l => l.name),
        assignees: issue?.assignees?.nodes?.map(a => a.login),
        fields:extraFields,
        outros:{
          ...issue
        }
      }
    })

    // Filtrar pelo campo customizado, se necessário
    // if (dificuldade) {
    //   issues = issues.filter(issue => issue.dificuldade_consolidada?.toLowerCase() === dificuldade.toLowerCase())
    // }
    return issues//.filter(issue => issue.dificuldade_consolidada);
    // return response.data.search.nodes
      // total_count: response.data.repository.issues.totalCount,
      // page_info: response.data.repository.issues.pageInfo,
      // issues
    // }
  } catch (error) {
    console.error('Erro ao buscar issues via GraphQL:', error)
    throw createError({
      statusCode: 500,
      message: 'Falha ao buscar issues do GitHub via GraphQL.'
    })
  }
})