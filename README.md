# Involta - RSS News Aggregator

Nuxt 4 приложение для агрегации и отображения новостей из RSS-лент с поиском, фильтрацией и пагинацией.

## Возможности

- 📰 Агрегация новостей из нескольких RSS источников (mos.ru, lenta.ru)
- 🔍 Полнотекстовый поиск с подсветкой совпадений (Fuse.js)
- 🎯 Фильтрация по источникам
- 📄 Пагинация результатов
- 🎨 Переключение между grid/list видами
- 💾 Кэширование данных
- 🔄 Автоматическое обновление каждые 5 минут
- ⚡ Server-side rendering (SSR)

## Технологии

- **Framework**: Nuxt 4
- **UI**: Vue 3 (Composition API), Tailwind CSS
- **State Management**: Pinia
- **Search**: Fuse.js
- **RSS Parsing**: rss-parser
- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with Nuxt preset

## Установка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для production
npm run build
```

## Структура проекта

```
involta/
├── app/
│   ├── components/          # Vue компоненты
│   ├── composables/        # Переиспользуемые composables
│   ├── pages/              # Страницы приложения
│   ├── stores/             # Pinia stores
│   └── utils/              # Клиентские утилиты
├── server/
│   ├── api/                # API endpoints
│   ├── tasks/              # Scheduled tasks
│   └── utils/              # Серверные утилиты
├── types/                  # Shared TypeScript типы
└── nuxt.config.ts         # Конфигурация Nuxt
```

## API Endpoints

### GET /api/articles
Получение списка статей с фильтрацией, поиском и пагинацией.

### GET /api/articles/sources
Получение списка доступных источников новостей.

### POST /api/articles/refresh
Принудительное обновление кэша RSS лент.

## Разработка

```bash
# Проверка типов
npm run typecheck

# Линтинг
npm run lint
npm run lint:fix
```

## Лицензия

MIT
