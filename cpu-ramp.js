const http = require("http");

const { Worker } = require("worker_threads");
 
const port = process.env.PORT || 3000;
 
let memoryHog = []; // Global array to hold allocated memory

let isMemoryLoading = false;
 
// 🧠 CPU Load Worker Thread

const cpuLoadFunction = `

  const end = Date.now() + 60000; // Run for 60 seconds

  while (Date.now() < end) {

    const x = Math.random() * 100;

    const result = x * x * x * x * x; // Heavier math

  }

`;
 
// 🔥 Start CPU Load with N threads

const simulateCPULoad = (threads = 8) => {

  for (let i = 0; i < threads; i++) {

    new Worker(cpuLoadFunction, { eval: true });

  }

  console.log(`Started ${threads} CPU load threads.`);

};
 
// 💾 Start sustained memory allocation (~50MB/sec)

const simulateMemoryLoad = (mbPerStep = 50, steps = 60, interval = 1000) => {

  if (isMemoryLoading) return;

  isMemoryLoading = true;
 
  let count = 0;

  const loader = setInterval(() => {

    const buf = Buffer.alloc(mbPerStep * 1024 * 1024); // Allocate memory

    memoryHog.push(buf);

    count++;

    console.log(`Allocated ${count * mbPerStep} MB`);
 
    if (count >= steps) {

      clearInterval(loader);

      console.log("Memory load complete.");

      isMemoryLoading = false;

    }

  }, interval);

};
 
// 🧹 Clear Memory

const resetMemory = () => {

  memoryHog = [];

  global.gc?.(); // If node started with --expose-gc

  console.log("Memory cleared.");

};
 
const requestHandler = (req, res) => {

  if (req.url === "/load") {

    simulateCPULoad(8);              // Stress 8 threads (cores)

    simulateMemoryLoad(50, 60, 1000); // Allocate 3GB in 60 seconds

    res.end("Started CPU + RAM load.\n");

  } else if (req.url === "/reset") {

    resetMemory();

    res.end("Memory cleared.\n");

  } else {

    res.end("Hello from Node.js\n");

  }

};
 
http.createServer(requestHandler).listen(port, () => {

  console.log(`🚀 Server running at http://localhost:${port}`);

});

 