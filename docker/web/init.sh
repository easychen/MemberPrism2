#!/bin/bash

# 初始化 laravel
cd /app/web && composer install && cp .env.example .env && php artisan key:generate && php artisan migrate --seed

chmod -R 0777 /app/web/storage
chmod -R 0777 /app/web/bootstrap/cache/

chmod -R 0777 /app/proxy/
chmod +x /app/proxy/server-linux

# 启动 proxy
# 已经设置为 deamon
# cd /app/proxy && ./server-linux &