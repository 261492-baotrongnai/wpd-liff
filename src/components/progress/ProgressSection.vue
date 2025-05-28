<template>
  <div class="progress-section">
    <Diary v-if="selectedSection === 'Diary'" @updateGrade="emitGradeUpdate" />
    <Stats v-if="selectedSection === 'Stats'" @updateGrade="emitGradeUpdate" />
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
  gap: 10px;
}
</style>
