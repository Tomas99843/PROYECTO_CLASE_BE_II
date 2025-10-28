import passport from "passport";

// Requiere passport-jwt leyendo la cookie "access_token"
export const requireJwtCookie = (req, res, next) => {
  return passport.authenticate('jwt-cookie', { session: false }, (err, user, info) => {
	if (err) return next(err);
	if (!user) {
	  return res.status(401).json({ error: 'Unauthorized' });
	}
	req.user = user;
	next();
  })(req, res, next);
};

