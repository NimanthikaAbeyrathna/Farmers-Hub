import React,{useState} from 'react';
import './Log-in.css';
import {Link,useNavigate} from 'react-router-dom';
import axios from "axios";

export default function LogIn() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const onFormSubmit = (event) => {
        event.preventDefault();

        const userFinder = {
            email,
            password,
        };

        axios.post(`${process.env.REACT_APP_API_URL}/user/login`, userFinder)
            .then((response) => {
                if (response.status === 200) {
                    const token = response.data.token;
                    localStorage.setItem('jwtToken', token);

                    setEmail('');
                    setPassword('');
                    navigate('/home');
                } else {
                    alert('login failed');
                    console.error('Login failed:', response.data.error);
                }
            })
            .catch((error) => {
                alert('login failed');
                console.error('Login error:', error);
            });
    };

    return (
        <div className='container-fluid'>
            <div className='row'>

                <header className="d-flex justify-content-between align-items-center p-3 bg-dark text-white">
                    <h1 className='text-white'>User Login</h1>
                    <button id="btnSignIn" className="btn btn-light">
                        <Link className='text-black text-decoration-none' to="/signin">Sign in</Link>
                    </button>
                </header>
                <div className="col-md-10" id='conainercontain'>
                    <div className="container login-container">
                        <form onSubmit={onFormSubmit} className="login-form">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="form-control"
                            />
                            <br/>

                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="form-control"
                            />
                            <br/>

                            <button type="submit" className="btn btn-primary">Login</button>
                        </form>
                    </div>
                </div>

            </div>

        </div>
    );
}


