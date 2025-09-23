import type { User } from './user.types'

export interface Meal {
  id: number
  mealType: string
  imageName: string
  signedUrl: string
  avgGrade: string
  avgScore: number
  foods: Food[]
  user: User
  createdAt: string
  updatedAt: string
  foodNames: string
}

export interface Food {
  id: number
  name: string
  description: string
  grade: string
  grading_by_rule: boolean
}

export interface MealStats {
  avgScore: number
  avgGrade: string
  totalMeal: number
  countA: number
  countB: number
  countC: number
  totalFood: number
}
