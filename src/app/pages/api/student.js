/**


import supabase from 'D:\NUST\DataBase Systems\HostelManagementSystem\src\supabaseClient'; // Import Supabase client

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body; // Get data sent from the frontend
    console.log('Received data:', data); // Debugging

    const { error } = await supabase.from('users').insert(data); // Insert data into the 'students' table

    if (error) {
      console.error('Database error:', error); // Log the error
      return res.status(500).json({ error: 'Database insertion failed.' });
    }

    return res.status(200).json({ message: 'Registration successful!' }); // Success response
  } else {
    return res.status(405).json({ error: 'Method not allowed' }); // Only POST requests are allowed
  }
} */