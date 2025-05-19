import { apiService } from '@/services/api.service'
import type { Meal } from '../types/meal.types'

export async function getAllProgress(): Promise<Meal[] | undefined> {
  try {
    const response = await apiService.get<Meal[]>('/meals/all')
    console.log('Progress list:', response[0].avgGrade)
    return response
  } catch (error) {
    console.error('Error fetching progress list:', error)
  }
}

export async function getTodayProgress(): Promise<Meal[] | undefined> {
  try {
    const response = await apiService.get<Meal[]>('/meals/today')
    console.log('Today progress:', response)
    return response
  } catch (error) {
    console.error('Error fetching today progress:', error)
  }
}
