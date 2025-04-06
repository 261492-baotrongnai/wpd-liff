<template>
  <h3>ยินดีต้อนรับสู่ "หวานพอดี" นะคะ</h3>
</template>
<script lang="ts">
import { initializeLiff } from '../../utility/liffUtils'
import liff from '@line/liff'

export default {
  name: 'UserClassification',

  mounted() {
    initializeLiff('VITE_LIFF_ID_USER_CLASSIFICATION')
      .then(() => {})
      .catch((err) => {
        console.error(err.message)
      })
  },
}
</script>
<style scoped></style>
