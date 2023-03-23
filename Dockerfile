FROM node:18-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY . .

RUN pnpm i
RUN pnpm build

EXPOSE 3000
CMD pnpm start -- --host --port 3000
