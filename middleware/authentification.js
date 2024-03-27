const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Récupérer le jeton d'authentification de l'en-tête Authorization
  const token = req.headers.authorization;

  if (!token) {
    // Si le jeton n'est pas fourni, renvoyer une erreur d'authentification
    return res.status(401).json({ message: 'Accès non autorisé. Jeton manquant.' });
  }

  try {

    // Vérifier et décoder le jeton
    const decoded = jwt.verify(token.substring(7), process.env.JWT_SECRET);

    // Ajouter l'ID de l'utilisateur à la demande pour une utilisation ultérieure
    req.userId = decoded.userId;

    // Passer à la prochaine étape du flux de traitement
    next();
  } catch (err) {
    // Si le jeton n'est pas valide, renvoyer une erreur d'authentification
    return res.status(401).json({ message: 'Accès non autorisé. Jeton invalide.' });
  }
};

module.exports = authMiddleware;