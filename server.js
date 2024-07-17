
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./modèles/User'); 


// Charger les variables d'environnement
dotenv.config({ path: './config/.env' });

// Créer l'application Express
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connecté'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Routes
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/users', async (req, res) => {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { name, email, password }, { new: true });
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });

    }
});

app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
