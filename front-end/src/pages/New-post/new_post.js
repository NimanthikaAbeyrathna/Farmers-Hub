import React, {useEffect, useRef, useState} from 'react';
import './new_post.css';
import {Link} from "react-router-dom";
import Navigation from "../../components/Navigation/Navigation";
import axios from "axios";
import Modal from "react-modal";

export default function NewPost() {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [toUpdatePostTitle, setToUpdatePostTitle] = useState('');
    const [toUpdatePostContent, setToUpdatePostContent] = useState('');
    const [toUpdatePostImages, setToUpdatePostImages] = useState([]);
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const fileInputRef = useRef(null);
    const fileInputRef2 = useRef(null);

    const getPosts = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');

            if (!jwtToken) {
                console.error('JWT token not available, please log in');
                return;
            }

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/blog/getuserblogs`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            if (response.data === null) {
                alert('Error getting blogs');
            } else {
                setPosts(response.data);

            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getPosts();
    }, []);

    const uploadPost = async (event) => {
        event.preventDefault();

        const jwtToken = localStorage.getItem('jwtToken');

        if (!jwtToken) {
            console.error('JWT token not available, please log in');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('createdAt', new Date().toISOString());

        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/blog`, formData, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Success:', response.data);
            setTitle('');
            setContent('');
            setImages([]);
            fileInputRef.current.value = null;
            getPosts();
            alert('Successfully uploaded');

        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'An error occurred');
        }
    };

    const handleImageChange = (e) => {
        setImages(Array.from(e.target.files));
    };
    const handleImageChange2 = (e) => {
        setToUpdatePostImages([]);
        setToUpdatePostImages(Array.from(e.target.files));
    };

    const deleteBlog = async (post) => {
        const shouldDelete = window.confirm('Are you sure you want to delete this post?');

        if (!shouldDelete) {
            return;
        }

        try {
            const jwtToken = localStorage.getItem('jwtToken');

            if (!jwtToken) {
                console.error('JWT token not available, please log in');
                return;
            }

            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/blog/${post._id}`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            console.log('Post deleted successfully:', response.data);
            getPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };


    function openModal(post) {
        setSelectedPost(post);
        setToUpdatePostTitle(post.title);
        setToUpdatePostContent(post.content);
        setToUpdatePostImages(post.images);
    }

    const closeModal = () => {
        setSelectedPost(null);
        setToUpdatePostTitle('');
        setToUpdatePostContent('');
        setToUpdatePostImages([]);
    };

    const updatePost = async (selectedPost) =>{

        const jwtToken = localStorage.getItem('jwtToken');

        if (!jwtToken) {
            console.error('JWT token not available, please log in');
            return;
        }

        const formData = new FormData();
        formData.append('title', toUpdatePostTitle);
        formData.append('content', toUpdatePostContent);

        for (let i = 0; i < toUpdatePostImages.length; i++) {
            formData.append('images', toUpdatePostImages[i]);
        }
        console.log(formData)

        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/blog/${selectedPost._id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Success:', response.data);
            setToUpdatePostTitle('');
            setToUpdatePostContent('');
            setToUpdatePostImages([]);
            fileInputRef2.current.value = null;
            getPosts();
            alert('Successfully updated');

        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'An error occurred');
        }
    }

    const isURL = (str) => {
        try {
            new URL(str);
            return true;
        } catch (error) {
            return false;
        }
    };


    return (
        <div className="container-fluid">
            <div className="row">
                <header className="d-flex justify-content-between align-items-center p-3 bg-dark text-white">
                    <h1>Create a new post</h1>
                    <button id="logOutBtn" className="btn btn-danger">
                        <Link className="text-white text-decoration-none" to="/">Log out</Link>
                    </button>
                </header>
                <Navigation/>
                <div className="col-md-10" id='conainercontain'>
                    <div className="container mt-4">
                        <form onSubmit={uploadPost} className="needs-validation" noValidate>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Title:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    pattern="[A-Za-z ]+"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="images" className="form-label">Images:</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="images"
                                    name="images"
                                    multiple
                                    onChange={handleImageChange}
                                    required
                                    ref={fileInputRef}
                                />


                                <div className="image-container">
                                    {images.map((image, index) => (
                                        <img key={index} src={URL.createObjectURL(image)} alt=""
                                             className="selected-image"/>
                                    ))}
                                </div>
                            </div>


                            <div className="mb-3">
                                <label htmlFor="content" className="form-label">Content:</label>
                                <textarea
                                    className="form-control"
                                    id="content"
                                    name="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                    rows={5}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                        <br/>

                        <table className='table table-bordered'>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Images</th>
                                <th>Content</th>
                                <th>Create at</th>
                                <th></th>

                            </tr>
                            </thead>
                            <tbody>
                            {posts.map((post) => (
                                <tr key={post._id}>
                                    <td>{post._id}</td>
                                    <td>{post.title}</td>
                                    <td>
                                        {post.images.map((image, index) => (
                                            <div key={index}>
                                                <img
                                                    src={image}
                                                    alt={`Image ${index}`}
                                                    style={{maxWidth: '100px', maxHeight: '100px'}}
                                                />
                                            </div>
                                        ))}
                                    </td>
                                    <td>{post.content}</td>
                                    <td>{new Date(post.createdAt).toLocaleString()}</td>
                                    <td>
                                        <button className='btn btn-success p-2 m-2' onClick={() => openModal(post)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                <path
                                                    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                <path fillRule="evenodd"
                                                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                            </svg>
                                        </button>

                                        <button className='btn btn-danger p-2 m-2' onClick={() => deleteBlog(post)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                                                <path
                                                    d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
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
                        <button
                            onClick={closeModal}
                            className="position-absolute top-0 end-0 btn"
                            style={{padding: '5px'}}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-x-lg"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
                                />
                            </svg>
                        </button>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="toUpdatePostTitle"
                                name="toUpdatePostTitle"
                                value={toUpdatePostTitle}
                                onChange={(e) => setToUpdatePostTitle(e.target.value)}
                                required
                                pattern="[A-Za-z ]+"
                            />
                        </div>


                        <div className="mb-3">
                            <label htmlFor="images" className="form-label">Images:</label>
                            <input
                                type="file"
                                className="form-control"
                                id="toUpdatePostImages"
                                name="toUpdatePostImages"
                                multiple
                                onChange={handleImageChange2}
                                required
                                ref={fileInputRef2}
                            />


                            <div className="image-container">
                                {toUpdatePostImages.map((image, index) => (
                                    <img key={index} src={isURL(image) ? image : URL.createObjectURL(image)} alt=""
                                         className="selected-image"/>
                                ))}
                            </div>


                        </div>


                        <div className="mb-3">
                            <label htmlFor="content" className="form-label">Content:</label>
                            <textarea
                                className="form-control"
                                id="toUpdatePostContent"
                                name="toUpdatePostContent"
                                value={toUpdatePostContent}
                                onChange={(e) => setToUpdatePostContent(e.target.value)}
                                required
                                rows={5}
                            />
                        </div>

                        <button
                            onClick={() => updatePost(selectedPost)}
                            className=" bottom-0 end-0 btn btn-primary "
                            style={{width: '100px'}}
                        >Update</button>
                    </div>
                )}
            </Modal>
        </div>
    );
}


