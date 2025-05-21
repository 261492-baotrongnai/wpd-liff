import { apiService } from '@/services/api.service'
import type { Meal, MealStats } from '../types/meal.types'

export async function getAllProgress(): Promise<Meal[] | undefined> {
  try {
    const response = await apiService.get<Meal[]>('/meals/all')
    for (const meal of response) {
      const rsp = await apiService.get<{ signed_url: string }>(
        `/images/meal_image?file_name=${meal.imageName}`,
      )
      meal.signedUrl = rsp.signed_url
      meal.foodNames = meal.foods.map((f) => f.name).join(', ')
    }
    console.log('Progress list:', response[0].avgGrade)
    return response
  } catch (error) {
    console.error('Error fetching progress list:', error)
  }
}

export async function getTodayMeals(): Promise<Meal[] | undefined> {
  try {
    const response = await apiService.get<Meal[]>('/meals/today')

    for (const meal of response) {
      const rsp = await apiService.get<{ signed_url: string }>(
        `/images/meal_image?file_name=${meal.imageName}`,
      )
      meal.signedUrl = rsp.signed_url
      meal.foodNames = meal.foods.map((f) => f.name).join(', ')
    }

    // Sort meals by mealType
    const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack']
    response.sort((a, b) => mealOrder.indexOf(a.mealType) - mealOrder.indexOf(b.mealType))

    console.log('Today progress:', response)

    return response
  } catch (error) {
    console.error('Error fetching today progress:', error)
  }
}

export async function getTodayMealsAndStats(): Promise<
  { meals: Meal[]; stats: MealStats } | undefined
> {
  try {
    const response = await apiService.get<{ meals: Meal[]; stats: MealStats }>(`/meals/today/stats`)

    for (const meal of response.meals) {
      const rsp = await apiService.get<{ signed_url: string }>(
        `/images/meal_image?file_name=${meal.imageName}`,
      )
      meal.signedUrl = rsp.signed_url
      meal.foodNames = meal.foods.map((f) => f.name).join(', ')
    }

    // Sort meals by mealType
    const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack']
    response.meals.sort((a, b) => mealOrder.indexOf(a.mealType) - mealOrder.indexOf(b.mealType))

    console.log('Today progress:', response)

    return { meals: response.meals, stats: response.stats }
  } catch (error) {
    console.error('Error fetching today progress:', error)
  }
}

export async function getDayMealsAndStats(
  date: string,
): Promise<{ meals: Meal[]; stats: MealStats } | undefined> {
  try {
    const response = await apiService.get<{ meals: Meal[]; stats: MealStats }>(
      `/meals/day/stats?date=${date}`,
    )

    for (const meal of response.meals) {
      const rsp = await apiService.get<{ signed_url: string }>(
        `/images/meal_image?file_name=${meal.imageName}`,
      )
      meal.signedUrl = rsp.signed_url
      meal.foodNames = meal.foods.map((f) => f.name).join(', ')
    }

    // Sort meals by mealType
    const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack']
    response.meals.sort((a, b) => mealOrder.indexOf(a.mealType) - mealOrder.indexOf(b.mealType))

    console.log('Day progress:', response)

    return { meals: response.meals, stats: response.stats }
  } catch (error) {
    console.error('Error fetching today progress:', error)
  }
}

export async function getDayMeals(date: string): Promise<Meal[] | undefined> {
  try {
    const response = await apiService.get<Meal[]>(`/meals/day`, {
      params: { date },
    })
    for (const meal of response) {
      const rsp = await apiService.get<{ signed_url: string }>(
        `/images/meal_image?file_name=${meal.imageName}`,
      )
      meal.signedUrl = rsp.signed_url
      meal.foodNames = meal.foods.map((f) => f.name).join(', ')
    }

    // Sort meals by mealType
    const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack']
    response.sort((a, b) => mealOrder.indexOf(a.mealType) - mealOrder.indexOf(b.mealType))

    console.log('Day progress:', response)
    return response
  } catch (error) {
    console.error('Error fetching day progress:', error)
  }
}
