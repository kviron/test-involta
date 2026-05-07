<script setup lang="ts">
import { storeToRefs } from "pinia";
import ResetIcon from "~/assets/icons/reset.svg";
import SearchIcon from "~/assets/icons/search.svg";

const articlesStore = useArticlesStore();
const { q, isRefreshing } = storeToRefs(articlesStore);

const handleReset = async () => {
  await articlesStore.reset();
};
</script>

<template>
  <Container
    class="flex md:justify-between items-center my-8 flex-col md:flex-row gap-5"
  >
    <div class="w-full flex gap-8">
      <div class="text-4xl font-bold">Список новостей</div>
      <UiButton
        type="button"
        class="flex items-center bg-white justify-center rounded-full shadow-soft w-[40px] h-[40px]"
        :disabled="isRefreshing"
        @click="handleReset"
      >
        <ResetIcon
          class="fill-primary-main"
          :class="{ 'animate-spin': isRefreshing }"
        />
      </UiButton>
    </div>
    <div class="w-full md:w-auto">
      <UiInput
        v-model="q"
        type="search"
        name="q"
        placeholder="Поиск..."
        autocomplete="off"
        aria-label="Поиск по статьям"
        class="w-full md:w-auto min-w-[300px]"
      >
        <template #icon>
          <SearchIcon class="fill-secondary-main" />
        </template>
      </UiInput>
    </div>
  </Container>
  <Container>
    <UiHr />
  </Container>
</template>
