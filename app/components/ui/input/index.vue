<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    /** Нативный тип поля */
    type?: "text" | "search" | "email" | "password" | "url" | "tel";
  }>(),
  {
    modelValue: "",
    type: "text",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const attrs = useAttrs();

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  emit("update:modelValue", target?.value ?? "");
};
</script>

<template>
  <div class="relative">
    <input
      :type="props.type"
      :value="props.modelValue"
      class="border-none outline-none text-black shadow-soft placeholder:text-secondary-main min-w-0 rounded-md border bg-white px-3 py-2 text-sm min-h-10"
      :class="$slots.icon ? 'pr-8' : ''"
      v-bind="attrs"
      @input="onInput"
    />
    <div class="absolute right-3 top-1/2 -translate-y-1/2" v-if="$slots.icon">
      <slot name="icon" />
    </div>
  </div>
</template>
