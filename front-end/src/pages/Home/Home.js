import React, {useEffect, useState} from 'react';
import './Home.css';
import Navigation from "../../components/Navigation/Navigation";
import {Link} from "react-router-dom";
import axios from "axios";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function Home() {

    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [likedPosts, setLikedPosts] = useState([]);
    const [likeId, setLikeId] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/blog`);
            if (response.data === null) {
                alert('Error getting blogs');
            } else {
                setPosts(response.data);
                console.log(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLikeClick = async (postId) => {
        setLikedPosts((prevLikedPosts) => {
            if (prevLikedPosts.includes(postId)) {
                return prevLikedPosts.filter((id) => id !== postId); // Remove like
                const responce = axios.delete(`${process.env.REACT_APP_API_URL}/like/${likeId}`);
                setLikeId('');
                fetchData();
            } else {
                return [...prevLikedPosts, postId]; // Add like
            }
        });

        const jwtToken = localStorage.getItem('jwtToken');

        if (!jwtToken) {
            console.error('JWT token not available, please log in');
            return;
        }

        const like = {
            postID: postId,
            createdAt: new Date().toISOString()
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/like`, like, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                },
            });
            fetchData();
            setLikeId(response._id);
            console.log(response);
        } catch (error) {
            console.error(error);
        }

    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000
    };

    const openModal = (post) => {
        setSelectedPost(post);
    };

    const closeModal = () => {
        setSelectedPost(null);
    };

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
                <div className='col-md-10'>
                    <div className='container'>
                        <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4'>
                            {posts.map((post) => (
                                <div key={post._id} className='col'>
                                    <div className='card h-100'>
                                        <Slider {...settings}>
                                            {post.images.map((image, index) => (
                                                <div key={`${post._id}-${index}`}>
                                                    <img
                                                        src={image}
                                                        className='d-block w-100'
                                                        alt={`Image ${index}`}
                                                        style={{objectFit: 'cover', maxHeight: '200px'}}
                                                    />
                                                </div>
                                            ))}
                                        </Slider>
                                        <div className="d-flex p-2" style={{width: '500px'}}>
                                            <button className="mr-2 btn  rounded"
                                                    onClick={() => handleLikeClick(post._id)}>
                                                <svg style={{fill: likedPosts.includes(post._id) ? 'red' : 'black'}}
                                                     xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     className="bi bi-heart-fill"
                                                     viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd"
                                                          d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                                                </svg>
                                            </button>
                                            <div>{post.likeCount}</div>
                                            <br/>
                                            <button className="mr-2 btn  rounded">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="blue" className="bi bi-chat-left-dots"
                                                     viewBox="0 0 16 16">
                                                    <path
                                                        d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                                    <path
                                                        d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                                                </svg>
                                            </button>
                                            <div>0</div>
                                        </div>
                                        <div className='card-footer' style={{background: 'none'}}>
                                            <h5 className='card-title'>{post.title}</h5>
                                            <p className='text-warning'>{post.authorName}</p>
                                            <p className='text-success'>{new Date(post.createdAt).toLocaleString()}</p>
                                            <p className='card-text' style={{
                                                maxHeight: '100px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {post.content}
                                            </p>
                                        </div>
                                        <button className='btn' id="linkBtn" onClick={() => openModal(post)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor" className="bi bi-box-arrow-up-right"
                                                 viewBox="0 0 16 16">
                                                <path fill-rule="evenodd"
                                                      d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
                                                <path fill-rule="evenodd"
                                                      d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={selectedPost !== null}
                onRequestClose={closeModal}
                contentLabel='Post Modal'
                className='Modal'
            >
                {selectedPost && (
                    <div className="modal-content">
                        <button onClick={closeModal} className="position-absolute top-0 end-0 btn "
                                style={{padding: '5px'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-x-lg" viewBox="0 0 16 16">
                                <path
                                    d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                            </svg>
                        </button>
                        <h2>{selectedPost.title}</h2>
                        {selectedPost.images.map((image, index) => (
                            <div key={`${selectedPost._id}-${index}`}>
                                <img
                                    src={image}
                                    className='d-flex '
                                    alt={`Image ${index}`}
                                    style={{objectFit: 'cover', maxHeight: '200px'}}
                                />
                            </div>
                        ))}
                        <div className="d-flex p-2" style={{width: '500px'}}>
                            <button className="mr-2 btn  rounded">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-heart-fill" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd"
                                          d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                                </svg>
                            </button>
                            <div>{selectedPost.likeCount}</div>
                            <br/>
                            <button className="mr-2 btn  rounded">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                     fill="blue" className="bi bi-chat-left-dots"
                                     viewBox="0 0 16 16">
                                    <path
                                        d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                    <path
                                        d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                                </svg>
                            </button>
                            <div>0</div>
                        </div>
                        <p className='text-warning'>{selectedPost.authorName}</p>
                        <p className='text-success'>{new Date(selectedPost.createdAt).toLocaleString()}</p>
                        <p>{selectedPost.content}</p>

                    </div>
                )}
            </Modal>


        </div>
    );
}


