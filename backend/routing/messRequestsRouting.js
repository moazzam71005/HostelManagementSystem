import supabase from '../../src/supabaseClient.js';  
import express from 'express';
const router = express.Router();

// Handle POST request to /student
router.post('/', async (req, res) => {
    const formData = req.body; // Get form data sent from frontend
    console.log('Received form data:', formData);

    // Convert the string dates into proper date format (YYYY-MM-DD)
    const processedData = {
        id: parseInt(formData.studentId, 10),
        requestDate: new Date(formData.requestDate).toISOString().split("T")[0],
        leavingDate: new Date(formData.leavingDate).toISOString().split("T")[0],
        arrivalDate: new Date(formData.arrivalDate).toISOString().split("T")[0],
    };

    console.log('Processed data:', processedData); // Log the processed data for verification

    try {
        // Insert the processed data into the 'testmess' table in Supabase
        const { data, error } = await supabase
            .from('testmess') // The name of your table in Supabase
            .insert([processedData]); // Insert the processed data into the table

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
