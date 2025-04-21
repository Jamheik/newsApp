FROM workspace as pruned
RUN pnpm run --filter=grawler compile

WORKDIR /app/apps/grawler

ENTRYPOINT ["node", "dist/index.js"]