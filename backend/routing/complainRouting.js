import express from 'express';
import supabase from '../../src/supabaseClient.js';
const router = express.Router(); // Use express.Router() to define routes


// Handle POST request to /submitStudentId
router.post('/', async (req, res) => {
    console.log("request agayi");
    //console.log('session at the start: ', req.session);

    /*const studentId = req.session.studentId;
    console.log('ye kia hai ', req.session.studentId);

    if (!studentId) {
        return res.status(400).json({ error: 'Student ID is required to submit a complaint okay.' });
    }b*/


    const formData = req.body; // Get form data sent from frontend
    console.log('Received form data:', formData);
    //console.log('student id is ', studentId);

    const processedData = {
        cid: parseInt(formData.cid, 10),
        complaintTitle: formData.title,
        complaintType: formData.type,
        details: formData.details
    };

    console.log('Received processed data:', processedData);

    try {
        // Insert data into the 'students' table in Supabase
        const { data, error } = await supabase
            .from('testcomplaint') // The name of your table in Supabase
            .insert([processedData]); // Insert the form data into the table

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

// Export the router so it can be used in the main server file
export default router;
