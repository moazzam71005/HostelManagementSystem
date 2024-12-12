import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import the routes
/*import adminDashboardRoutes from './routing/admindashboardRouting.js';
import adminRoutes from './routing/adminRouting.js';
import complainRoutes from './routing/complainRouting.js';
import emergencyContactRoutes from './routing/emergencyContactsRouting.js';
import hostelLogRoutes from './routing/hostelLogRouting.js';
import messRequestRoutes from './routing/messRequestsRouting.js';
import requestRoutes from './routing/requestRouting.js';
import staffRoutes from './routing/staffRouting.js'; */
import studentRoutes from './routing/studentRouting.js';
//import userRoutes from './routing/userRouting.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/student', studentRoutes);

app.get('/', (req, res) => {
    res.send('Backend server for Hostel Management System');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
