const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3001;
app.use(express.json());
app.use(cors()); 
app.post('/get-header-types', async (req, res) => {
    const url = req.body.url;
    console.log(`Received request for URL: ${url}`); 
    if (!url) {
        console.log('No URL provided');
        return res.status(400).json({ error: 'URL is required' });
    }
    try {
        const response = await axios.head(url);
        const headers = response.headers;
        const headerKeys = Object.keys(headers);

        console.log('Headers fetched:', headers); 
        const availableHeader = {};
        const nonAvailableHeader = {};

        headerKeys.forEach(header => {
            if (!availableHeader[header]) {
                availableHeader[header] = header; 
            }
        });

       const knownHeaders = [
            'content-security-policy', 
            'strict-transport-security', 
            'referrer-policy', 
            'x-frame-options', 
            'x-content-type-options', 
            'permissions-policy'
        ];
        knownHeaders.forEach(header => {
            if (!availableHeader[header]) {
                nonAvailableHeader[header] = header; 
            }
        });

        res.json({
            availableHeader,
            nonAvailableHeader
        });
    } catch (error) {
        console.error('Error fetching headers:', error.message); // Log the error
        res.status(500).json({ error: `Error fetching headers: ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
