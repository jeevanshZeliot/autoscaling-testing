let loopCount = 1;

function burnCpu(iterations) {
  console.log(`\n🔥 Running burnCpu with ${iterations} iterations`);
  const start = Date.now();

  for (let i = 0; i < iterations; i++) {
    Math.sqrt(Math.random());
  }

  const duration = (Date.now() - start) / 1000;
  console.log(
    `✅ Completed ${iterations} iterations in ${duration.toFixed(2)} seconds`
  );
}

function startCpuRamp() {
  setInterval(() => {
    const iterations = loopCount * 10_000_000;
    burnCpu(iterations);
    loopCount++;
  }, 3 * 60 * 1000); // Every 5 minutes
}

console.log("🚀 Starting CPU ramp simulation...");
startCpuRamp();
