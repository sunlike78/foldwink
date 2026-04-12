# Puzzle B2B Master Plan v2

## 1. Executive summary

Цель проекта — превратить одну простую, интеллектуальную игровую механику в B2B-сервис, который можно:
- быстро брендировать под клиента;
- быстро наполнять клиентским контентом;
- встраивать на сайт или в продукт;
- сопровождать по подписке;
- продавать как managed engagement layer, а не как разовую игру.

Базовая коммерческая логика:
1. быстрый запуск клиента через стандартизированный пакет;
2. перевод клиента на регулярное сопровождение;
3. допродажа аналитики, контентных пакетов, кампаний и расширений;
4. постепенное накопление recurring revenue.

Главный принцип: **не строить сразу платформу на все случаи жизни**, а довести одну механику и одну B2B-модель до первого платящего клиента.

---

## 2. Продуктовая гипотеза

### 2.1. Что мы продаём

Не просто пазл.

Мы продаём:
- branded puzzle module;
- client-themed content engine;
- rapid launch package;
- analytics-enabled engagement feature;
- managed content and support service.

### 2.2. В каком виде это выглядит для клиента

Для клиента продукт выглядит как:
- встроенный в сайт или приложение мини-модуль;
- оформленный в его цветах и с его логотипом;
- наполненный релевантным контентом;
- снабжённый базовой аналитикой;
- поддерживаемый по регулярной модели.

### 2.3. Почему модель сильнее, чем consumer-only запуск

Потому что B2B-модель даёт:
- выше чек;
- меньше зависимость от рекламы и трафика;
- понятный путь к recurring revenue;
- возможность продавать нескольким клиентам один и тот же продукт с настройкой;
- более предсказуемую экономику.

---

## 3. Ключевой продуктовый принцип

Строим не “много игр”, а **одну сильную механику**, которую можно:
- быстро адаптировать;
- быстро наполнять;
- быстро встраивать;
- быстро поддерживать.

На раннем этапе запрещено:
- распыляться на несколько игровых механик;
- строить сложную кастомную платформу;
- делать enterprise-функции без клиента;
- перегружать MVP лишними режимами.

---

## 4. Продуктовая архитектура

## 4.1. Обязательные продуктовые блоки

### A. Game core
Минимум:
- одна игровая механика;
- понятные правила;
- быстрый старт без длинного обучения;
- 2–5 минут на сессию;
- стабильная работа на desktop/mobile;
- контролируемая шкала сложности.

### B. Content engine / content builder
Нужен внутренний инструмент, чтобы:
- создавать новые наборы;
- менять тематику;
- управлять сложностью;
- генерировать или собирать стартовые пакеты;
- проверять пригодность пазлов;
- хранить библиотеку наборов.

### C. White-label layer
Нужны как минимум:
- логотип;
- цвета;
- тексты;
- название challenge/feature;
- клиентская тема;
- language toggle;
- настройка daily/weekly/campaign режима.

### D. Embedding layer
Минимум один простой вариант:
- iframe embed;
- либо лёгкий JS/widget.

### E. Analytics layer
Минимум:
- plays;
- starts;
- completions;
- completion rate;
- average solve time;
- repeat visits;
- puzzle/topic performance;
- difficulty performance.

### F. Admin / operator layer
Нужно, чтобы оператор мог:
- создать клиента;
- выбрать шаблон;
- загрузить бренд-ассеты;
- выбрать тему;
- назначить стартовый контент-пакет;
- включить аналитику;
- выпустить build.

---

## 5. Коммерческая модель

## 5.1. Основная логика монетизации

Не разовая продажа как основа, а лестница:
1. setup / rollout fee;
2. monthly managed content / support;
3. add-ons;
4. enterprise extensions.

## 5.2. Базовые пакеты внедрения

### Rapid Launch
Назначение: быстрый branded pilot.

Состав:
- 1 механика;
- 1 UI template;
- базовый branding;
- стартовый пакет контента;
- базовая аналитика;
- 1 цикл мелких правок;
- запуск за короткий срок.

### Standard Rollout
Назначение: доведение до нормального рабочего решения.

Состав:
- всё из Rapid Launch;
- больше стартового контента;
- настройка сложности;
- 2–3 тематических набора;
- расширенная аналитика;
- ещё 1–2 цикла правок.

