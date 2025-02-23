import React, { useState } from 'react';
import '../Mood.css';
import Chatbot from '../components/chatbot';
import NavbarPost from '../components/NavbarPost';
import axios from 'axios'; // Import axios for making HTTP requests

export default function Mood() {
    const [email, setEmail] = useState("cxw230017@utdallas.edu"); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    const handleButtonClick = async (buttonType) => {
        setLoading(true);
        setError(null);
        setMessage(""); // Reset message

        try {
            const response = await axios.post('http://127.0.0.1:5000/addButtonClick', {
                email: email,
                buttonType: buttonType
            }, {
                withCredentials: true // Ensure cookies are sent with the request
            });

            // Handle the response
            if (response.data.error) {
                setError(response.data.error);
            } else {
                setMessage(`Your ${buttonType} response was recorded!`);
            }
        } catch (error) {
            console.error("Error during button click:", error);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <NavbarPost />
            <div className="container">
                <div className="box">
                    <h1>How do you feel?</h1>
                    <div className="btn-group">
                        <button 
                            className="image-button"
                            onClick={() => handleButtonClick("positive")}
                            disabled={loading}
                        >
                            <img src="good-mascot.png" alt="good" />
                        </button>

                        <button 
                            className="image-button"
                            onClick={() => handleButtonClick("negative")}
                            disabled={loading}
                        >
                            <img src="bad-mascot.png" alt="bad" />
                        </button>
                    </div>
                    {loading && <p>Loading...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {message && <p style={{ color: 'green' }}>{message}</p>}
                </div>
                <Chatbot />
            </div>
        </div>
    );
}
