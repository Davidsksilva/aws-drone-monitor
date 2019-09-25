import React, { useEffect, useState } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import AWS from 'aws-sdk';
import { Line } from 'react-chartjs-2';
import { parseISO, format } from 'date-fns';

import { Container, MenuButton, Header, Content } from './styles';
import awsConfig from '../../config/aws';

AWS.config.update(awsConfig);

const dynamoDb = new AWS.DynamoDB();

const DroneDetail = props => {
  const [droneSerial, setDroneSerial] = useState('');
  const [data, setData] = useState([]);

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
      title: {
        display: false,
      },
    };
  }
  function fetchData() {
    const options =
      droneSerial !== ''
        ? {
            FilterExpression: '#serialNumber = :droneSerialNumber',
            ExpressionAttributeNames: { '#serialNumber': 'serialNumber' },
            ExpressionAttributeValues: {
              ':droneSerialNumber': { S: droneSerial },
            },
            Limit: 50,
          }
        : undefined;

    const params = {
      TableName: 'droneNetworkHistory',
      ...options,
    };

    dynamoDb.scan(params, (err, resultData) => {
      if (err) {
        console.log(err);
      } else {
        console.log(resultData.Items);
        setData(resultData.Items);
      }
    });
  }

  useEffect(() => {
    setDroneSerial(props.match.params.serial);

    const updateTimer = setInterval(fetchData, 1000);

    return () => clearInterval(updateTimer);
  }, []);

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
        <Line
          data={getRollData()}
          options={getRollOption()}
          width={600}
          height={400}
        />
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
