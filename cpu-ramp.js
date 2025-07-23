// cpu-loader.js
const { Worker } = require("worker_threads");
const os = require("os");
 
const numThreads = parseInt(process.env.THREADS) || os.cpus().length;
const memPerThreadMB = parseInt(process.env.MEM_MB) || 100; // Memory per thread
 
console.log(`Starting ${numThreads} workers, each with ~${memPerThreadMB}MB RAM...`);
 
for (let i = 0; i < numThreads; i++) {
  new Worker(`
    const memoryHog = [];
    const allocateMB = ${memPerThreadMB};
 
    // Allocate memory
    for (let i = 0; i < allocateMB; i++) {
      // Allocate 1 MB chunks and keep references
      memoryHog.push(Buffer.alloc(1024 * 1024));
    }
 
    // Infinite CPU loop
    while (true) {
      Math.sqrt(Math.random() * Math.random());
    }
  `, { eval: true });
}