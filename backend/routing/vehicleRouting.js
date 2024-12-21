import supabase from '../../src/supabaseClient.js';  
import express from 'express';
const router = express.Router(); // Use express.Router() to define routes
//const supabase = require('../../src/supabaseClient'); 



const validateData = (processedData) => {
    const errors = [];

    const idPattern = /^[0-9]+$/;
    if (!idPattern.test(processedData.regNum) || !idPattern.test(processedData.engineNum) || !idPattern.test(processedData.chassisNum) || !idPattern.test(processedData.cms) ) {
        errors.push("Invalid Entry.");
    }


    return errors;
};

// Handle POST request to /student
router.post('/', async (req, res) => {
    const formData = req.body; // Get form data sent from frontend
    console.log('Received form data:', formData);

    const processedData = {
        regNum: parseInt(formData.registrationNo,10),
        vehicleType: formData.vehicleType,
        model: formData.model,
        vehicleName: formData.name,
        engineNum: parseInt(formData.engineNo,10),
        chassisNum: parseInt(formData.chassisNo,10),
        ownerName: formData.ownerName,
        cms: parseInt(formData.cmsId,10)
    }

    // Run validation
    const validationErrors = validateData(processedData);
    if (validationErrors.length > 0) {
        console.log(validationErrors);
        return res.status(400).json({ errors: validationErrors }); // Return validation errors
    }

    try {
        // Insert data into the 'students' table in Supabase
        const { data, error } = await supabase
            .from('testvehicles') // The name of your table in Supabase
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

