import React, { useEffect, useState } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import AWS from 'aws-sdk';

import { Container, BackButton, Header } from './styles';
import awsConfig from '../../config/aws';

AWS.config.update(awsConfig);

const dynamoDb = new AWS.DynamoDB();

const DroneDetail = props => {
  const [droneSerial, setDroneSerial] = useState('');
  const [data, setData] = useState([]);

  const params = {
    TableName: 'droneNetworkHistory',
    FilterExperssion: '#serialNumber = :droneSerialNumber',
    ExpressionAttributeNames: { '#serialNumber': 'serialNumber' },
    ExpressionAttributeValues: { ':droneSerialNumber': droneSerial },
  };

  function fetchData() {
    dynamoDb.scan(params, (err, resultData) => {
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
  }, [fetchData, props]);

  return (
    <Container>
      <h1>Drone Network Dashboard</h1>

      <h2>Monitoring {droneSerial}</h2>

      <Header>
        <BackButton onClick={() => props.history.goBack()}>
          <MdKeyboardArrowLeft color="#fff" size={25} />
        </BackButton>
      </Header>
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
