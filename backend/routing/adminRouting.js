import supabase from '../../src/supabaseClient.js';  
import express from 'express';
const router = express.Router(); // Use express.Router() to define routes
//const supabase = require('../../src/supabaseClient'); 

const validateData = (processedData) => {
    const errors = [];

    const idPattern = /^[0-9]{6}$/;  // Matches exactly 6 digits
    if(!idPattern.test(processedData.id)){
        errors.push("Invalid ID.");
    }

    // Validate email
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailPattern.test(processedData.email) && !emailPattern.test(processedData.nustemail)) {
        errors.push("Invalid email format.");
    }


    // Validate phone number
    const phonePattern = /^[0-9]{11}$/;
    if (!phonePattern.test(processedData.contactno)) {
        errors.push("Contact number must be a 11-digit number.");
    }

    return errors;
};




// Handle POST request to /student
router.post('/', async (req, res) => {
    const formData = req.body; // Get form data sent from frontend
    console.log('Received form data:', formData);

    const processedData = {
        id: parseInt(formData.employeeId, 10),
        name: formData.name,
        gender: formData.gender,
        email: formData.email,
        nustemail: formData.staffnustemail,
        contactno: formData.contactNo,
        designation: formData.designation,
        hostel: formData.hostel,
    }

    const validationErrors = validateData(processedData);
    if (validationErrors.length > 0) {
        console.log(validationErrors);
        return res.status(400).json({ errors: validationErrors || 'done' }); // Return validation errors
    }

    try {
        // Insert data into the 'managers' table in Supabase
        const { data, error } = await supabase
            .from('testmanager') // The name of your table in Supabase
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

export default router; // Export the router to be used in server.js

