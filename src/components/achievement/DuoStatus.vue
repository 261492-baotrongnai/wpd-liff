<template>
  <div class="duo-status">
    <div class="status-item">
      <span class="label">สะสมแต้มได้:</span>
      <span class="value">{{ points }}</span>
      <span class="label">แต้ม</span>
    </div>
    <div class="status-item">
      <span class="label">บันทึกติดต่อกัน:</span>
      <span class="value">{{ streaks }}</span>
      <span class="label">วัน</span>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DuoStatus',
  props: {
    points: {
      type: Number,
      required: true,
    },
    streaks: {
      type: Number,
      required: true,
    },
  },
}
</script>

<style scoped>
.duo-status {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  justify-content: center; /* Centers items horizontally */
  align-items: center; /* Centers items vertically */

  border: #1d1d1d solid 1px;
  padding: 10px;
  border-radius: 8px;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centers items horizontally */
  text-align: center; /* Centers text inside the item */
  justify-content: center; /* Centers items vertically */
  width: 150px;
  margin: 5px 0;
  position: relative; /* Needed for the divider */
}

.status-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 1px;
  background-color: #8c8c8c; /* Light grey color for the divider */
}

.label {
  font-weight: bold;
}

.value {
  color: #4caf50;
}
</style>
