<template>
  <div id="app">
    <h1>Achievement</h1>
    <p v-if="message">{{ message }}</p>
    <p v-if="idtoken">{{ idtoken }}</p>
    <p v-if="error">
      <code>{{ error }}</code>
    </p>
    <p v-if="user">{{ user }}</p>
    <button v-if="idtoken" @click="logout">Logout</button>
  </div>
</template>
<script lang="ts">
export default {
  name: 'AchievementIndex',
}
</script>
<style></style>
