import React,{useEffect, useState} from 'react'
import AWS from 'aws-sdk';
import {withRouter} from 'react-router-dom';
import {MdBatteryAlert, MdBattery20, MdBattery30, MdBattery50, MdBattery60, MdBattery80, MdBattery90, MdBatteryFull} from 'react-icons/md';
import Loader from 'react-loader-spinner';

import droneImage from '../../assets/icons8-drone.svg';

import {Container, DronesContainer, Drone, DroneMeta, DroneStance, LoaderContainer} from './styles';

const awsConfig = {
  region: "us-east-2",
  secretAccessKey: "vitn+sxDrtd8lwLbdkaJ+OlnCB6iHllXurZeeV8G",
  accessKeyId: "AKIAZU7WRYKFDOVL746C"
};

AWS.config.update(awsConfig);

const dynamoDb = new AWS.DynamoDB();

const params = {TableName: 'droneNetworkStatus'}


const Main = (props) => {

  const [data, setData] = useState([]);

  function renderBattery(batteryValue){

    if(batteryValue > 90) {
      return <MdBatteryFull size={25} color="#29A000"/>
    }
    if(batteryValue > 80) {
      return <MdBattery90 size={25} color="#29A000"/>
    }
    if(batteryValue > 60) {
      return <MdBattery80 size={25} color="#29A000"/>
    }
    if(batteryValue > 50) {
      return <MdBattery60 size={25} color="#F89700"/>
    }
    else if(batteryValue > 30) {
      return <MdBattery50 size={25} color="#F89700"/>
    }

    else if(batteryValue > 30) {
      return <MdBattery50 size={25} color="#F89700"/>
    }
    else if(batteryValue > 20) {
      return <MdBattery30 size={25} color="#A42401"/>
    }
    else if(batteryValue > 0) {
      return <MdBattery20 size={25} color="#CE0526"/>
    }
    else{
      return <MdBatteryAlert size={25}color="#CE0526"/>
    }
  }

  function fetchData() {
    dynamoDb.scan(params, (err, data) => {

      if(err) {
        console.log(err);
        return null;
      }
      else{
        setData(data.Items)
      }
    });
  }

  useEffect(() => {

   const updateTimer = setInterval(fetchData, 1000);

   return () => clearInterval(updateTimer);

  },[]);

  return (
    <Container>

      <h1>Drone Network Dashboard</h1>

      <h2>Registered Drones Overview</h2>

      { data.length ?<DronesContainer>
        {data.map(d => {

          return (
            <Drone key={d.serialNumber['S']} onClick={() => props.history.push(`drone/${d.serialNumber['S']}`)}>
              <img src={droneImage} alt="drone"/>
              {d.serialNumber['S']}
              <DroneMeta>
                <DroneStance stance={d.stance['S']}>
                  {d.stance['S']}
                </DroneStance>
                {renderBattery(parseInt(d.battery['N']))}
              </DroneMeta>
    
            </Drone>
          )
        })}
        
        
      </DronesContainer> : <DronesContainer><Loader type="RevolvingDot"color="#989898" height={100} width={100} /></DronesContainer>}
   
    </Container>
  )
}

export default withRouter(Main);
