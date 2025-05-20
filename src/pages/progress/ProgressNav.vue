<template>
  <div class="progress-nav">
    <div
      class="nav-button"
      :class="{ active: activePeriod === 'Days' }"
      @click="setActivePeriod('Days')"
    >
      รายวัน
    </div>
    <div
      class="nav-button"
      :class="{ active: activePeriod === 'Weeks' }"
      @click="setActivePeriod('Weeks')"
    >
      รายสัปดาห์
    </div>
    <div
      class="nav-button"
      :class="{ active: activePeriod === 'Months' }"
      @click="setActivePeriod('Months')"
    >
      รายเดือน
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'ProgressNav',
  data() {
    return {
      activePeriod: 'Days',
    }
  },
  methods: {
    setActivePeriod(period: string) {
      this.activePeriod = period
      this.setPeriod(period)
    },
    setPeriod(period: string) {
      this.$emit('updatePeriod', period)
    },
  },
}
</script>
<style scoped>
.progress-nav {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: #f7f7f7;
  padding: 8px;
  border-radius: 8px;
  border: #535353 solid 1px;
}

.nav-button {
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.nav-button.active {
  background-color: #c3c3c3; /* Highlight active button */
  color: rgb(64, 64, 64);
}
</style>
