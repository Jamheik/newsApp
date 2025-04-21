FROM workspace as pruned
RUN pnpm run --filter=api compile

WORKDIR /app/apps/api

EXPOSE 4000

ENTRYPOINT ["node", "dist/index.js"]