<template>
  <div>
    <NuxtWelcome />
    <div style="padding: 2rem;">
      <h2>Suggesto Nuxt Module Test</h2>
      <p>The Suggesto widget should be loaded automatically.</p>
      <button @click="openModal">Open Feedback Modal</button>
      <p v-if="isLoading">Loading widget...</p>
      <p v-if="error" style="color: red;">Error: {{ error }}</p>
    </div>
  </div>
</template>

<script setup>
const { $suggestoConfig } = useNuxtApp();

// Use the composable with config from runtime
const { isLoading, error, openModal, on } = $suggesto($suggestoConfig);

// Listen for events
on('ready', (data) => {
  console.log('Widget ready:', data);
});

on('feedbackSubmitted', (data) => {
  console.log('Feedback submitted:', data);
});
</script>
