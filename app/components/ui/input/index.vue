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
  <input
    :type="props.type"
    :value="props.modelValue"
    class="border-none text-black shadow-soft placeholder:text-secondary-main min-w-0 rounded-md border bg-white px-3 py-2 text-sm min-h-10"
    v-bind="attrs"
    @input="onInput"
  />
</template>
