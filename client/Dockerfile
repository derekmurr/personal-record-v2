FROM node:12-alpine AS base 

# Create app directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --no-optional && npm cache clean --force

# Copy all the files
COPY . .

FROM base AS builder 

RUN npm run build 

FROM nginx:1.17-alpine AS production

EXPOSE 3000

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf 

COPY --from=builder /usr/src/app/build /usr/share/nginx/html 
