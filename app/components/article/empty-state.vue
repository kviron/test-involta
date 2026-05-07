<template>
  <div
    class="flex flex-col items-center justify-center gap-6 rounded-md px-8 py-16 text-center"
    role="status"
    aria-live="polite"
  >
    <div
      class="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-primary-main/[0.06]"
      aria-hidden="true"
    >
      <svg
        class="h-9 w-9 text-primary-main/90"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    </div>
    <div class="flex max-w-md flex-col gap-2">
      <p class="text-xl font-bold text-primary-main">Ничего не найдено</p>
      <p class="text-sm leading-relaxed text-secondary-main">
        Попробуйте изменить поисковый запрос или выбрать другой источник в
        фильтре выше.
      </p>
    </div>
  </div>
</template>
