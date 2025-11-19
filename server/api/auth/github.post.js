export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { code } = body

  if (!code) {
    throw createError({
      statusCode: 400,
      message: 'Código do GitHub ausente.'
    })
  }

  const config = useRuntimeConfig()
  const clientId = config.githubClientId
  const clientSecret = config.githubClientSecret
  const redirectUri = 'http://localhost:3000/callback/github'

  try {
    // Etapa 1: Trocar código por token de acesso
    const tokenResponse = await $fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: {
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri
      }
    })

    const accessToken = tokenResponse.access_token

    // Retorna o token do GitHub para o frontend
    return {
      token: accessToken,
    }
  } catch (error) {
    console.error('Erro na autenticação do GitHub:', error)
    throw createError({
      statusCode: 401,
      message: 'Falha ao autenticar com GitHub.'
    })
  }
})