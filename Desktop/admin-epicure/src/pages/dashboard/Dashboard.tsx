import React from 'react';
import {Container,Title,Description} from './styles'
import AdminDashboard from '../../components/AdminDashboard/AdminDashboard';

const Dashboard: React.FC = () => {
  return (
    <Container>
        <Title>Admin Dashboard</Title>
        <Description>
        Welcome to the admin dashboard. Here you can manage the data for the site.
        </Description>
        <AdminDashboard/>
    </Container>
  );
};

export default Dashboard;
