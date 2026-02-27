# naimy-frontend

Nuxt 3 · TypeScript · SCSS · Pinia

## Установка зависимостей

```bash
npm install
```

---

## Dev-окружение

Фронтенд в dev-режиме доступен по адресу **https://dev.naimy.by** через Cloudflare Tunnel.  
Это нужно для корректной работы httpOnly-cookies от `api.naimy.by` (same-site).

> `localhost:3000` подходит только для быстрой проверки вёрстки без авторизации.

### Ежедневный запуск (два терминала)

```bash
# Терминал 1 — Nuxt dev server
npm run dev

# Терминал 2 — Cloudflare Tunnel
C:\cloudflared\cloudflared.exe tunnel run naimy-frontend-dev
```

Открыть **https://dev.naimy.by**.

---

## Первоначальная настройка Cloudflare Tunnel

Выполняется один раз. Нужен доступ к аккаунту Cloudflare с доменом `naimy.by`.

### 1. Установить cloudflared

Скачать бинарник для Windows 64-bit:  
https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/

Положить в `C:\cloudflared\cloudflared.exe`.

### 2. Авторизоваться

```bash
C:\cloudflared\cloudflared.exe tunnel login
```

Откроется браузер — войти в Cloudflare и выбрать домен `naimy.by`.  
После авторизации появится `C:\Users\<user>\.cloudflared\cert.pem`.

### 3. Создать туннель

```bash
C:\cloudflared\cloudflared.exe tunnel create naimy-frontend-dev
```

Команда выведет `<TUNNEL_ID>` — сохранить.

### 4. Создать конфиг

Файл `C:\Users\<user>\.cloudflared\config.yml`:

```yaml
tunnel: <TUNNEL_ID>
credentials-file: C:\Users\<user>\.cloudflared\<TUNNEL_ID>.json

ingress:
  - hostname: dev.naimy.by
    service: http://localhost:3000
  - service: http_status:404
```

### 5. Добавить DNS-запись

```bash
C:\cloudflared\cloudflared.exe tunnel route dns naimy-frontend-dev dev.naimy.by
```

### 6. Запустить туннель

```bash
C:\cloudflared\cloudflared.exe tunnel run naimy-frontend-dev
```

---

## Если нужно перенастроить туннель заново

Например, при смене машины или если туннель удалён.

```bash
# Посмотреть существующие туннели
C:\cloudflared\cloudflared.exe tunnel list

# Удалить старый туннель (если нужно)
C:\cloudflared\cloudflared.exe tunnel delete naimy-frontend-dev

# Пересоздать с шага 3
C:\cloudflared\cloudflared.exe tunnel create naimy-frontend-dev
```

DNS-запись (шаг 5) нужно добавить заново, если она была привязана к старому туннелю.  
Проверить текущие маршруты:

```bash
C:\cloudflared\cloudflared.exe tunnel route ip show
```

Или в дашборде Cloudflare: **Zero Trust → Networks → Tunnels**.

---

## Production build

```bash
npm run build
npm run preview
```
