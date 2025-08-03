const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {
    proposeTransaction,
    verifyTransaction,
    rejectTransaction,
    getTransaction,
    getCredits,
} = require("./contract");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to propose a transaction
app.post("/api/propose", async (req, res) => {
    const { creditedPerson, description, amount } = req.body;
    try {
        const txHash = await proposeTransaction(creditedPerson, description, amount);
        res.json({ success: true, txHash });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint to verify a transaction
app.post("/api/verify", async (req, res) => {
    const { id } = req.body;
    try {
        const txHash = await verifyTransaction(id);
        res.json({ success: true, txHash });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint to reject a transaction
app.post("/api/reject", async (req, res) => {
    const { id } = req.body;
    try {
        const txHash = await rejectTransaction(id);
        res.json({ success: true, txHash });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint to get a transaction
app.get("/api/transaction/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await getTransaction(id);
        res.json({ success: true, transaction });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint to get credits
app.get("/api/credits/:person", async (req, res) => {
    const { person } = req.params;
    try {
        const credits = await getCredits(person);
        res.json({ success: true, credits });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
