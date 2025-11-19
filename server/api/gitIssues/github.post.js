
import { Octokit } from "octokit";
export default defineEventHandler(async (event) => {

  // Obter o token do header Authorization
  const authHeader = getHeader(event, 'Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'Token de autorização ausente ou inválido.'
    })
  }

  const githubToken = authHeader.substring(7) // Remove "Bearer "

  if (!githubToken) {
    throw createError({
      statusCode: 401,
      message: 'Token do GitHub ausente.'
    })
  }
  const octokit = new Octokit({ 
  auth: githubToken
});

  const body = await readBody(event)
  const {
    projectNumber,
    org,
    itemId,
    q='',
    paginationSize=10,
    after,
    before
  } = body
  const headers = {
    'X-GitHub-Api-Version': '2022-11-28',
  }

  if (!projectNumber || !org) {
    throw createError({
      statusCode: 400,
      message: 'Organização e número do projeto são obrigatórios.'
    })
  }
//paginação no github é uma merda
  try {
    const response = await octokit.request(`GET /orgs/{org}/projectsV2/{project_number}/items`, {
      project_number:projectNumber,
      org:org,
      itemId:itemId,
      headers:headers,
      q:q,
      per_page:paginationSize,
      after,
      before
    })

    if (response.errors) {
      throw new Error(response.errors[0].message)
    }

    const issues = response.data
    const responseHeaders = response.headers
    
    return {
      issues:issues,
      headers:responseHeaders
    }

  } catch (error) {
    console.error('Erro ao buscar issues via REST:', error)
    throw createError({
      statusCode: 500,
      message: 'Falha ao buscar issues do GitHub via REST.'
    })
  }
})