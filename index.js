// index.js
const { Kafka } = require("kafkajs");
const { processData } = require("./processor");

const kafka = new Kafka({
  clientId: "kafka-processor-app",
  brokers: [process.env.KAFKA_BROKER || "localhost:9095"],
});

const inputTopic = process.env.INPUT_TOPIC || "input_Topic";
const outputTopic = process.env.OUTPUT_TOPIC || "output_topic";
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE) || 5;

const consumer = kafka.consumer({ groupId: "processor-group" });
const producer = kafka.producer();
const messageBuffer = [];

async function run() {
  await consumer.connect();
  await producer.connect();

  await consumer.subscribe({ topic: inputTopic, fromBeginning: true });

  console.log(
    `🚀 Listening to "${inputTopic}", batching ${BATCH_SIZE} messages...`
  );

  await consumer.run({
    eachMessage: async ({ message }) => {
      const rawValue = message.value.toString();
      console.log(`[RECEIVED] ${rawValue}`);

      const processed = processData(rawValue);
      messageBuffer.push({ value: processed });

      if (messageBuffer.length >= BATCH_SIZE) {
        console.log(`[SENDING BATCH] → ${outputTopic}`);
        await producer.send({
          topic: outputTopic,
          messages: [...messageBuffer],
        });

        console.log(`[SENT] ${messageBuffer.length} messages`);
        messageBuffer.length = 0;
      }
    },
  });
}

run().catch((err) => {
  console.error("[ERROR]", err);
  process.exit(1);
});
