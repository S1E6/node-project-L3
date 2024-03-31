import React, { useState,useRef,useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import './Login.css'
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast'
import { useAuth } from './AuthContext';
function Login() {
  const toast = useRef(null);  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login,loggedIn } = useAuth();
  
  useEffect(() => {
    if (loggedIn) {
      navigate("/home");
    }
}, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username === '' || password === '') {
      setErrorMessage('Veuillez remplir le formulaire')
    }
    else{
      try {
        await login(username, password);
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  };


  return (
    <>
      
    <Toast ref={toast} />
   
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <span className="p-float-label login-p-float-label">
            <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <label htmlFor="username">Username</label>
          </span>
          <span className="p-float-label login-p-float-label">
            <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask />
            <label htmlFor="password">Password</label>
          </span>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <Button  type="submit" label="Login" className="p-mt-3 login-btn" />
        </form>
      </div>
    </div>
    </>
  );
}

export default Login;
