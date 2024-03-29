const awsIot = require("aws-iot-device-sdk");
const fs = require("fs");

const deviceConfig = require('./deviceConfig.json');

const device = awsIot.device({
  keyPath: deviceConfig.keyPath,
  certPath: deviceConfig.certPath,
  caPath: deviceConfig.caPath,
  clientId: deviceConfig.clientId,
  host: deviceConfig.host,
});

// IoT Fake Data
const velocity = JSON.parse(fs.readFileSync("velocity_data.json", "utf8"));
const position = JSON.parse(fs.readFileSync("position_data.json", "utf8"));
const accelerometer = JSON.parse(
  fs.readFileSync("accelerometer_data.json", "utf8")
);

let battery = 100;

let stance = "moving";

const serialNumber = "DR-01";

let currentTime = 0;

function setStance(value) {
  stance = value;
}

function batteryConsumption() {
  if (stance === "idle") {
    battery -= 0.5;
  } else {
    battery -= 1;
  }
}

function registerDevice() {
  const payload = {
    serialNumber
  };

  device.publish("drone_network/registration", JSON.stringify(payload));
}

function sendMonitoringData() {
  const payload = {
    serialNumber,
    velocity: velocity[currentTime],
    position: position[currentTime],
    accelerometer: accelerometer[currentTime],
    battery,
    stance,
    time: new Date()
  };

  if (stance !== "idle") {
    currentTime += 1;
  }

  device.publish(`drone_network/monitor`, JSON.stringify(payload));
}

let batteryInterval;
let monitoringDataInterval;

device.on("connect", function() {
  console.log("IoT Dummy Drone Connected.");

  batteryInterval = setInterval(batteryConsumption, 10000);
  monitoringDataInterval = setInterval(sendMonitoringData, 2500);

  registerDevice();

  device.subscribe("drone_network/controller");
});

device.on("error", function(error) {
  console.log("error", error);
});

device.on("message", function(topic, payload) {
  console.log("message", topic, payload.toString());

  const parsedPayload = JSON.parse(payload);
  if (parsedPayload.target === serialNumber) {
    switch (parsedPayload.order) {
      case "stop":
        setStance("idle");
        break;
      case "move":
        setStance("moving");
        break;
      default:
        break;
    }
  }
});
