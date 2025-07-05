import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'
const Home = () =>
{
    return (
        <div className='home'>
            <h1>Task Tracker</h1>
            <nav className="nav-links">
                <ul className='link'>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                </ul>
            </nav>

        </div>
    )
}

export default Home
