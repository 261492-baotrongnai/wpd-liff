

# Build stage
FROM node:lts-alpine AS build-stage
WORKDIR /app

ARG VITE_LIFF_ID
ARG VITE_LIFF_ID_2
ARG VITE_LIFF_ID_ACHIEVEMENT

ARG BASE_URL
ARG VITE_API_URL

ENV VITE_LIFF_ID=$VITE_LIFF_ID
ENV VITE_LIFF_ID_2=$VITE_LIFF_ID_2
ENV VITE_LIFF_ID_ACHIEVEMENT=$VITE_LIFF_ID_ACHIEVEMENT


ENV BASE_URL=$BASE_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage: based on Node + nginx
FROM node:lts-alpine AS runtime
RUN apk add --no-cache nginx

# Copy built files
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy runtime env script and entrypoint
# COPY generate-env.js /app/generate-env.js
# COPY entrypoint.sh /app/entrypoint.sh
# RUN chmod +x /app/entrypoint.sh

# Copy nginx config (both main and server block)
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Create required directories for nginx
RUN mkdir -p /run/nginx

EXPOSE 80
# ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]


# # production stage
# FROM nginx:stable-alpine as production-stage
# COPY --from=build-stage /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# # Comments are provided throughout this file to help you get started.
# # If you need more help, visit the Dockerfile reference guide at
# # https://docs.docker.com/go/dockerfile-reference/

# # Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

# ARG NODE_VERSION=20.17.0

# ################################################################################
# # Use node image for base image for all stages.
# FROM node:${NODE_VERSION}-alpine as base

# # Set working directory for all build stages.
# WORKDIR /usr/src/app


# ################################################################################
# # Create a stage for installing production dependecies.
# FROM base as deps

# # Set NODE_ENV to production to skip the prepare script.
# ENV NODE_ENV=production

# # Disable the prepare script during npm install.
# ENV npm_config_ignore_scripts=true

# # Download dependencies as a separate step to take advantage of Docker's caching.
# # Leverage a cache mount to /root/.npm to speed up subsequent builds.
# # Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# # into this layer.
# RUN --mount=type=bind,source=package.json,target=package.json \
#     --mount=type=bind,source=package-lock.json,target=package-lock.json \
#     --mount=type=cache,target=/root/.npm \
#     npm ci --omit=dev

# ################################################################################
# # Create a stage for building the application.
# FROM deps as build

# # Set NODE_ENV to development to allow devDependencies to be installed.
# ENV NODE_ENV=development

# # Re-enable scripts for the build stage.
# ENV npm_config_ignore_scripts=false

# # Download additional development dependencies before building, as some projects require
# # "devDependencies" to be installed to build. If you don't need this, remove this step.
# RUN --mount=type=bind,source=package.json,target=package.json \
#     --mount=type=bind,source=package-lock.json,target=package-lock.json \
#     --mount=type=cache,target=/root/.npm \
#     npm ci

# # Copy the rest of the source files into the image.
# COPY . .
# # Run the build script.
# RUN npm run build

# ################################################################################
# # Create a new stage to run the application with minimal runtime dependencies
# # where the necessary files are copied from the build stage.
# FROM base as final

# # Use production node environment by default.
# ENV NODE_ENV production
# ARG VITE_LIFF_ID
# ARG VITE_LIFF_ID_2
# ARG BASE_URL
# ARG API_URL

# ENV VITE_LIFF_ID=$VITE_LIFF_ID
# ENV VITE_LIFF_ID_2=$VITE_LIFF_ID_2
# ENV BASE_URL=$BASE_URL
# ENV API_URL=$API_URL

# # # Run the application as a non-root user.
# # USER node

# # Copy package.json so that package manager commands can be used.
# COPY package.json .

# # Copy the production dependencies from the deps stage and also
# # the built application from the build stage into the image.
# COPY --from=deps /usr/src/app/node_modules ./node_modules
# COPY --from=build /usr/src/app/. ./.

# # Change ownership of the application files to the `node` user.
# RUN chown -R node:node /usr/src/app

# USER node

# # Expose the port that the application listens on.
# EXPOSE 5173

# # Run the application.
# CMD ["npm", "run", "preview" , "--", "--host"]
