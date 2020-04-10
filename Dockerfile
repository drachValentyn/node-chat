FROM node:10

# Создать директорию app
WORKDIR /app

# Установить зависимости приложения
RUN npm -g install serve
# Используется символ подстановки для копирования как package.json, так и package-lock.json
COPY package*.json ./

RUN npm install

# Скопировать исходники приложения
COPY src /app
# Собрать статические файлы react/vue/angular
RUN npm run build

EXPOSE 8080
# Запуск сервера в директории dist на порту 8080
CMD ["server", "-s", "dist", "-p", "8080"]