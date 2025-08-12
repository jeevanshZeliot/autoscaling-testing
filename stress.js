import { Worker } from 'worker_threads';


const workerInterval = process.env.WORKER_INTERVAL ? Number(process.env.WORKER_INTERVAL) : 10;
const runDuration = process.env.RUN_DURATION ? Number(process.env.RUN_DURATION) : Infinity;

let workers = [];
let intervalHandle = null;
let workerCount = 0;

// Start a new CPU-stressing worker
function startWorker(id) {
  const worker = new Worker(`
    while (true) {
      Math.sqrt(Math.random()); // Simulate CPU work
    }
  `, { eval: true });

  workers.push(worker);
  console.log(`Started worker \${id} (Total: \${workers.length})`);
}

// Stop all workers
function stopAllWorkers() {
  console.log("Stopping all workers...");
  for (const worker of workers) {
    worker.terminate();
  }
  if (intervalHandle) clearInterval(intervalHandle);
  console.log("All workers terminated.");
}

// Start the process
console.log("Starting CPU stress test...");
console.log("Worker interval (seconds):", workerInterval);
console.log("Run duration (seconds):", runDuration === Infinity ? 'Infinite' : runDuration);

// Start first worker immediately
startWorker(++workerCount);

// Schedule new workers every X seconds
intervalHandle = setInterval(() => {
  startWorker(++workerCount);
}, workerInterval * 1000);

// Stop everything if RUN_DURATION is set
if (runDuration !== Infinity) {
  setTimeout(() => {
    stopAllWorkers();
    process.exit(0); // Exit the script
  }, runDuration * 1000);
}
