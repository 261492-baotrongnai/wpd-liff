<template>
  <div class="mali-gauge">
    <div class="current-mali">
      <span class="mali-stage">{{ currentMali.mali }}</span>
    </div>
    <div class="gauge-bar">
      <div class="gauge-fill" :style="{ width: gaugePercentage + '%' }"></div>
      <div class="gauge-text">{{ totalDays }}/{{ nextThreshold }}</div>
    </div>
    <div class="remaining-streaks">
      <span v-if="remainingStreaks > 0"
        >บันทึกอีก {{ remainingStreaks }} วัน จะได้ {{ nextMali.mali }}</span
      >
      <span v-else>บันทึกครบ 90 วันแล้ว! เก่งมากค่ะ</span>
    </div>
    <div class="mali-image">
      <img :src="currentMali.image" alt="Mali Image" />
    </div>
  </div>
</template>

<script lang="ts">
import level5Image from '@/assets/mali-level/mali level 5.png'
import level4Image from '@/assets/mali-level/mali level 4.png'
import level3Image from '@/assets/mali-level/mali level 3.png'
import level2Image from '@/assets/mali-level/mali level 2.png'
import level1Image from '@/assets/mali-level/mali level 1.png'
import starterImage from '@/assets/mali-level/mali level 0.png'

export default {
  name: 'MaliComponent',
  props: {
    totalDays: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      maliData: [
        {
          mali: 'ต้นอ่อนมะลิ',
          level: 'starter',
          threshold: 0,
          image: starterImage,
        },
        {
          mali: 'พุ่มมะลิจิ๋ว',
          level: '1',
          threshold: 1,
          image: level1Image,
        },
        {
          mali: 'พุ่มมะลิ',
          level: '2',
          threshold: 10,
          image: level2Image,
        },
        {
          mali: 'มะลิดอกตูม',
          level: '3',
          threshold: 30,
          image: level3Image,
        },
        {
          mali: 'มะลิดอกบาน',
          level: '4',
          threshold: 60,
          image: level4Image,
        },
        {
          mali: 'มะลิหอมฟุ้ง',
          level: '5',
          threshold: 75,
          image: level5Image,
        },
        {
          mali: 'มะลิหอมฟุ้งข้ามรั้ว',
          level: 'max',
          threshold: 90,
          image: level5Image,
        },
      ],
    }
  },
  computed: {
    currentMali() {
      return (
        this.maliData
          .slice()
          .reverse()
          .find((item) => this.totalDays >= item.threshold) || this.maliData[0]
      )
    },
    nextThreshold() {
      const currentIndex = this.maliData.findIndex(
        (item) => item.threshold === this.currentMali.threshold,
      )
      return this.maliData[currentIndex + 1]?.threshold || this.currentMali.threshold
    },
    nextMali() {
      const currentIndex = this.maliData.findIndex(
        (item) => item.threshold === this.currentMali.threshold,
      )
      return this.maliData[currentIndex + 1] || this.currentMali
    },
    remainingStreaks() {
      return Math.max((this.nextThreshold ?? 0) - this.totalDays, 0)
    },
    gaugePercentage() {
      const currentThreshold = this.currentMali.threshold
      const nextThreshold = this.nextThreshold
      if (nextThreshold === currentThreshold) {
        return 100 // Max level
      }
      return ((this.totalDays - currentThreshold) / (nextThreshold - currentThreshold)) * 100
    },
  },
}
</script>

<style scoped>
.mali-stage {
  color: #194678;
  font-family: 'Noto Looped Thai UI Medium';
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px; /* 145.455% */
  letter-spacing: 0.22px;
}
.mali-gauge {
  text-align: center;
  padding-left: 30px;
  padding-right: 30px;
}

.current-mali {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.gauge-bar {
  position: relative;
  height: 22px;
  background-color: #efefef;
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 20px 10px 20px;
}

.gauge-fill {
  height: 100%;
  background-color: #d2edff;
  transition: width 0.3s ease;
}

.gauge-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #194678;
  font-family: merry;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px; /* 160% */
  letter-spacing: 0.2px;
}

.remaining-streaks {
  color: #194678;
  text-align: center;
  font-family: 'Noto Looped Thai UI';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px; /* 200% */
  letter-spacing: 0.16px;
}

.mali-image {
  width: 90%; /* Adjust the width */
  height: auto; /* Maintain aspect ratio */
  margin-top: 21px; /* Optional: Add spacing */
  margin-bottom: 10px;
  margin-inline: auto; /* Center the image */
  padding-inline: 20%; /* Optional: Add spacing */
}

.share-button {
  background-color: #ffffffd9;
  color: rgb(50, 50, 50);
  border: black solid 1px;
  padding: 5px 10px;
  border-radius: 50px;
  cursor: pointer;
}
</style>
