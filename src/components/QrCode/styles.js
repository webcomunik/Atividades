import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #f7f7f7;
  align-items: center;
`;

export const ContainerMain = styled.View`
  margin-top: 20px;
  flex-direction: row;
  justify-content: center;
`;

export const ContainerSubtitle = styled.View`
  justify-content: flex-end;
  padding-left: 31px;
  padding-right: 31px;
`;

export const Title = styled.Text`
  color: #9d3cfa;
  font-size: 26.66px;
  padding-left: 16px;
  text-transform: uppercase;
  margin-bottom: 10px;
  font-family: 'LibreBaskerville-Bold';
`;

export const IconDiv = styled.View``;

export const DivSubtitle = styled.View`
  margin-left: 30px;
  margin-right: 30px;
  justify-content: center;
`;

export const SubTitle = styled.Text`
  font-size: 13px;
  color: #2c2c2c;
  text-align: center;
`;

export const TextColored = styled.Text`
  color: #9d3cfa;
  font-weight: bold;
`;

export const DivBluetooth = styled.View`
  height: 500px;
  width: 300px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const Fundo = styled.View`
  margin-top: -10px;
  justify-content: center;
  align-items: center;
`;

export const Image = styled.Image`
  height: 92%;
  width: 90%;
  border-radius: 10px;
`;

export const DivBtn = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 45%;
  left: 43%;
`;

export const Btn = styled.TouchableWithoutFeedback`
  border: 1px solid red;
`;

export const TextBtn = styled.Text`
  color: #fff;
`;

export const Footer = styled.View`
  position: absolute;
  top: 70%;
`;

export const FooterTxt = styled.Text`
  color: #fff;
  margin-left: 34%;
  font-size: 20px;
  text-transform: uppercase;
  font-weight: bold;
`;

export const FooterSubtitle = styled.Text`
  color: #fff;
  margin-left: 20%;
  font-size: 16px;
`;

export const FooterBluetooth = styled.View`
  position: absolute;
  top: 70%;
`;

export const BluetoothText = styled.Text`
  color: #fff;
  margin-left: 40%;
  font-size: 20px;
  text-transform: uppercase;
  font-weight: bold;
`;

export const BluetoothSubTitle = styled.Text`
  color: #fff;
  margin-left: 51%;
  font-size: 16px;
`;

export const DivPair = styled.View`
  position: absolute;
  top: 70%;
`;

export const TxtPair = styled.Text`
  color: #fff;
  margin-left: 43%;
  font-size: 20px;
  text-transform: uppercase;
  font-weight: bold;
`;

export const PairSubTitle = styled.Text`
  color: #fff;
  margin-left: 54%;
  font-size: 16px;
`;
