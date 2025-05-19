export interface Meal {
  id: number
  mealType: string
  inageName: string
  avgGrade: string
  avgScore: number
  foods: Food[]
  createdAt: string
  updatedAt: string
}

export interface Food {
  id: number,
  name: string,
  description: string,
  grade: string,
}
