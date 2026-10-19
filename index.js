const express = require('express');
const cors = require('cors');
const main = require('./final.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.post('/apply', async (req, res) => {
    const data = req.body;
    try {

        const result = await main(data.email, data.password, data.role, data.letter);
        res.status(200).json({
            message: 'Application filled successfully!',
            result: result || {}
        });
    } catch (error) {
        console.error('Error processing application:', error);
        res.status(500).json({
            message: 'Error processing application',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:3000`);
});

module.exports = app;