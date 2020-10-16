FROM node:10

USER root

# Создать директорию app
WORKDIR /app

# Установить зависимости приложения
RUN npm -g install serve
# Используется символ подстановки для копирования как package.json, так и package-lock.json
COPY package*.json ./

RUN npm install

# Скопировать исходники приложения
COPY . /app
# Собрать статические файлы react/vue/angular
RUN npm run build


# Запуск сервера в директории dist на порту 8080
EXPOSE 3000

CMD ["./bin/www"]