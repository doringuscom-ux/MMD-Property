import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import https from 'https';
import connectDB from './config/db.js';
import propertyRoutes from './routes/propertyRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

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
app.use('/api/notifications', notificationRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/upload', uploadRoutes);

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
    
    // Heartbeat Logic: Pings the server every 10 minutes to prevent Render sleep mode
    if (process.env.NODE_ENV === 'production') {
        const URL = 'https://mmd-property.onrender.com/ping';
        console.log(`\n💓 [Heartbeat] Service initialized. Pinging ${URL} every 10 minutes.`);
        
        setInterval(() => {
            https.get(URL, (res) => {
                const timestamp = new Date().toLocaleString();
                if (res.statusCode === 200) {
                    console.log(`✅ [Heartbeat] Ping successful at ${timestamp}`);
                } else {
                    console.log(`⚠️ [Heartbeat] Ping returned status ${res.statusCode} at ${timestamp}`);
                }
            }).on('error', (e) => {
                console.error(`❌ [Heartbeat] Ping failed at ${new Date().toLocaleString()}: ${e.message}`);
            });
        }, 10 * 60 * 1000); // 10 minutes
    }
});
