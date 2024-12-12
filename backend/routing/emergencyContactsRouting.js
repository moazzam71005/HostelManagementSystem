import supabase from '../../src/supabaseClient.js';  
import express from 'express';
const router = express.Router(); // Use express.Router() to define routes
//const supabase = require('../../src/supabaseClient'); 


// Handle POST request to /student
router.post('/', async (req, res) => {
    const formData = req.body; // Get form data sent from frontend
    console.log('Received form data:', formData);

    try {
        // Insert data into the 'students' table in Supabase
        const { data, error } = await supabase
            .from('students') // The name of your table in Supabase
            .insert([formData]); // Insert the form data into the table

        if (error) {
            throw new Error(error.message); // If there's an error with the insertion
        }

        console.log('Data inserted successfully', data);
        res.status(200).json({ message: 'Registration successful!' }); // Return success response
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'Database insertion failed' }); // Return error response
    }
});

export default router; // Export the router to be used in server.js

