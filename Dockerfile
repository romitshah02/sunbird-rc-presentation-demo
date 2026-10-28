FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Vite inlines VITE_* vars at build time, so the verifier URL must be passed here.
ARG VITE_VERIFIER_URL
ENV VITE_VERIFIER_URL=$VITE_VERIFIER_URL
# Fail the build instead of shipping an image whose pages all error at runtime.
RUN test -n "$VITE_VERIFIER_URL" || { echo "Build arg VITE_VERIFIER_URL is required" >&2; exit 1; }
RUN npm run build -- --base=/presentation/

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
