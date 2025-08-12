# Use a lightweight Node.js image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy script into the container
COPY stress.js .

# Run the stress test script
CMD ["node", "stress.js"]