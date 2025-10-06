import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx'; 
import Register from './pages/Register.jsx'; 
import CreatePost from './pages/CreatePost.jsx'; 
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';

function App() {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      console.log('[App] onAuthStateChanged user:', u);
      setUser(u);
    });
    return () => unsub();
  }, []);

  const isAuth = !!user;

  return (
    <>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add" element={<CreatePost />} /> 
        <Route path="/edit/:id" element={<CreatePost />} />
      </Routes>
    </>
  );
}

export default App;