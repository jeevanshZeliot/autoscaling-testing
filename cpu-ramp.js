// cpu-loader.js
const { Worker } = require("worker_threads");
const os = require("os");
const http = require("http");

const numThreads = parseInt(process.env.THREADS) || os.cpus().length;
const memPerThreadMB = parseInt(process.env.MEM_MB) || 100; // Memory per thread

console.log(`Starting ${numThreads} workers, each with ~${memPerThreadMB}MB RAM...`);

for (let i = 0; i < numThreads; i++) {
  new Worker(`
    const memoryHog = [];
    const allocateMB = ${memPerThreadMB};

    // Allocate memory
    for (let i = 0; i < allocateMB; i++) {
      memoryHog.push(Buffer.alloc(1024 * 1024));
    }

    // Infinite CPU loop
    while (true) {
      Math.sqrt(Math.random() * Math.random());
    }
  `, { eval: true });
}

// Keep process alive with a simple HTTP server
const PORT = process.env.PORT || 3000;

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("CPU loader is running\n");
  })
  .listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
