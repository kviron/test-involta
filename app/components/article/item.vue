<script setup lang="ts">
defineProps<{
  article: string;
}>();
</script>

<template>
  <div>
    <h2>{{ article }}</h2>
    <p>{{ article }}</p>
  </div>
</template>
