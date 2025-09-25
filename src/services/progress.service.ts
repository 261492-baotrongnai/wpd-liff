import { apiService } from '@/services/api.service'
import type { Food, Meal, MealStats } from '../types/meal.types'

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

    // Determine if grading should follow the rule: true if any food in any meal has grading_by_rule === true
    const gradingByRule = response.some((meal) =>
      meal.foods?.some((f: Food) => f.grading_by_rule === true),
    )

    // Transform grouped data into an array of { date, avgScore }
    const result = Object.entries(groupedByDate).map(([date, { totalScore, count }]) => ({
      date,
      grade: gradingByRule
        ? scoreToGradeForRuleBased(totalScore / count)
        : scoreToGrade(totalScore / count),
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
  { meals: Meal[]; stats: MealStats; formattedMeals: TimeMeal[] | null } | undefined
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

    const formattedMeals = await formatMealInfoForCard(response.meals)

    return { meals: response.meals, stats: response.stats, formattedMeals }
  } catch (error) {
    console.error('Error fetching today progress:', error)
  }
}

export type TimeMeal = {
  time: string
  meals: Meal[]
}

export async function formatMealInfoForCard(meals: Meal[]): Promise<TimeMeal[] | null> {
  try {
    if (!meals || meals.length === 0) {
      console.warn('No meals found for formatting')
      throw new Error('No meals to format')
    }
    const timeMeals: Record<string, Meal[]> = {}
    meals.forEach((meal) => {
      const mealTime = new Date(meal.createdAt).toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Use 24-hour format
      })
      if (!timeMeals[mealTime]) {
        timeMeals[mealTime] = []
      }
      timeMeals[mealTime].push(meal)
    })

    return Object.entries(timeMeals).map(([time, meals]) => ({ time, meals }))
  } catch (error) {
    console.error('Error formatting meal info for card:', error)
    return null
  }
}

export async function getDayMealsAndStats(
  date: string,
): Promise<{ meals: Meal[]; stats: MealStats; formattedMeals: TimeMeal[] | null } | undefined> {
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

    const formattedMeals = await formatMealInfoForCard(response.meals)

    return { meals: response.meals, stats: response.stats, formattedMeals }
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

export function scoreToGradeForRuleBased(score: number): string {
  if (score >= 6) {
    return 'A'
  } else if (score >= 2) {
    return 'B'
  }
  return 'C'
}

export async function getTodaySummary(): Promise<MealStats | undefined> {
  const response = await apiService.get<MealStats>(`/meals/today-summary`)
  return response
}

export async function getWeekSummary(): Promise<MealStats | undefined> {
  const response = await apiService.get<MealStats>(`/meals/week-summary`)
  return response
}

export async function getMonthSummary(): Promise<MealStats | undefined> {
  const response = await apiService.get<MealStats>(`/meals/month-summary`)
  return response
}

export async function uploadExportPoster(file: File, uid: string) {
  const response = await apiService.post(
    `/user-states/upload-export-poster`,
    { file, uid, state_name: 'date-poster' },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
  return response
}

export async function getUserCurrentFrame() {
  const response = (await apiService.get)<string>(`/users/current-frame`)
  return response
}
