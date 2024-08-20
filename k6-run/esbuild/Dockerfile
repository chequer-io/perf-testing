# Step 1: Use an official Node.js image as the base image
FROM node:22-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Install esbuild globally
RUN npm install -g esbuild

# Step 4: Copy the local project files to the container
COPY . .

# Step 5: Set the default command to run esbuild
CMD ["esbuild", "src/index.js", "--bundle", "--outfile=dist/bundle.js"]
