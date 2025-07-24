import mqtt from "mqtt";
import { Cycler, CyclerStatus } from "./cycler.js";

const NUM_CYCLERS = 600;

let cyclers: Cycler[] = [];

const client = mqtt.connect(
  process.env.MQTT_BROKER_URL || "ws://localhost:9001"
);
client.on("connect", () => {
  console.log("Connected to MQTT broker");
  client.subscribe("command");
  for (let i = 1; i <= NUM_CYCLERS; i++) {
    const cycler = new Cycler(i, CyclerStatus.STATUS_PAUSED, client);
    cyclers.push(cycler);
    cycler.start();
  }
});

client.on("message", (topic, message) => {
  if (topic === "command") {
    console.log("Received command:", message.toString());
    const id = parseInt(message.toString());
    const cycler = cyclers.find((c) => c.id === id);
    cycler?.switchStatus();
  }
});

client.on("error", (err) => {
  console.error("MQTT error:", err);
});

process.on("SIGINT", () => {
  cyclers.forEach((cycler) => cycler.stop());
  client.end();
  process.exit();
});
