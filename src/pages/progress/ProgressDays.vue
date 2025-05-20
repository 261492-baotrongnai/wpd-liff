<template>
  <form>
    <input
      v-model="selectedDate"
      type="date"
      class="date-input"
      @change="updateSelectedDate($event.target.value)"
    />
  </form>
  <div v-if="meals" class="progress-days">
    <div v-for="meal in meals" :key="meal.id" class="meal-item">
      <p>{{ meal.id }}</p>
      <p v-for="food in meal.foods" :key="food.id" class="food-item">{{ food.name }}</p>
    </div>
  </div>
</template>
<script lang="ts">
import type { Meal } from '../types/meal.types'
import { getTodayProgress, getDayProgress } from './progress.service'

export default {
  name: 'ProgressDays',

  data() {
    return {
      meals: null as Meal[] | null | undefined,
      selectedDate: new Date().toISOString().split('T')[0], // Set default date to today
    }
  },
  methods: {
    updateSelectedDate(date: string) {
      console.log('Selected date:', date)
      this.selectedDate = date
      console.log('Selected date iso format :', this.selectedDate)
      this.fetchMeals()
    },
    async fetchMeals() {
      this.meals = await getDayProgress(this.selectedDate)
    },
  },
  async mounted() {
    this.meals = await getTodayProgress()
  },
}
</script>
<style scoped>
.date-input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #505050;
  color: black;
}
</style>
