import axios from 'axios'
export interface MenuCandidate {
  name: string[]
}

export async function getMenuCandidates(id: string) {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/user-states/candidates/${id}`)
  return response.data
}
