import React, { useState } from 'react'
import './Register.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link } from 'react-router';

const Registration = () =>
{
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) =>
    {
        setNewUser({ ...newUser, [e.target.id]: e.target.value });
    };

    async function handleCreateUser(e)
    {
        e.preventDefault();
        if (newUser.password !== newUser.confirmPassword)
        {
            toast.error('Passwords do not match');
            return;
        }
        if (newUser.password.length < 6)
        {
            toast.error('Password must be at least 6 characters long');
            return;
        }
        try
        {
            await axios.post('http://localhost:3001/users', newUser);
            toast.success('Account created successfully!');
        }
        catch (err)
        {
            console.log(err.message);
        }
        console.log(newUser);
    }

    return (
        <div className='register'>
            <div className="card">
                <h3 className='heading'>Create Account</h3>
                <form onSubmit={handleCreateUser}>
                    <div className='form-group'>
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id='name' value={newUser.name} onChange={handleChange} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="email">Email</label>
                        <input type="email" id='email' value={newUser.email} onChange={handleChange} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="password">Password</label>
                        <input type="password" id='password' onChange={handleChange} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" id='confirmPassword' onChange={handleChange} />
                    </div>
                    <button className='btn'>Register</button>
                    <div className="login-link">
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Registration
