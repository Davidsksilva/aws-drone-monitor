<p align="left">
   <img src=".github/logo.svg" width="160"/>
</p>

# AWS Drone Monitor

> A proof of concept drone monitoring system using AWS.

This project tires to simulate and monitorate a simple drone network using the cloud platform AWS. A IoT device is simulated, sending predetermined sensor data (velocity, position, accelerometer) collected from a dataset. The full system diagram can be seen below:
 <img src=".github/diagram.png" />

In short, a drone is simulated through a AWS IoT device, which publishes messagens containing fake data that simulates the drone status to a AWS topic that activates a Lambda function that processes the data and stores the it in a DynamoDB table including the device identification. At the end a web application build using React will scan the DynamoDB and display the drone status.

## Prerequisites

* You have at least `node 10.X` installed.

## Getting Started

## Acknowledgements

* Drone svg icon downloaded  from [icons8](https://icons8.com/).

## License

This project uses the following license: [MIT](https://github.com/Davidsksilva/drone-network-dashboard/blob/master/LICENSE.md).
