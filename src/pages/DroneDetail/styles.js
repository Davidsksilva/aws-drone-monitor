import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex: 1;
  padding: 40px 80px;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;

  h1 {
    font-size: 3em;
    margin-bottom: 20px;
  }

  h2 {
    color: #949494;
    font-size: 2em;
    margin-bottom: 20px;
  }
`;

export const Header = styled.div`
  width: 1000px;
  display: flex;
  justify-content: center;
`;

export const BackButton = styled.button`
  background-color: #212121;
  border: 0;
  height: 49px;
  padding: 10px 10px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 500ms linear;
  border: 2px solid #212121;

  &:hover {
    background-color: #333;
    border: 2px solid #212121;
  }

`;