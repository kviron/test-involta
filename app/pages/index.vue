<script setup lang="ts">
const articles = await $fetch('/api/articles');
</script>

<template>
  <Container>
    <ArticleList :articles="articles" />
  </Container>
</template>
