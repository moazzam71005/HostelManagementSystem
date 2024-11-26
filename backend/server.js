const express = require('express');
const cors = require('cors');

const adminDashboardRoutes = require('../routing/admindashboardRouting');
const adminRoutes = require('../routing/adminRouting');
const complainRoutes = require('../routing/complainRouting');
const emergencyContactRoutes = require('../routing/emergencyContactsRouting');
const hostelLogRoutes = require('../routing/hostelLogRouting');
const messRequestRoutes = require('../routing/messRequestsRouting');
const requestRoutes = require('../routing/requestRouting');
const staffRoutes = require('../routing/staffRouting');
const studentRoutes = require('../routing/studentRouting');
const userRoutes = require('../routing/userRouting');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend server for Hostel Management System');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
