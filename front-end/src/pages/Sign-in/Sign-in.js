import React, {useState} from 'react';
import './Sign-in.css';
import {Link} from "react-router-dom";
import axios from 'axios';


export default function SignIn() {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState(0);

    const userRegister = (event) => {
        event.preventDefault();

        if (!userName) {
            alert('Username is required.');
            return;
        }

        if (!/^[A-Za-z ]+$/.test(userName)) {
            alert('Please give a correct username.');
            return;
        }

        if (!password) {
            alert('Password is required.');
            return;
        }

        if (password.length < 5) {
            alert('Password must be at least 5 characters long.');
            return;
        }

        if (!/^(?=.*[A-Za-z])(?=.*\d).{5,}$/.test(password)) {
            alert('Password must have at least one alphabetic character (uppercase or lowercase), at least one digit (0-9), and a minimum length of 5 characters.');
            return;
        }

        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            alert('Please enter a correct email address.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Password and confirm password do not match.');
            return;
        }
        if (age === 0) {
            alert('Please enter the age');
        }

        const user = {
            age: age,
            email: email,
            password: password,
            createdAt: new Date().toISOString(),
            userName: userName

        };


        axios.post(`${process.env.REACT_APP_API_URL}/user`, user)
            .then(response => {

                alert('Successfully save the account. Please log in');
                console.log(response);
                setUserName('');
                setPassword('');
                setConfirmPassword('');
                setEmail('');
                setAge(0);
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div className='container-fluid'>
            <div className='row'>

                <header className="d-flex justify-content-between align-items-center p-3 bg-dark text-white">
                    <h1 className='text-white'>User Registration</h1>
                    <button className="btn btn-light">
                        <Link className='text-dark text-decoration-none' to="/">Log in</Link>
                    </button>
                </header>

                <div className="col-md-10">
                    <div className="container mt-4 p-4 registration-container">

                        <form onSubmit={userRegister} className="registration-form">
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username:</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required
                                    pattern="[A-Za-z ]+"
                                    className="form-control"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    pattern="(?=.*[A-Za-z])(?=.*\d).{5,}"
                                    className="form-control"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="form-control"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="form-control"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="age" className="form-label">Age:</label>
                                <input
                                    type="number"
                                    id="age"
                                    value={age}
                                    onChange={(e) => setAge(+e.target.value)}
                                    required
                                    className="form-control"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">Register</button>
                        </form>

                    </div>
                </div>

            </div>
        </div>
    );
}


