/**
 * Role-check middleware factory.
 * Usage: requireRole('admin') or requireRole('admin', 'faculty')
 *
 * Must be used AFTER verifyToken middleware so that req.user is set.
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }

    next();
  };
}
