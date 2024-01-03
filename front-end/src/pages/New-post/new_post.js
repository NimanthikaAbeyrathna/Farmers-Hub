import React, {useRef, useState} from 'react';
import './new_post.css';
import {Link} from "react-router-dom";
import Navigation from "../../components/Navigation/Navigation";
import axios from "axios";

export default function NewPost() {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);

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
            alert('Successfully uploaded');

        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'An error occurred');
        }
    };

    const handleImageChange = (e) => {
        setImages(Array.from(e.target.files));
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
                <div className="col-md-10">
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
                    </div>
                </div>
            </div>
        </div>
    );
}


