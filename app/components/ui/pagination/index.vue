<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    totalPages: number;
    currentPage: number;
    siblingCount?: number;
  }>(),
  {
    siblingCount: 2,
  },
);

const emit = defineEmits<{
  (e: "change", page: number): void;
}>();

const pagesToShow = computed<(number | "...")[]>(() => {
  const total = Math.max(props.totalPages, 0);
  const current = Math.min(Math.max(props.currentPage, 1), total || 1);

  if (total <= 1) return [1];
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const start = Math.max(2, current - props.siblingCount);
  const end = Math.min(total - 1, current + props.siblingCount);
  const result: (number | "...")[] = [1];

  if (start > 2) result.push("...");
  for (let page = start; page <= end; page += 1) result.push(page);
  if (end < total - 1) result.push("...");

  result.push(total);
  return result;
});

const goToPage = (page: number) => {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return;
  emit("change", page);
};
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="flex items-center gap-1 font-bold text-lg"
    aria-label="Pagination"
  >
    <button
      class="px-3 py-1 border-none disabled:opacity-50"
      :disabled="currentPage <= 1"
      @click="goToPage(currentPage - 1)"
    >
      Назад
    </button>

    <template v-for="(page, index) in pagesToShow" :key="`${page}-${index}`">
      <span v-if="page === '...'" class="px-2 text-gray-500">...</span>
      <button
        v-else
        class="px-3 py-1 border-none"
        :class="{ 'text-primary-main': page === currentPage }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
    </template>

    <button
      class="px-3 py-1 border-none disabled:opacity-50"
      :disabled="currentPage >= totalPages"
      @click="goToPage(currentPage + 1)"
    >
      Вперед
    </button>
  </nav>
</template>
