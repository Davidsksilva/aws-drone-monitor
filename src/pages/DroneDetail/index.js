import React,{useEffect, useState} from 'react'
import {MdKeyboardArrowLeft} from 'react-icons/md';
import {withRouter} from 'react-router-dom';
import {Container, BackButton, Header} from './styles';

const DroneDetail = (props) => {
  
  const [droneSerial, setDroneSerial] = useState('');

  useEffect(() => {
    setDroneSerial(props.match.params.serial);
    console.log(props);
  }, [props]);

  return (
    <Container>
      
      <h1>Drone Network Dashboard</h1>

      <h2>Monitoring {droneSerial}</h2>

      <Header>
      <BackButton onClick={() => props.history.goBack()}>
        <MdKeyboardArrowLeft color="#fff" size={25}/>
      </BackButton>
      </Header>
    </Container>
  )
}

export default withRouter(DroneDetail);
