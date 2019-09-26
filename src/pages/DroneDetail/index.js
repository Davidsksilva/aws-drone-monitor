import React, { useEffect, useState } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import AWS from 'aws-sdk';
import { Line } from 'react-chartjs-2';
import { parseISO, format } from 'date-fns';
import distanceInWordsToNow from 'date-fns/formatDistanceToNow';
import en from 'date-fns/locale/en-US';

import {
  Container,
  MenuButton,
  Header,
  Content,
  ChartContainer,
  InfoContainer,
  ChartRow,
  Info,
} from './styles';
import awsConfig from '../../config/aws';

AWS.config.update(awsConfig);

const dynamoDb = new AWS.DynamoDB();

const iotData = new AWS.IotData({
  endpoint: 'ap60jigczfevx-ats.iot.us-east-2.amazonaws.com',
});

const DroneDetail = props => {
  const [droneSerial, setDroneSerial] = useState('');
  const [data, setData] = useState([]);

  function handleStopDrone() {
    const order =
      data.length && data[data.length - 1].stance.S === 'moving'
        ? 'stop'
        : 'move';

    const payloadObj = {
      target: droneSerial,
      order,
    };

    const params = {
      topic: 'drone_network/controller',
      payload: JSON.stringify(payloadObj),
      qos: 0,
    };

    return iotData.publish(params, err => {
      if (err) {
        console.log(err);
      }
    });
  }

  function getPositionData() {
    const yData = data.map(element => element.position.L[1].N);
    const xData = data.map(element =>
      parseFloat(element.position.L[0].N).toFixed(2)
    );

    const chartData = {
      labels: xData,
      datasets: [
        {
          label: 'XY Position',
          data: yData,
          fill: false,
          backgroundColor: '#8a336f',
          borderColor: '#8a336f',
          pointBackgroundColor: '#E755BA',
          pointBorderColor: '#E755BA',
          pointHoverBackgroundColor: '#E755BA',
          pointHoverBorderColor: '#E755BA',
        },
      ],
    };
    return chartData;
  }

  function getRollData() {
    const rollData = data.map(element => element.roll.N);

    const timeData = data.map(element =>
      format(parseISO(element.time.S), 'HH:mm:ss')
    ); // element.time.S,

    const chartData = {
      labels: timeData,
      datasets: [
        {
          label: 'Roll Angle',
          data: rollData,
          fill: false,
          backgroundColor: '#336f8a',
          borderColor: '#336f8a',
          pointBackgroundColor: '#55bae7',
          pointBorderColor: '#55bae7',
          pointHoverBackgroundColor: '#55bae7',
          pointHoverBorderColor: '#55bae7',
        },
      ],
    };

    // console.log(rollData);
    return chartData;
  }

  function getRollOption() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Roll angle (\u00b0)',
            },
          },
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Time (HH:MM:SS)',
            },
          },
        ],
      },
    };
  }

  function getPositionOption() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Y Pos',
            },
          },
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'X Pos',
            },
          },
        ],
      },
    };
  }

  function fetchData() {
    const options =
      droneSerial !== ''
        ? {
            KeyConditionExpression: 'serialNumber = :droneSerialNumber',
            ExpressionAttributeValues: {
              ':droneSerialNumber': { S: droneSerial },
            },
            Limit: 30,
            ScanIndexForward: false,
          }
        : undefined;

    const params = {
      TableName: 'droneNetworkHistory',
      ...options,
    };

    dynamoDb.query(params, (err, resultData) => {
      if (err) {
        console.log(err);
      } else if (resultData && resultData.Items.length) {
        const invertedData = resultData.Items;
        setData(invertedData.reverse());
      }
    });
  }

  useEffect(() => {
    setDroneSerial(props.match.params.serial);

    const updateTimer = setInterval(fetchData, 1000);

    return () => clearInterval(updateTimer);
  }, [props, fetchData]);

  const mostRecentData = data[data.length - 1];

  return (
    <Container>
      <h1>Drone Network Dashboard</h1>

      <h2>Monitoring {droneSerial}</h2>

      <Header>
        <MenuButton onClick={() => props.history.goBack()}>
          <MdKeyboardArrowLeft color="#fff" size={25} />
        </MenuButton>

        <MenuButton
          onClick={() => handleStopDrone()}
          style={{
            marginLeft: 10,
            color:
              data.length && mostRecentData.stance.S === 'moving'
                ? 'red'
                : 'green',
            fontWeight: 'bold',
            fontSize: 16,
            textAlign: 'center',
          }}
        >
          {data.length && mostRecentData.stance.S === 'moving'
            ? 'Stop Drone'
            : 'Restart Drone'}
        </MenuButton>
      </Header>
      <Content>
        <InfoContainer>
          {data.length && (
            <>
              <Info>Status: {mostRecentData.stance.S}</Info>
              <Info>
                Position:{' '}
                {`[ ${parseFloat(mostRecentData.position.L[0].N).toFixed(
                  2
                )} , ${parseFloat(mostRecentData.position.L[1].N).toFixed(
                  2
                )} , ${parseFloat(mostRecentData.position.L[2].N).toFixed(
                  2
                )} ]`}
              </Info>
              <Info>
                Velocity:{' '}
                {`[ ${parseFloat(mostRecentData.velocity.L[0].N).toFixed(
                  2
                )} , ${parseFloat(mostRecentData.velocity.L[1].N).toFixed(
                  2
                )} , ${parseFloat(mostRecentData.velocity.L[2].N).toFixed(
                  2
                )} ]`}
              </Info>
              <Info>
                Roll Angle: {parseFloat(mostRecentData.roll.N).toFixed(2)}
              </Info>
              <Info>Battery Level: {mostRecentData.battery.N}%</Info>
              <Info>
                Last Update:{' '}
                {distanceInWordsToNow(parseISO(mostRecentData.time.S), {
                  includeSeconds: true,
                  locale: en,
                })}{' '}
                ago
              </Info>
            </>
          )}
        </InfoContainer>
        <ChartRow>
          <ChartContainer>
            <Line data={getRollData()} options={getRollOption()} />
          </ChartContainer>

          <ChartContainer>
            <Line data={getPositionData()} options={getPositionOption()} />
          </ChartContainer>
        </ChartRow>
      </Content>
    </Container>
  );
};

DroneDetail.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      serial: PropTypes.string,
    }),
  }).isRequired,
};

export default withRouter(DroneDetail);
