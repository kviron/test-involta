<script setup lang="ts">
import * as dayjs from "dayjs";
import "dayjs/locale/ru";

dayjs.locale("ru");
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
