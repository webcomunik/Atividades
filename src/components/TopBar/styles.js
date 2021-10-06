import styled from 'styled-components/native';

import {Platform} from 'react-native';

export const Container = styled.View`
  width:100%;
  height: ${Platform.OS === 'ios' ? 80+'px' : 45+'px'};
  background:#9d3cfa;
  flex-direction:row;
  justify-content:center;
  align-items:center;
  margin-bottom:1px;
`;

export const Title = styled.Text`
  font-family:'SourceSansPro-Regular';
  color:#ffffff;
  font-size:16px;
  flex-wrap: nowrap;
  text-transform:uppercase;
  `;

export const SubTitle = styled.Text`
  font-family:'SourceSansPro-Regular';
  color:#ffffff;
  font-size:10px;
  font-weight:bold;
  `;

export const ContainerLeft = styled.View`
  flex:1;
  padding-left: 20px;
  height:53px;
`;

export const ContainerCenter = styled.View`
  flex:5;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  height:53px;
`;

export const LogoCenter = styled.View`
  justify-content:flex-end;
  align-items:center;
  background-color:#f7f7f7;
  top: ${Platform.OS === 'ios' ? 35+'px' : 15+'px'};
  height:50px;
  width:80px;
  border-top-left-radius:${Platform.OS === 'ios' ? 120+'px' : 100+'px'};/* 100px android*/
  border-top-right-radius:${Platform.OS === 'ios' ? 120+'px' : 100+'px'}; /* 100px Android*/
`;

export const ContainerRight = styled.TouchableOpacity`
  flex:1;
  padding-right: ${Platform.OS === 'ios' ? 0+'px' : 20+'px'};
  justify-content:center;
  align-items:center;
  height:53px;
  margin-top: ${Platform.OS === 'ios' ? 35+'px' : 0+'px'};
`;