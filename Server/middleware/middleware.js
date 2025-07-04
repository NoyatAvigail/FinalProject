import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const generateToken = (id, email, type) =>
  jwt.sign({ id, email, type }, JWT_SECRET, { expiresIn: "24h" });

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "There is no token" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "The token is invalid" });
  }
};

export const validateUserId = (req, res, next) => {
  const requestedId = req.params.userId;
  const authenticatedId = req.user.id.toString();
  if (requestedId != authenticatedId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};