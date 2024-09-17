import React, { useState } from 'react';
import axios from 'axios';
import "./HeaderFetcher.css";

const HeaderFetcher = () => {
    const [url, setUrl] = useState('');
    const [availableHeaders, setAvailableHeaders] = useState([]);
    const [nonAvailableHeaders, setNonAvailableHeaders] = useState([]);
    const [error, setError] = useState('');
    const [enteredUrl, setEnteredUrl] = useState(''); 
    const [enteredTime, setEnteredTime] = useState('');

    const fetchHeaders = async () => {
        if (!url) {
            setError('URL is required');
            return;
        }
        setEnteredUrl(url);
        setEnteredTime(new Date().toLocaleTimeString());

        try {
            const response = await axios.post('http://localhost:3001/get-header-types', { url });
            
           
            console.log("Response Data:", response.data);

            // Update the state based on the response
            if (response.data.availableHeader && response.data.nonAvailableHeader) {
                setAvailableHeaders(Object.keys(response.data.availableHeader));
                setNonAvailableHeaders(Object.keys(response.data.nonAvailableHeader));
                setError('');
            } else {
                // Handle case where response does not have the expected format
                setError('Unexpected response format');
            }
        } catch (err) {
            setError(`Error fetching headers: ${err.message}`);
            setAvailableHeaders([]);
            setNonAvailableHeaders([]);
        }
    };

    return (
        <div>
            <div className='display'>
                <div className="securepage">
                    <div id="logo">
                        <h2>Security Headers</h2>
                        <div id="logo1">
                            <p>Powered By</p>
                            <h1>Probely</h1>
                        </div>
                    </div>
                    <div id="navbar">
                        <ul>
                            <li><a href="Home"><b>Home</b></a></li>
                            <li><a href="about"><b>About</b></a></li>
                            <li><a href="api"><b>API</b></a></li>
                        </ul>
                    </div>
                </div> 
                <h1>Scan your code here</h1>
                <div className='scanlink'>
                    <input 
                        type="text" 
                        id="url" 
                        value={url} 
                        onChange={(e) => setUrl(e.target.value)} 
                        placeholder="Enter URL here"
                    />
                    <button id="button" onClick={fetchHeaders}>Scan</button>
                </div>
            </div>
            <h2>Security Report Summary</h2>
            {enteredUrl && (
                <div>
                    <p><strong>Link:</strong> {enteredUrl}</p>
                    <p><strong>Entered at:</strong> {enteredTime}</p>
                    <p><strong>Headers</strong></p>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h2>Available Headers</h2>
            <ul>
                {availableHeaders.length > 0 ? (
                    availableHeaders.map((header, index) => (
                        <li key={index}>{header}</li>
                    ))
                ) : (
                    <p>No Available Headers</p>
                )}
            </ul>
            <h2>Non-Available Headers</h2>
            <ul>
                {nonAvailableHeaders.length > 0 ? (
                    nonAvailableHeaders.map((header, index) => (
                        <li key={index}>{header}</li>
                    ))
                ) : (
                    <p>No Non-Available Headers</p>
                )}
            </ul>
        </div>
    );
};

export default HeaderFetcher;
