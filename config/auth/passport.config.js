import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { User } from '../models/user.model.js';
import dotenv from "dotenv";
dotenv.config();

// Función que sirve para leer el token JWT desde las cookies httpOnly 'access_token'
function cookieExtractor(req) {
    if (req && req.cookies && req.cookies.access_token) {
        return req.cookies.access_token;
    }
    return null;
}

export function initPassport() {
    // Estrategia JWT para cookies
    passport.use('jwt-cookie', new JwtStrategy(
        {
            jwtFromRequest: cookieExtractor,
            secretOrKey: process.env.JWT_SECRET
        },
        async (payload, done) => {
            try {
                const user = await User.findById(payload.sub);
                if (!user) return done(null, false);
                
                return done(null, { 
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    age: user.age,
                    role: user.role 
                });
            } catch (error) {
                return done(error, false);
            }
        }
    ));

    // Serialización del usuario
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // Deserialización del usuario
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}