### Pro / Enterprise Rollout
Назначение: крупные клиенты и более сложные внедрения.

Состав:
- несколько тематических потоков;
- расширенные режимы;
- более глубокая аналитика;
- спецнастройки;
- кастомные расширения.

## 5.3. Подписочные пакеты

### Managed Content Basic
- регулярное обновление контента;
- базовая QA-проверка;
- monthly report;
- email support.

### Managed Content Growth
- больше контента;
- несколько потоков;
- review аналитики;
- оптимизация сложности.

### Managed Content Pro
- регулярные кампанийные/сезонные наборы;
- более глубокая аналитика;
- engagement optimization;
- более высокий уровень поддержки.

## 5.4. Add-ons
- дополнительный язык;
- дополнительный white-label skin;
- campaign pack;
- custom analytics pack;
- data import/cleanup;
- API/integration;
- workshop/strategy session.

---

## 6. Целевые ниши

## 6.1. Приоритет 1 — media / publishers
Почему:
- понятный value proposition;
- daily puzzles уже знакомы рынку;
- сильная логика удержания;
- хороший fit для branded интеллектуального контента.

## 6.2. Приоритет 2 — loyalty / retail / hospitality apps
Почему:
- engagement и повторные визиты;
- связь с campaigns/rewards;
- хорошие recurring-модели.

## 6.3. Приоритет 3 — learning / onboarding / internal engagement
Почему:
- puzzle можно упаковать как learning challenge;
- recurring revenue логичен;
- хороший потенциал для analytics packs.

## 6.4. Приоритет 4 — events / communities / associations
Почему:
- быстрые пилоты;
- временные кампании;
- быстрые первые деньги.

## 6.5. Что не брать первым
Не брать как первый рынок:
- hiring / assessment;
- юридически чувствительные сценарии;
- сложные enterprise-интеграции без product-market proof.

---

## 7. Операционная модель клиента

## 7.1. Как должен выглядеть стандартный onboarding

Клиент даёт:
- логотип;
- цвета;
- тему;
- язык;
- стартовые материалы или список тем;
- желаемый режим;
- аналитический пакет.

Мы делаем:
- branded skin;
- стартовый набор контента;
- analytics preset;
- build / embed;
- QA;
- выпуск pilot-а.

## 7.2. Что реально должно запускаться за 1 день

За 1 день запускается только **стандартизированный пакет**:
- один шаблон интерфейса;
- ограниченное число настроек;
- стандартная аналитика;
- типовой стартовый набор.

Не обещать за 1 день:
- кастомный UI;
- сложные интеграции;
- BI-специфику;
- ручную переработку плохих данных;
- уникальную механику.

---

## 8. Аналитические пакеты

## 8.1. Basic Engagement Pack
- unique plays;
- starts;
- completions;
- completion rate;
- average solve time;
- repeat visits.

## 8.2. Content Performance Pack
- performance по темам;
- performance по наборам;
- drop-off points;
- сложность vs completion;
- high-performing puzzle types.

## 8.3. Campaign Pack
- campaign entry CTR;
- session-to-completion;
- repeat engagement;
- promo uplift;
- seasonal comparison.

## 8.4. Learning Pack
- performance по темам знаний;
- retry rate;
- topic mastery trend;
- difficult topic clusters;
- group comparison.

---

## 9. Стратегия разработки

## 9.1. Что делаем первым

### Step 1
Зафиксировать **первое продаваемое ядро**:
- одна механика;
- один первичный B2B use case;
- один Rapid Launch package;
- один минимальный scope.

### Step 2
Сделать MVP:
- polished game core;
- минимальный content builder;
- white-label config;
- базовая аналитика;
- простой deploy/embed.

### Step 3
Сделать internal operator flow:
- создать клиента;
- загрузить бренд;
- выбрать тему;
- выпустить стартовый пакет.

### Step 4
Собрать demo environments:
- generic demo;
- media demo;
- branded mock demo.

### Step 5
Подготовить первый коммерческий пакет:
- one-pager;
- pricing sheet;
- demo script;
- onboarding checklist.

### Step 6
Начать outreach и pilot sales.

---

## 10. Product scope: MVP / V1 / V2

