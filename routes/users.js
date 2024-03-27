var express = require('express');
const authMiddleware = require('../middleware/authentification');
var router = express.Router();
var User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/',authMiddleware ,async (req, res) => {
  try {
    const users = await User.findAll();
    console.log(users);
    res.json(users);
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs :', err);
    res.status(500).send('Erreur lors de la récupération des utilisateurs');
  }
});

router.post('/create', async (req, res) => {
  try {
    const { firstName, lastName, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Génère un hachage du mot de passe avec un coût de 10
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword, // Enregistre le mot de passe chiffré dans la base de données
    });
    res.json(user);
  } catch (err) {
    console.error('Erreur lors de la création d\'un nouvel utilisateur :', err);
    res.status(500).send('Erreur lors de la création d\'un nouvel utilisateur');
  }
});

router.put('/:id/update',authMiddleware , async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (password) {
      // Si un nouveau mot de passe est fourni, chiffrez-le avant de l'enregistrer dans la base de données
      const hashedPassword = await bcrypt.hash(password, 10);
      req.body.password = hashedPassword;
    }

    const [updatedRowsCount] = await User.update(req.body, {
      where: { id },
    });

    if (updatedRowsCount === 1) {
      res.json({ message: 'Utilisateur mis à jour avec succès' });
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur :', err);
    res.status(500).send('Erreur lors de la mise à jour de l\'utilisateur');
  }
});

router.delete('/:id/delete',authMiddleware , async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.destroy({
      where: { id },
    });
    if (deletedUser === 1) {
      res.json({ message: 'Utilisateur supprimé avec succès' });
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'utilisateur :', err);
    res.status(500).send('Erreur lors de la suppression de l\'utilisateur');
  }
});

router.delete('/deleteall',authMiddleware , async (req, res) => {
  try {
    await User.destroy({ where: {} });
    res.status(200).json({ message: 'Tous les utilisateurs ont été supprimés avec succès.' });
  } catch (error) {
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la suppression des utilisateurs.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Recherche de l'utilisateur dans la base de données en utilisant l'e-mail
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Si l'utilisateur n'est pas trouvé, renvoyer une erreur d'authentification
      return res.status(401).json({ message: 'Adresse e-mail ou mot de passe incorrect' });
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Si le mot de passe est incorrect, renvoyer une erreur d'authentification
      return res.status(401).json({ message: 'Adresse e-mail ou mot de passe incorrect' });
    }

    // Génération du jeton d'authentification
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    // Authentification réussie, vous pouvez générer un jeton d'authentification ici si vous utilisez un système de jeton comme JWT (JSON Web Token)

    // Renvoyer une réponse réussie avec les détails de l'utilisateur ou le jeton d'authentification
    res.json({ message: 'Authentification réussie', token: token, user });
  } catch (err) {
    console.error('Erreur lors de l\'authentification de l\'utilisateur :', err);
    res.status(500).send('Erreur lors de l\'authentification de l\'utilisateur');
  }
});

module.exports = router;