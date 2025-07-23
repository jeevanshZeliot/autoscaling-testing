const http = require("http");
const { Worker } = require("worker_threads");
 
const port = process.env.PORT || 3000;
 
let memoryHog = []; // Holds allocated memory
 
// ⚡ Modify CPU Load Function Here
const cpuLoadFunction = `
  const end = Date.now() + 5000;
  while (Date.now() < end) {
    const x = Math.random() * 100;
    const result = x * x * x; // Cube operation
  }
`;
 
// 🔥 CPU Load: Multithreaded
const simulateCPULoad = (threads = 4) => {
  for (let i = 0; i < threads; i++) {
    new Worker(cpuLoadFunction, { eval: true });
  }
};
 
// 🔥 Memory Load: Allocate and retain memory
const simulateMemoryLoad = (chunks = 10, sizeMB = 50) => {
  for (let i = 0; i < chunks; i++) {
    const buffer = Buffer.alloc(sizeMB * 1024 * 1024); // Allocate sizeMB per chunk
    memoryHog.push(buffer); // Prevent garbage collection
  }
};
 
const requestHandler = (req, res) => {
  if (req.url === "/load") {
    simulateCPULoad(4);       // Spike CPU
    simulateMemoryLoad(4, 50); // Allocate 4 × 50MB = 200MB
    res.end("CPU and RAM load simulated\n");
  } else if (req.url === "/reset") {
    memoryHog = []; // Free up memory
    res.end("Memory cleared\n");
  } else {
    res.end("Hello from Node.js\n");
  }
};
 
http.createServer(requestHandler).listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});