<template>
  <div class="mali-gauge">
    <div class="current-mali">
      <span :style="{ color: currentMali.color }">{{ currentMali.mali }}</span>
    </div>
    <div class="gauge-bar">
      <div class="gauge-fill" :style="{ width: gaugePercentage + '%' }"></div>
      <div class="gauge-text">{{ streaks }}/{{ nextThreshold }}</div>
    </div>
    <div class="remaining-streaks">
      <span v-if="remainingStreaks > 0"
        >บันทึกติดต่อกันอีก {{ remainingStreaks }} วัน จะได้ {{ nextMali.mali }}</span
      >
      <span v-else>บันทึกติดต่อกัน 90 วันแล้ว! เก่งมากค่ะ</span>
    </div>
    <div class="mali-image">
      <img :src="currentMali.image" alt="Mali Image" />
    </div>

    <button class="share-button">แชร์ให้ทุกคนดูเลย!</button>
  </div>
</template>

<script lang="ts">
import level5Image from '@/assets/mali-level/level5.jpg'
import level4Image from '@/assets/mali-level/level4.jpg'
import level3Image from '@/assets/mali-level/level3.jpg'
import level2Image from '@/assets/mali-level/level2.jpg'
import level1Image from '@/assets/mali-level/level1.jpg'
import starterImage from '@/assets/mali-level/starter.jpg'

export default {
  name: 'MaliComponent',
  props: {
    streaks: {
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
          color: '#2196f3',
          image: starterImage,
        },
        {
          mali: 'พุ่มมะลิจิ๋ว',
          level: '1',
          threshold: 1,
          color: '#4caf50',
          image: level1Image,
        },
        {
          mali: 'พุ่มมะลิ',
          level: '2',
          threshold: 10,
          color: '#ff9800',
          image: level2Image,
        },
        {
          mali: 'มะลิดอกตูม',
          level: '3',
          threshold: 30,
          color: '#f44336',
          image: level3Image,
        },
        {
          mali: 'มะลิดอกบาน',
          level: '4',
          threshold: 60,
          color: '#9c27b0',
          image: level4Image,
        },
        {
          mali: 'มะลิหอมฟุ้ง',
          level: '5',
          threshold: 75,
          color: '#673ab7',
          image: level5Image,
        },
        {
          mali: 'มะลิหอมฟุ้งข้ามรั้ว',
          level: 'max',
          threshold: 90,
          color: '#3f51b5',
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
          .find((item) => this.streaks >= item.threshold) || this.maliData[0]
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
      return Math.max((this.nextThreshold ?? 0) - this.streaks, 0)
    },
    gaugePercentage() {
      const currentThreshold = this.currentMali.threshold
      const nextThreshold = this.nextThreshold
      if (nextThreshold === currentThreshold) {
        return 100 // Max level
      }
      return ((this.streaks - currentThreshold) / (nextThreshold - currentThreshold)) * 100
    },
  },
}
</script>

<style scoped>
.mali-gauge {
  text-align: center;
  padding-left: 60px;
  padding-right: 60px;
}

.current-mali {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.gauge-bar {
  position: relative;
  height: 20px;
  background-color: #ccc;
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0;
}

.gauge-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}

.gauge-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  font-weight: bold;
  color: #fff;
}

.remaining-streaks {
  font-size: 14px;
  margin-top: 10px;
}

.mali-image {
  width: 80%; /* Adjust the width */
  height: auto; /* Maintain aspect ratio */
  margin-top: 10px; /* Optional: Add spacing */
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
.share-button:hover {
  background-color: #c5ed94;
}
</style>
