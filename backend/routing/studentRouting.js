import supabase from '../../src/supabaseClient.js';  
import express from 'express';
const router = express.Router(); // Use express.Router() to define routes

const validateData = (processedData) => {
    const errors = [];

    const idPattern = /^[0-9]{6}$/;  // Matches exactly 6 digits
    if(!idPattern.test(processedData.id)){
        errors.push("Invalid CMS ID.");
    }

    // Validate email
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailPattern.test(processedData.email)) {
        errors.push("Invalid email format.");
    }

    // Validate batch (positive integer)
    const batch = parseInt(processedData.batch, 10);
    if (isNaN(batch) || batch <= 0) {
        errors.push("Batch should be a positive integer.");
    }

    // Validate phone number
    const phonePattern = /^[0-9]{11}$/;
    if (!phonePattern.test(processedData.contactno)) {
        errors.push("Contact number must be a 11-digit number.");
    }

    //Validate room number
    const roomnoPattern = /^[0-9]{3}$/;
    if(!roomnoPattern.test(processedData.roomno)){
        errors.push("Invalid room number.");
    }

    return errors;
};

// Handle POST request to /student
router.post('/', async (req, res) => {
    const formData = req.body; // Get form data sent from frontend
    console.log('Received form data:', formData);

    const processedData = {
        id: parseInt(formData.registrationNo, 10),
        name: formData.name,
        fatherName: formData.fathersName,
        email: formData.email,
        nustemail: formData.nustemail,
        contactno: formData.contactNo,
        school: formData.school,
        batch: parseInt(formData.batch, 10),
        discipline: formData.discipline,
        hostel: formData.hostel,
        roomno: parseInt(formData.roomNo, 10),
        gender: formData.gender
    };

    const validationErrors = validateData(processedData);
    if (validationErrors.length > 0) {
        console.log(validationErrors);
        return res.status(400).json({ errors: validationErrors || 'done' }); // Return validation errors
    }

    try {
        // Insert data into the 'testuser' table in Supabase
        const { data, error } = await supabase
            .from('testuser') // The name of your table in Supabase
            .insert(processedData); // Insert the form data into the table

        if (error) {
            console.error('Supabase Error:', error); // Log the error for debugging
            return res.status(500).json({ error: error.message || 'Database insertion failed' }); // Send back a meaningful error message
        }

        console.log('Data inserted successfully', data);
        res.status(200).json({ message: 'Registration successful!' }); // Return success response
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'Database insertion failed: ' + error.message }); // Return detailed error message
    }
});

export default router; // Export the router to be used in server.js
