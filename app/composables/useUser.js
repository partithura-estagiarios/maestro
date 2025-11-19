export const useUser = () => {
  const githubToken = useCookie('token')

  const fetchUser = async () => {
    if (!githubToken.value) {
      throw new Error('Nenhum token disponível.')
    }

    try {
      const user = await $fetch('/api/user/github', {
        headers: {
          Authorization: `Bearer ${githubToken.value}`
        }
      })

      return user
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      throw error
    }
  }

  return {
    fetchUser
  }
}