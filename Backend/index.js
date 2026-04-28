import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import https from 'https';
import connectDB from './config/db.js';
import propertyRoutes from './routes/propertyRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/users', userRoutes);

// Heartbeat / Ping Route
app.get('/ping', (req, res) => {
    res.status(200).send('Keep Alive active');
});

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    
    // Heartbeat Logic: Pings the server every 14 minutes to prevent Render sleep mode
    if (process.env.NODE_ENV === 'production') {
        const URL = 'https://mmd-property.onrender.com/ping';
        setInterval(() => {
            https.get(URL, (res) => {
                console.log(`Heartbeat status: ${res.statusCode}`);
            }).on('error', (e) => {
                console.error(`Heartbeat error: ${e.message}`);
            });
        }, 14 * 60 * 1000); // 14 minutes
    }
});
