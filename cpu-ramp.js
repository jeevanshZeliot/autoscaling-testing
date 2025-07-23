const { Worker } = require("worker_threads");
const os = require("os");
 
const numThreads = parseInt(process.env.THREADS) || os.cpus().length;
 
console.log(`Starting ${numThreads} workers...`);
for (let i = 0; i < numThreads; i++) {
  new Worker(`
    while (true) {
      Math.sqrt(Math.random() * Math.random());
    }
  `, { eval: true });
}