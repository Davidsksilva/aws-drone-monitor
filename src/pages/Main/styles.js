import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex: 1;
  padding: 40px 80px;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h1 {
    font-size: 3em;
    margin-bottom: 20px;
  }
`;

export const DronesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  align-items: flex-start;
`;

export const Drone = styled.div`
  padding: 10px 10px;
  background-color: #212121;
  border: 4px solid #333;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  text-align: center;

  transition: background-color 500ms linear;

  &:hover {
    background-color: #333;
    border: 4px solid #212121;
    cursor: pointer;
  }
`;

export const DroneMeta = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  justify-content: space-between;
  align-items: center;

`;

export const DroneStance = styled.div`
  border: 2px solid #71B43A;
  padding: 4px 8px;
  border-radius: 10px;
  color: #71B43A;
 
`;
