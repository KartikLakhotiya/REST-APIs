import express from 'express'
const app = express();

// Routes

app.get('/', (req, res) => {
    res.json({message:"Welcome to my EBook Store."})
})

export default app;