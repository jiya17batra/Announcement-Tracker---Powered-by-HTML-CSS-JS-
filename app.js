app.post('/register', (req, res) => {
    // Validate data here
    if (!req.body.email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    // Continue with registration logic...
});