<script setup lang="ts">
import type { Source } from "../../../types/articles";

defineProps<{
  sources: Source[];
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const updateSource = (source: string) => {
  emit("update:modelValue", source);
};
</script>

<template>
  <div class="flex items-center gap-6" role="radiogroup" aria-label="Источники">
    <button
      type="button"
      role="radio"
      :aria-checked="modelValue === ''"
      class="font-bold transition-colors"
      :class="modelValue === '' ? 'text-primary-main' : 'text-black'"
      @click="updateSource('')"
    >
      Все
    </button>
    <button
      v-for="source in sources"
      :key="source.id"
      type="button"
      role="radio"
      :aria-checked="modelValue === source.id"
      class="font-bold transition-colors"
      :class="modelValue === source.id ? 'text-primary-main' : 'text-black'"
      @click="updateSource(source.id)"
    >
      {{ source.domain }}
    </button>
  </div>
</template>
