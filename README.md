##Используемые технологии
- NEST
- postgre
- ORM: prisma
- swagger
- elasticsearch
- google cloud storage
- nodemailer

##Как запустить проект
1. npm install
2. docker compose up
3. В контейнере api-gateway через терминал выполнить команду npm run migrate:run

##Примечание
- Проект из себя представляет WEB-api в архитектурном стиле Microservices
- Предназначен для работы с митапами
- для теста можно выполнить роут "localhost:3333/api/auth/createadmin", который создаст пользователя с правами admin и подтвержденным email.
