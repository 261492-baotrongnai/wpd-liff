<template>
  <div class="share-button-wrapper">
    <button class="share-button">แชร์ให้คนอื่นดู</button>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ShareButton',
}
</script>

<style scoped>
.share-button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.share-button {
  background-color: #b5e1c2;
  border: 1px solid #747474;
  border-radius: 10px;
  color: rgb(47, 47, 47);
  padding: 5px 12px;
  font-size: 14px;
  cursor: pointer;
  width: fit-content;
  min-width: 120px;
  height: 36px;
  text-align: center;
}
</style>
