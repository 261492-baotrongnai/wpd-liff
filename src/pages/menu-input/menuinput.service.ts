import { apiService } from '@/services/api.service'
export interface MenuCandidate {
  name: string[]
}

export async function getMenuCandidates(): Promise<string[]> {
  const response = await apiService.get<MenuCandidate[]>(
    `/user-states/candidates`,
  )
  const names = response.map((candidate: MenuCandidate) => candidate.name.join(', '))
  return names
}
