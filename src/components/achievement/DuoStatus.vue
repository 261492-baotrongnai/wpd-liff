<template>
  <div class="duo-status">
    <div class="status-item">
      <span class="label">สะสมแต้มได้</span>
      <span class="value">{{ points }}</span>
      <span class="label-unit">แต้ม</span>
    </div>
    <div class="status-item">
      <span class="label">บันทึกต่อเนื่องแล้ว</span>
      <span class="value">{{ streaks }}</span>
      <span class="label-unit">วัน</span>
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
  justify-content: center; /* Centers items horizontally */
  align-items: center; /* Centers items vertically */
  background: #ffffff;
  fill: #fff;
  filter: drop-shadow(0 4px 2px rgba(193, 193, 193, 0.25));
  padding: 10px;
  border-radius: 8px;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centers items horizontally */
  text-align: center; /* Centers text inside the item */
  justify-content: center; /* Centers items vertically */
  width: 200px;
  margin: 5px 0;
  position: relative; /* Needed for the divider */
}

.status-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 3px;
  border-radius: 90px;
  background-color: #ECEFF2; /* Light grey color for the divider */
}

.label {
  color: #194678;
  /* Paragraph2 */
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 155.556% */
  letter-spacing: 0.18px;
}

.label-unit {
  margin-top: 15px;
  color: #194678;
  /* Paragraph2 */
  font-family: 'Noto Looped Thai UI';
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 155.556% */
  letter-spacing: 0.18px;
}
@media (max-width: 350px) {
  .status-item {
    width: 150px;
  }
  .status-item:not(:last-child)::after {
    width: 2px;
  }
  .label {
    font-size: 16px;
    line-height: 24px;
  }
  .label-unit {
    font-size: 16px;
    line-height: 24px;
  }
  .value {
    font-size: 32px;
    line-height: 24px;
  }

}
.value {
  margin-top: 7px;
  color: #194678;
  text-align: center;
  font-family: 'meejai Thin';
  font-size: 40px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 70% */
  letter-spacing: 0.4px;
}
</style>
