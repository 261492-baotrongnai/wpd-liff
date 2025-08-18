<template>
  <div class="progress-section">
    <Diary v-if="selectedSection === 'Diary'" @updateGrade="emitGradeUpdate" />
    <div class="stats-wrapper" v-if="selectedSection === 'Stats'">
      <Stats @updateGrade="emitGradeUpdate" />
    </div>
  </div>
</template>

<script lang="ts">
import Diary from './section-components/Diary.vue'
import Stats from './section-components/Stats.vue'

export default {
  name: 'ProgressSection',
  components: {
    Diary,
    Stats,
  },
  props: {
    selectedSection: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
  emits: ['updateGrade'], 
  methods: {
    emitGradeUpdate(newGrade: string) {
      // Emit the grade update event to the parent
      this.$emit('updateGrade', newGrade)
    },
  },
  mounted() {
    console.log('ProgressSection mounted', this.selectedSection)
  },
}
</script>

<style scoped>
.header-content {
  font-size: 16px;
  font-weight: 600;
  align-self: center;
}
.progress-section {
  display: flex;
  flex-direction: column;
  flex: 1 0 auto; /* กินพื้นที่แนวตั้งที่เหลือ */
  min-height: 0; /* สำคัญ: กัน Safari/มือถือลากเกินจอ */
}
.stats-wrapper {
  margin-top: 13px;
  /* ฉากหลังขาว */
  background: #fff;
  border-radius: 35px 35px 0 0;
  box-sizing: border-box;
  position: relative;
  left: 50%;
  right: 50%;
  transform: translateX(-50%);
  flex: 1 0 auto;
  min-height: 0;
  overflow-y: auto; /* คอนเทนเนอร์เลื่อน */
  -webkit-overflow-scrolling: touch; /* iOS momentum scroll */
  overscroll-behavior-y: contain; /* กันลากแล้วเด้งในเบราว์เซอร์ที่รองรับ */
  padding-bottom: max(12px, env(safe-area-inset-bottom));
}
</style>
