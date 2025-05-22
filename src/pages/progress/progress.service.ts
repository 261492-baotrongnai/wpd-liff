import { apiService } from '@/services/api.service'
import type { Meal, MealStats } from '../types/meal.types'

export async function getAllProgress(): Promise<{ date: string; grade: string }[] | undefined> {
  try {
    const response = await apiService.get<Meal[]>('/meals/all')

    // Group meals by date in the client's timezone and calculate avgScore for each date
    const groupedByDate: Record<string, { totalScore: number; count: number }> = {}

    // Get the client's local timezone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    for (const meal of response) {
      // Convert the meal's createdAt to the client's local date
      const localDate = new Date(meal.createdAt).toLocaleDateString('en-CA', {
        timeZone, // Use the client's timezone
      }) // Format as YYYY-MM-DD

      if (!groupedByDate[localDate]) {
        groupedByDate[localDate] = { totalScore: 0, count: 0 }
      }
      groupedByDate[localDate].totalScore += meal.avgScore
      groupedByDate[localDate].count += 1
    }
    console.log('Grouped by date:', groupedByDate)

    // Transform grouped data into an array of { date, avgScore }
    const result = Object.entries(groupedByDate).map(([date, { totalScore, count }]) => ({
      date,
      grade: scoreToGrade(totalScore / count), // Calculate the average score
    }))

    console.log('All progress grouped by client timezone:', result)
    return result
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

export function scoreToGrade(score: number): string {
  if (score <= 1.5) {
    return 'A'
  }
  if (score <= 2.5) {
    return 'B'
  }
  return 'C'
}
