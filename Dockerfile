#node js___________________________________________
FROM node:20 as builder

WORKDIR /app

#copia e instala td no manifesto
COPY package*.json ./
RUN npm install

#termina de copiar td e mete marcha
COPY . .
RUN npm run build

#nginx_____________________________________________
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*

#copia build gerada no stage anterior
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80

#inicia
CMD ["nginx", "-g", "daemon off;"]

