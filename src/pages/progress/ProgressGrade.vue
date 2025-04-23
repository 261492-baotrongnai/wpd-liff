<template>
  <div class="grade-box">
    <div class="grade-section">
      <p>เกรดเฉลี่ย</p>
      <p>{{ period }}</p>
    </div>

    <div class="grade-section">
      <p>{{ grade ? grade : 'A' }}</p>
    </div>

    <div class="grade-section">
      <div style="background-color: #ccc">image char</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ProgressGrade',
  props: {
    grade: {
      type: String,
      required: false,
    },
    period: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.grade-box {
  width: 100%;
  height: 100px;
  background-color: #ffffff;
  border-radius: 8px;
  display: flex; /* Use Flexbox for layout */
  justify-content: space-between; /* Space out the sections */
  align-items: center; /* Center items vertically */
  font-size: 24px;
  color: #333;
  border: 1px solid #8a8a8a;
  padding: 10px; /* Add padding for spacing */
}

.grade-section {
  flex: 1; /* Make each section take up equal space */
  text-align: center; /* Center text horizontally */
}
</style>
