const http = require("http");
 
const port = process.env.PORT || 3000;
 
const simulateCPULoad = (duration = 5000) => {
  const end = Date.now() + duration;
  while (Date.now() < end) {
    // Simulate blocking CPU (no-op)
    Math.sqrt(Math.random() * Math.random());
  }
};
 
const requestHandler = (req, res) => {
  if (req.url === "/load") {
    simulateCPULoad(); // Simulate CPU load for 5s
    res.end("CPU load simulated");
  } else {
    res.end("Hello from Node.js");
  }
};
 
http.createServer(requestHandler).listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});