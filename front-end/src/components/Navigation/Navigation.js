import React from 'react';
import './Navigation.css';
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'

export default function Navigation() {
    return (
        <div className='bg-dark col-auto col-md-2 min-vh-100'>
            <ul className='nav nav-pills flex-column'>
                <li className='nav-item text-white fs-6'>
                    <Link className='nav-link text-white text-decoration-none' to="/home">Home</Link>
                </li>
                <li className='nav-item text-white fs-6'>
                    <Link className='nav-link text-white text-decoration-none' to="/NewPost">New Post</Link>
                </li>
                <li className='nav-item text-white fs-6'>
                    <Link className='nav-link text-white text-decoration-none' to="">About</Link>
                </li>
                <li className='nav-item text-white fs-6'>
                    <Link className='nav-link text-white text-decoration-none' to="">Contact</Link>
                </li>

            </ul>
        </div>


    );
}

