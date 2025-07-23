# Use lightweight Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the CPU ramp script
COPY cpu-ramp.js .

# Run the script
CMD ["node", "cpu-ramp.js"]