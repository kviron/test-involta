<script setup lang="ts">
import { storeToRefs } from "pinia";

const articlesStore = useArticlesStore();
const { q } = storeToRefs(articlesStore);
const isRefreshing = ref(false);

const handleReset = async () => {
  if (isRefreshing.value) return;

  isRefreshing.value = true;
  try {
    await articlesStore.reset();
  } finally {
    isRefreshing.value = false;
  }
};
</script>

<template>
  <Container class="flex justify-between align-center items-center my-8">
    <div class="flex items-center gap-8">
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
    <div>
      <UiInput
        v-model="q"
        type="search"
        name="q"
        placeholder="Поиск по заголовку и описанию"
        autocomplete="off"
        aria-label="Поиск по статьям"
      />
    </div>
  </Container>
  <Container>
    <UiHr />
  </Container>
</template>
