# Base image
FROM node:lts-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install pnpm
RUN npm install -g pnpm

# Install the app's dependencies
RUN pnpm install

# Copy the rest of the app's files to the container
COPY . .

# Expose the gRPC port (replace with your actual port if different)
EXPOSE 443


# Set the container's default command
CMD [ "pnpm", "start" ]