FROM node:18-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Copy source code
COPY . .

# Build the Next.js application
RUN npm run build

# Set environment to production
ENV NODE_ENV=production

# Cloud Run defaults to expecting the app to listen on the PORT variable
# In Next.js, we can start it with the standard command. Next.js picks up the PORT env var.
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
