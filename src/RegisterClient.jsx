import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegisterClient = ({ clientId }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        // Fetch the QR code for the specified clientId
        const fetchQrCode = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/qrcode/${clientId}`);
                setQrCodeUrl(response.data.url);
            } catch (error) {
                console.error('Error fetching QR code:', error);
            } finally {
                setLoading(false); // Update loading state regardless of success or error
            }
        };
        
        fetchQrCode();
    }, [clientId]);

    if (loading) {
        return (
            <div className="container mt-5 col-6">
                <h2 className="text-center mb-4">Register WhatsApp Client</h2>
                <p className="text-center">Loading QR Code...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5 col-6">
            <h2 className="text-center mb-4">Register WhatsApp Client</h2>
            {qrCodeUrl ? (
                <div className="text-center mb-4">
                    <img src={qrCodeUrl} alt="QR Code" />
                    <p>Scan the QR code to authenticate WhatsApp Web</p>
                </div>
            ) : (
                <p className="text-center">Failed to load QR Code</p>
            )}
        </div>
    );
};

export default RegisterClient;
