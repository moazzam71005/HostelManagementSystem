import express from 'express';
import bcrypt from 'bcrypt';
import supabase from '../../src/supabaseClient.js';

const router = express.Router(); // Use express.Router() to define routes

// -------------------- DATA VALIDATION -------------------- //
const validateData = (processedData) => {
    const errors = [];

    // CMS ID: Exactly 6 digits
    const idPattern = /^[0-9]{6}$/;
    if (!idPattern.test(processedData.id)) {
        errors.push("Invalid CMS ID: Must be exactly 6 digits.");
    }

    // Email: Valid format
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailPattern.test(processedData.email)) {
        errors.push("Invalid email format.");
    }

    // Batch: Positive integer
    const batch = parseInt(processedData.batch, 10);
    if (isNaN(batch) || batch <= 0) {
        errors.push("Batch must be a positive integer.");
    }

    // Contact number: Exactly 11 digits
    const phonePattern = /^[0-9]{11}$/;
    if (!phonePattern.test(processedData.contactno)) {
        errors.push("Contact number must be exactly 11 digits.");
    }

    // Room number: Exactly 3 digits
    const roomnoPattern = /^[0-9]{3}$/;
    if (!roomnoPattern.test(processedData.roomno)) {
        errors.push("Room number must be exactly 3 digits.");
    }

    return errors;
};

// -------------------- POST REQUEST HANDLER -------------------- //
router.post('/', async (req, res) => {
    const formData = req.body; // Get form data sent from frontend
    console.log('Received form data:', formData);

    // Extract form data and prepare for processing
    const processedData = {
        id: formData.registrationNo,  // CMS ID
        name: formData.name,
        fathername: formData.fathername,
        email: formData.email,
        nustemail: formData.nustemail,
        contactno: formData.contactNo,
        school: formData.school,
        batch: formData.batch,
        discipline: formData.discipline,
        hostel: formData.hostel,
        roomno: formData.roomNo,
        gender: formData.gender,
        password: formData.password,          // Raw password
        confirmPassword: formData.confirmPassword // Confirm password
    };

    // Validate required fields
    if (!processedData.password || !processedData.confirmPassword) {
        return res.status(400).json({ error: "Password fields are required." });
    }

    // Check if passwords match
    if (processedData.password !== processedData.confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match." });
    }

    // Run validation
    const validationErrors = validateData(processedData);
    if (validationErrors.length > 0) {
        console.log(validationErrors);
        return res.status(400).json({ errors: validationErrors }); // Return validation errors
    }

    try {
        // Hash the password before storing
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(processedData.password, saltRounds);

        // Prepare data for database insertion
        const dbData = {
            id: parseInt(processedData.id, 10),
            name: processedData.name,
            fathername: processedData.fathername,
            email: processedData.email,
            nustemail: processedData.nustemail,
            contactno: processedData.contactno,
            school: processedData.school,
            batch: parseInt(processedData.batch, 10),
            discipline: processedData.discipline,
            hostel: processedData.hostel,
            roomno: parseInt(processedData.roomno, 10),
            gender: processedData.gender,
            password_hash: hashedPassword, // Store hashed password
        };

        // Insert data into Supabase 'testuser' table
        const { data, error } = await supabase
            .from('testuser')
            .insert(dbData);

        if (error) {
            console.error('Supabase Error:', error);
            return res.status(500).json({ error: error.message || 'Database insertion failed' });
        }

        console.log('Data inserted successfully', data);
        res.status(200).json({ message: 'Registration successful!' });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'Database insertion failed: ' + error.message });
    }
});

export default router; // Export the router to be used in server.js
