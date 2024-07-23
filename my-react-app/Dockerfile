# Use the official Node.js image as the base image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps
# Copy the rest of the application code
COPY . .

RUN npm run build
# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["npm", "run" , "dev"]
