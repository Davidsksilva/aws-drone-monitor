import React, { useEffect, useState } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import AWS from 'aws-sdk';
import { Line } from 'react-chartjs-2';
import { parseISO, format } from 'date-fns';

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

const DroneDetail = props => {
  const [droneSerial, setDroneSerial] = useState('');
  const [data, setData] = useState([]);

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
      } else {
        setData(resultData.Items);
      }
    });
  }

  useEffect(() => {
    setDroneSerial(props.match.params.serial);

    const updateTimer = setInterval(fetchData, 1000);

    return () => clearInterval(updateTimer);
  }, [props, fetchData]);

  return (
    <Container>
      <h1>Drone Network Dashboard</h1>

      <h2>Monitoring {droneSerial}</h2>

      <Header>
        <MenuButton onClick={() => props.history.goBack()}>
          <MdKeyboardArrowLeft color="#fff" size={25} />
        </MenuButton>
      </Header>
      <Content>
        <InfoContainer>Oi</InfoContainer>
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
