const admin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ message: 'Forbidden: Admin access only' });
};

module.exports = { admin };