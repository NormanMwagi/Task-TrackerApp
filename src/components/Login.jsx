import React, { useState, useEffect } from 'react'
import './Register.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () =>
{
    const navigate = useNavigate();
    const url = "http://localhost:3001/users";
    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const getUsers = async () =>
    {
        try
        {
            const response = await axios.get(url);
            setUsers(response.data);
            console.log(users);
        }
        catch (err)
        {
            console.log(err.message);
        }
    }
    useEffect(() =>
    {
        getUsers();
    }, [])
    function handleSubmit(e)
    {
        e.preventDefault();
        if (!email || !password)
        {
            toast.error('Please fill in all fields');
            return;
        }
        if (users.find(user => user.email === email && user.password === password))
        {
            toast.success('Login successful!');
            setTimeout(() => navigate('/'), 1200);
        }
        else
        {
            toast.error('Invalid email or password.');
        }
    }

    return (
        <div className='register'>
            <div className="card">
                <h3 className='heading'>Log In</h3>
                <form onSubmit={handleSubmit}>
                    <div className='input-container'>
                        <label htmlFor="email">Email</label>
                        <input type="email" id='email' value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className='input-container'>
                        <label htmlFor="password">Password</label>
                        <input type="password" id='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button className='btn'>Login</button>
                    <div className="login-link">
                        <p>Don't have an account? <Link to="/register">Register</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login