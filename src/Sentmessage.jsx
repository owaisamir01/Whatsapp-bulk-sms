import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegisterClient from './RegisterClient';
import i1 from "./image/whatsapp2.jpg";

const Sentmessage = () => {
    const [fromNumber, setFromNumber] = useState('923102804121'); // Your default from number
    const [recipients, setRecipients] = useState('');
    const [message, setMessage] = useState('Hello <name>, how are you?'); // Default message template
    const [isClientReady, setIsClientReady] = useState(false); // Track client readiness
    const [error, setError] = useState(null); // Track errors
    const [image, setImage] = useState(null); // Track image file

    useEffect(() => {
        // Check if client is ready
        const checkClientStatus = async () => {
            try {
                const response = await axios.get('http://localhost:3001/clientstatus/client2');
                setIsClientReady(response.data.isReady);
            } catch (error) {
                console.error('Error checking client status:', error);
                setError('Error checking client status');
            }
        };
        checkClientStatus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Split recipients into an array of phone numbers
        const toNumbers = recipients.split(',').map(number => number.trim());

        try {
            // Loop through each recipient and send the message with a delay
            for (let i = 0; i < toNumbers.length; i++) {
                const toNumber = toNumbers[i];

                await new Promise(resolve => setTimeout(resolve, 10000)); // Delay for 15 seconds

                const formData = new FormData();
                formData.append('clientId', 'client2');
                formData.append('fromNumber', fromNumber);
                formData.append('toNumber', toNumber);
                formData.append('text', message);

                // Append image if available
                if (image) {
                    formData.append('image', image);
                }

                await axios.post('http://localhost:3001/sendmessage', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                console.log(`Message sent to ${toNumber}`);
            }

            alert('Messages sent successfully to all recipients');
        } catch (error) {
            console.error('Error sending messages:', error);
            setError('Error sending messages');
            alert('Error sending messages');
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3001/logout', { clientId: 'client2' });
            alert('Logged out successfully');
            setIsClientReady(false); // Update the client readiness state
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Error logging out');
        }
    };

    return (
        <div className="container mt-5">
            {error && <p className="text-danger text-center">{error}</p>}
            {isClientReady ? (
                <div className="row ">
                    <div className="col-md-5 d-flex align-items-center">
                        <img src={i1} alt="WhatsApp Message" className="img-fluid rounded mx-auto d-block" />
                    </div>
                    <div className="col-md-5">
                        <h5 className="text-center mb-4">WhatsApp Bulk Messages</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4 row">
                                <label htmlFor="fromNumber" className="col-sm-4 col-form-label text-sm-end">From Number</label>
                                <div className="col-sm-8">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="fromNumber"
                                        value={fromNumber}
                                        onChange={(e) => setFromNumber(e.target.value)}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="mb-4 row">
                                <label htmlFor="recipients" className="col-sm-4 col-form-label text-sm-end">To Numbers</label>
                                <div className="col-sm-8">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="recipients"
                                        value={recipients}
                                        onChange={(e) => setRecipients(e.target.value)}
                                        placeholder="Enter recipient numbers, separated by commas"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4 row">
                                <label htmlFor="message" className="col-sm-4 col-form-label text-sm-end">Message</label>
                                <div className="col-sm-8">
                                    <textarea
                                        className="form-control"
                                        id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Enter your message"
                                        rows="4"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4 row">
                                <label htmlFor="image" className="col-sm-4 col-form-label text-sm-end">Image</label>
                                <div className="col-sm-8">
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="image"
                                        accept="image/*"
                                        onChange={(e) => setImage(e.target.files[0])}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-4"></div>
                                <div className="col-sm-8 d-flex justify-content-center align-items-center">
                                    <button type="submit" className="btn btn-outline-success mx-2">Send Message</button>
                                    <button type="button" onClick={handleLogout} className="btn btn-outline-danger">LogOut</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <RegisterClient clientId="client2" />
            )}
        </div>
    );
};

export default Sentmessage;
