# Imagem base do Nginx
FROM nginx:alpine

# Define diretório de trabalho do Nginx
WORKDIR /usr/share/nginx/html

# Remove arquivos default
RUN rm -rf ./*

# Copia os arquivos do build para dentro do container
COPY build/ .

# Copia sua configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Comando padrão para rodar o Nginx
CMD ["nginx", "-g", "daemon off;"]
