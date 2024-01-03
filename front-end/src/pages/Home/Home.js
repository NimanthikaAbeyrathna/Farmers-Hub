import React, {useEffect, useState} from 'react';
import './Home.css';
import Navigation from "../../components/Navigation/Navigation";
import {Link} from "react-router-dom";
import axios from "axios";

export default function Home() {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/blog`)
            .then((response) => {
                if (response.data === null) {
                    alert('Error getting blogs');
                } else {
                    setPosts(response.data);
                    console.log(response.data)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div className='container-fluid'>
            <div className='row'>
                <header className="d-flex justify-content-between align-items-center p-3 bg-dark text-white">
                    <h1 className='text-white'>Farmers Hub</h1>
                    <button id='logOutBtn' className='btn btn-danger'>
                        <Link className='text-black text-decoration-none' to="/">Log out</Link>
                    </button>
                </header>
                <Navigation/>
                <div className="col-md-10">
                    <div className="container">
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {posts.map((post) => (
                                <div key={post.id} className="col">
                                    <div className="card h-100">

                                        {post.images.map((image, index) => (
                                            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                                <img src={image} className="d-block w-100" alt={`image-${index}`} />
                                            </div>
                                        ))}

                                        <div className="card-body">
                                            <h5 className="card-title">{post.title}</h5>
                                            <p className="text-warning ">{post.authorName}</p>
                                            <p className="text-success">{post.createdAt}</p>
                                            <p className="card-text">{post.content}</p>
                                            <a href="#" className="btn btn-primary">
                                                Go somewhere
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
        ;
}


