<script setup lang="ts">
const articlesStore = useArticlesStore();
const isRefreshing = ref(false);

const handleReset = async () => {
  if (isRefreshing.value) return;

  isRefreshing.value = true;
  try {
    articlesStore.setSource("");
    articlesStore.setPagination({ page: 1 });

    await $fetch("/api/articles/refresh", { method: "POST" });
    await Promise.all([
      refreshNuxtData("articles"),
      refreshNuxtData("article-sources"),
    ]);
  } finally {
    isRefreshing.value = false;
  }
};
</script>

<template>
  <Container class="flex justify-between align-center items-center my-8">
    <div class="flex items-center gap-2">
      <div class="text-4xl font-bold">Список новостей</div>
      <UiButton
        type="button"
        class="flex items-center justify-center rounded-full shadow-soft w-[40px] h-[40px]"
        :disabled="isRefreshing"
        @click="handleReset"
      >
        <img src="~/assets/icons/reset.svg" alt="Reset" />
      </UiButton>
    </div>
    <div></div>
  </Container>
  <Container>
    <UiHr />
  </Container>
</template>
