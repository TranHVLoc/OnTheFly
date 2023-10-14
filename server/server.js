import express from 'express';
import cors from 'cors';

// Initialize the express server
const app = express();

// Add the express middleware to parse JSON data from HTTP request
app.use(express.json());
// Add the cors middleware to enable CROSS ORIGIN
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">✈️ On The Fly API</h1>');
});

// Start the express server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

