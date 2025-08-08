import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NewTrip from './pages/NewTrip.jsx';
import TripDetail from './pages/TripDetail.jsx';
import ShareView from './pages/ShareView.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<Navigate to='/dashboard' />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='new' element={<NewTrip />} />
        <Route path='trip/:id' element={<TripDetail />} />
        <Route path='share/:shareId' element={<ShareView />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