## 10.1. MVP
Должно быть:
- 1 механика;
- 1–2 UI templates;
- simple content builder;
- simple white-label settings;
- basic analytics;
- embeddable version;
- 2–3 demo packs.

Запрещено в MVP:
- multi-game platform;
- heavy enterprise features;
- deep BI integrations;
- large admin complexity;
- customer-specific code forks.

## 10.2. V1
Добавляется:
- лучшее качество content pipeline;
- analytics presets;
- campaign mode;
- operator convenience;
- support workflow.

## 10.3. V2
Добавляется:
- расширенные роли и доступы;
- API / deeper integrations;
- richer reporting;
- multi-tenant maturity;
- advanced automation.

---

## 11. GTM-логика

## 11.1. Как продавать
Не продавать “пазл”.

Продавать:
- engagement feature;
- daily branded challenge;
- content-driven puzzle module;
- audience retention layer;
- themed knowledge challenge.

## 11.2. Первая воронка
- короткий список ICP;
- demo;
- pilot offer;
- limited-scope rollout;
- перевод на managed support.

## 11.3. Основной KPI продаж на старте
Не количество лидов, а:
- количество demo conversations;
- количество pilot offers;
- pilot-to-managed conversion;
- средний recurring чек.

---

## 12. Финансовая модель

## 12.1. Главная цель
Не заработать на единичном rollout, а построить:
- setup cashflow;
- recurring support revenue;
- predictable monthly base.

## 12.2. Что важнее всего
Критический показатель:
**конверсия из rollout в managed service**.

Если rollout покупают, а на поддержку не остаются — модель слабая.

## 12.3. Целевая логика
- rollout как вход;
- managed service как основа;
- add-ons как рост ARPU;
- постепенное накопление MRR/ARR.

---

## 13. Операционные роли

## 13.1. На раннем этапе
### Founder / product owner
- scope control;
- product decisions;
- demo and sales support;
- core quality decisions.

### Support / operations help
- QA;
- content cleanup;
- onboarding tasks;
- reporting;
- simple client updates.

## 13.2. Что нельзя рано отдавать наружу
- core logic;
- content system design;
- pricing;
- product strategy;
- key sales conversations.

---

## 14. Основные риски

### Risk 1: scope explosion
Лечение: одна механика, один рынок, один пакет.

### Risk 2: слишком много кастома
Лечение: жёсткие productized packages.

### Risk 3: слабая конверсия в support
Лечение: заранее проектировать recurring value.

### Risk 4: нет операционного конвейера
Лечение: content builder + operator flow + analytics presets.

### Risk 5: переоценка интереса рынка
Лечение: быстрое demo, ранние pilot conversations.

---

## 15. Критерии готовности к продажам

Продукт можно начинать продавать, когда есть:
- одна полированная механика;
- one-page explanation of value;
- один быстрый branded demo flow;
- понятный Rapid Launch;
- базовая аналитика;
- ability to produce client-themed content;
- pricing sheet;
- onboarding checklist.

Без этого sales лучше не форсировать.

---

## 16. Что делать прямо сейчас

### Immediate priority
1. Зафиксировать первое ядро продукта.
2. Убрать всё лишнее из scope.
3. Определить первый ICP.
4. Определить, что именно входит в Rapid Launch.
5. Сделать MVP-путь от content input до branded demo.

### Не делать сейчас
- не строить вторую механику;
- не проектировать большой enterprise-suite;
- не уходить в лишнюю юридическую и организационную сложность;
- не делать большой сайт до working demo.

---

## 17. Как использовать этот документ дальше

Этот файл — мастер-основа.

Из него должны рождаться отдельные рабочие документы:
- Step 1 MD — фиксация первого ядра;
- Step 2 MD — MVP/V1 scope;
- Step 3 MD — technical architecture;
- Step 4 MD — content builder spec;
- Step 5 MD — pricing & packaging;
- Step 6 MD — outreach & pilot sales;
- sprint documents.

Каждый следующий документ должен:
- сужать scope;
- превращать гипотезы в deliverables;
- упрощать реализацию;
- приближать к первому платящему клиенту.

---

## 18. Главный принцип проекта

**Не строить “идеальную платформу”.**

Сначала построить:
- один продаваемый продукт;
- один repeatable onboarding flow;
- один working support model;
- один proof of revenue.

Только после этого расширять продукт и рынки.
