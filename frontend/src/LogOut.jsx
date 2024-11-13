import React from 'react';
import { Button } from '@mui/material';
import Logout from '@mui/icons-material/Logout'; 
import { useNavigate } from 'react-router-dom';

const LogOut = () => {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    localStorage.removeItem('userPin');

    navigate('/');
  };

  return (
    <Button onClick={handleLogout} startIcon={<Logout />}>
      
    </Button>
  );
};

export default LogOut;
