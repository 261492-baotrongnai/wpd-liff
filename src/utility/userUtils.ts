import axios from 'axios'
interface User {
  id: number
  name: string
}

export const getUser = async (): Promise<User> => {
  console.log('VITE_API_URL', import.meta.env.VITE_API_URL)
  const response = await axios(`${import.meta.env.API_URL}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Failed to fetch user: ${response.status}`)
  }

  return response.data
}
