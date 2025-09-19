<template>
  <div class="box">
    <p class="stat-title">
      <img :src="icon" alt="" class="stat-icon" />
      <span>สถิติบันทึกนานสุด</span>
    </p>

    <div class="progress">
      <div
        v-for="(item, index) in progressData"
        :key="item.threshold"
        class="progress-item-container"
      >
        <!-- เหรียญ (ใช้รูปภาพ) -->
        <div class="badge-wrap">
          <img
            class="badge"
            :src="streaks >= item.threshold ? item.imgActive : item.imgInactive"
            :alt="`${item.threshold}-day badge`"
          />
        </div>

        <!-- เส้นเชื่อม เปลี่ยนสีตาม stage -->
        <div
          v-if="index < progressData.length - 1"
          class="progress-line"
          :style="{ background: item.lineBase }"
        >
          <div class="progress-line-fill" :style="getLineStyle(index)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import icon from '@/assets/achievement/active-stat-icon.png'

// ✅ ใส่พาธรูปเหรียญของคุณเองให้ตรงตามโปรเจกต์
// — Active
import b10On from '@/assets/achievement/badges/10-on.png'
import b30On from '@/assets/achievement/badges/30-on.png'
import b60On from '@/assets/achievement/badges/60-on.png'
import b90On from '@/assets/achievement/badges/90-on.png'
// — Inactive
import b10Off from '@/assets/achievement/badges/10-off.png'
import b30Off from '@/assets/achievement/badges/30-off.png'
import b60Off from '@/assets/achievement/badges/60-off.png'
import b90Off from '@/assets/achievement/badges/90-off.png'

export default {
  name: 'ProgressCoin',
  props: {
    coinAchieves: { type: Array, required: true },
    streaks: { type: Number, required: true },
  },
  data() {
    return {
      icon,
      // กำหนดเหรียญ + สีเส้นของแต่ละสเตจ
      progressData: [
        {
          threshold: 10,
          imgActive: b10On,
          imgInactive: b10Off,
          lineBase: '#EFEFEF', // สีพื้นของเส้นช่วง 10→30
          lineColor: '#B99F83', // สีตอนเติม
        },
        {
          threshold: 30,
          imgActive: b30On,
          imgInactive: b30Off,
          lineBase: '#EFEFEF',
          lineColor: '#86A3BC',
        },
        {
          threshold: 60,
          imgActive: b60On,
          imgInactive: b60Off,
          lineBase: '#EFEFEF',
          lineColor: '#FFD84D',
        },
        {
          threshold: 90,
          imgActive: b90On,
          imgInactive: b90Off,
        },
      ],
    }
  },
  methods: {
    getLineStyle(index: number) {
      const cur = this.progressData[index].threshold
      const next = this.progressData[index + 1].threshold
      const fill = this.progressData[index].lineColor

      if (this.streaks >= next) {
        return { width: '100%', background: fill }
      } else if (this.streaks > cur) {
        const pct = ((this.streaks - cur) / (next - cur)) * 100
        return { width: `${pct}%`, background: fill }
      } else {
        return { width: '0%', background: fill }
      }
    },
  },
}
</script>

<style scoped>
/* กล่อง + เส้นบน/ล่าง ปลายมน */
.box {
  position: relative;
  padding: 20px 0 25px 0;
  margin: 25px 0 25px 0;
  background: #fff;
}
.box::before,
.box::after {
  content: '';
  position: absolute;
  left: 7px;
  right: 7px;
  height: 2.5px;
  background: #eceff2;
  border-radius: 999px;
  z-index: 1;
  pointer-events: none;
}
.box::before {
  top: 0;
}
.box::after {
  bottom: 0;
}

/* หัวข้อ */
.stat-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  color: #194678;
  font-size: 18px;
  font-family: 'Noto Looped Thai UI';
  font-weight: 600;
}
.stat-icon {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
}

/* แถวเหรียญ + เส้นเชื่อม */
.progress {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.progress-item-container {
  display: flex;
  align-items: center;
  flex-grow: 1;
}
.progress-item-container:last-child {
  max-width: fit-content;
}

.badge-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
.badge {
  width: 60px; /* ปรับขนาดเหรียญที่นี่ */
  height: 60px;
  display: block;
}

/* เส้นเชื่อม */
.progress-line {
  margin-left: 8px;
  flex-grow: 1;
  height: 6px;
  border-radius: 999px;
  background: #e0e6eb; /* จะถูก override ด้วย :style lineBase */
  position: relative;
  overflow: hidden;
}
.progress-line-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}

/* จอแคบ */
@media (max-width: 360px) {
  .badge {
    width: 50px;
    height: 50px;
  }
  .progress-line {
    height: 4px;
  }
}
</style>
