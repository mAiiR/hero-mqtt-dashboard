import type { MqttClient } from "mqtt";

export enum CyclerStatus {
  STATUS_ACTIVE = "active",
  STATUS_PAUSED = "paused",
}

export class Cycler {
  readonly id: Number;
  status: CyclerStatus;
  timeout: NodeJS.Timeout | null = null;
  readonly statusClient: MqttClient;

  constructor(id: Number, status: CyclerStatus, client: MqttClient) {
    this.id = id;
    this.status = status;
    this.statusClient = client;
  }

  start() {
    if (this.timeout !== null) {
      return;
    }
    this.timeout = setInterval(() => {
      this.reportStatus();
    }, 1000);
  }

  stop() {
    if (this.timeout !== null) {
      clearInterval(this.timeout);
      this.timeout = null;
    }
  }

  switchStatus() {
    this.status =
      this.status === CyclerStatus.STATUS_ACTIVE
        ? CyclerStatus.STATUS_PAUSED
        : CyclerStatus.STATUS_ACTIVE;
  }

  reportStatus() {
    this.statusClient.publish("status", `Cycler ${this.id} is ${this.status}!`);
  }
}
