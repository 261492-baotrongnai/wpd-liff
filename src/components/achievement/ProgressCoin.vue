<template>
  <div class="box">
    <h4>🏆 เหรียญสม่ำเสมอ</h4>
    <div class="progress">
      <div v-for="(item, index) in progressData" :key="index" class="progress-item-container">
        <!-- Coin -->
        <div
          class="progress-item"
          :style="{ backgroundColor: streaks >= item.threshold ? item.color : '#ccc' }"
        >
          <div class="coin">{{ item.days }}</div>
        </div>

        <!-- Line -->
        <div v-if="index < progressData.length - 1" class="progress-line">
          <div class="progress-line-fill" :style="getLineStyle(index)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ProgressCoin',
  props: {
    streaks: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      progressData: [
        { days: '10 วัน', threshold: 10, color: '#2196f3' },
        { days: '30 วัน', threshold: 30, color: '#4caf50' },
        { days: '60 วัน', threshold: 60, color: '#ff9800' },
        { days: '90 วัน', threshold: 90, color: '#f44336' },
      ],
    }
  },
  methods: {
    getLineStyle(index: number) {
      const currentThreshold = this.progressData[index].threshold
      const nextThreshold = this.progressData[index + 1].threshold

      if (this.streaks >= nextThreshold) {
        // Fully active line
        return { width: '100%', backgroundColor: '#4caf50' }
      } else if (this.streaks > currentThreshold) {
        // Partially active line
        const percentage =
          ((this.streaks - currentThreshold) / (nextThreshold - currentThreshold)) * 100
        return { width: `${percentage}%`, backgroundColor: '#4caf50' }
      } else {
        // Inactive line
        return { width: '0%', backgroundColor: '#ccc' }
      }
    },
  },
}
</script>

<style scoped>
.box {
  border-top: 1px solid #ccc; /* Line at the top */
  border-bottom: 1px solid #ccc; /* Line at the bottom */
  padding: 20px; /* Add some padding inside the box */
  margin: 20px 0; /* Add spacing around the box */
}

.progress {
  margin-top: 10px;
  display: flex;
  flex-direction: row; /* Stack items horizontally */
  align-items: center; /* Align items vertically */
  gap: 4px; /* Add spacing between coins */
}

.progress-item-container {
  display: flex;
  align-items: center;
  flex-grow: 1; /* Allow the container to stretch dynamically */
}

.progress-item-container:last-child {
  max-width: fit-content;
}

.progress-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px; /* Adjust the size of the coin */
  height: 50px;
  border-radius: 50%; /* Make it circular */
  transition: background-color 0.3s ease;
}

.progress-line {
  margin-left: 4px;
  flex-grow: 1; /* Allow the line to stretch dynamically */
  height: 2px; /* Adjust the thickness of the line */
  background-color: #ccc; /* Default line color */
  position: relative;
}

.progress-line-fill {
  height: 100%;
  background-color: #4caf50; /* Active line color */
  position: absolute;
  top: 0;
  left: 0;
  transition: width 0.3s ease;
}

.coin {
  font-size: 14px;
  color: #fff; /* White text for better contrast */
  text-align: center;
}
</style>
