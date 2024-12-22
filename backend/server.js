import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session'; // Import express-session

// Import the routes
import adminDashboardRoutes from './routing/admindashboardRouting.js';
import adminRoutes from './routing/adminRouting.js';
import complainRoutes from './routing/complainRouting.js';
import emergencyContactRoutes from './routing/emergencyContactsRouting.js';
import hostelLogRoutes from './routing/hostelLogRouting.js';
import messRequestRoutes from './routing/messRequestsRouting.js';
import requestRoutes from './routing/requestRouting.js';
import staffRoutes from './routing/staffRouting.js'; 
import studentRoutes from './routing/studentRouting.js';
import vehicleRoutes from './routing/vehicleRouting.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

/*const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    credentials: true,  // Allow credentials (cookies)
  };
  
  app.use(cors(corsOptions));
app.use(express.json());
*/
//const memoryStore = new session.MemoryStore();



// Set up session middleware
app.use(session({
    secret: 'your-secret-key', // Secret key to sign the session ID cookie
    resave: false,             // Don't save session if not modified
    saveUninitialized: true,   // Save session even if it's not modified
    cookie: {
        secure: false,  // Use 'false' for development (when not using HTTPS)
        maxAge: 3600000 // Session expires in 1 hour
    }
})); 




// Define the routes
app.use('/api/admindashboard', adminDashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/complaint', complainRoutes);
app.use('/api/emergencycontacts', emergencyContactRoutes);
app.use('/api/hostel', hostelLogRoutes);
app.use('/api/mess', messRequestRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/vehicles', vehicleRoutes);


// Simple route to check if the server is running
app.get('/', (req, res) => {
    res.send('Backend server for Hostel Management System');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
