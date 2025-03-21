const bcrypt = require('bcrypt');

app.post('/register', async (req, res) => {
    const { fullName, email, phone, userId, password, gender, dob, bloodGroup } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser  = new User({
        fullName,
        email,
        phone,
        userId,
        password: hashedPassword, // Store the hashed password
        gender,
        dob,
        bloodGroup
    });

    try {
        await newUser .save();
        res.status(200).json({ message: 'Registration Successful!' });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});