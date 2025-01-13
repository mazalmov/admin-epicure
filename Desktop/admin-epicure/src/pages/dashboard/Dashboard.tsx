import React from 'react';
import {Container,Title,Description} from './styles'

const Dashboard: React.FC = () => {
  return (
    <Container>
      <Title>Admin Dashboard</Title>
      <Description>
        Welcome to the admin dashboard. Here you can manage the data for the site.
      </Description>
    </Container>
  );
};

export default Dashboard;
