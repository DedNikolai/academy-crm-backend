import jwt from 'jsonwebtoken';
import 'dotenv/config';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const userRoles = decoded.roles;
            req.userId = decoded._id;
            req.userRoles = userRoles
            next();
        } catch {
            return res.status(403).json({
                message: 'Unauthorized'
            })
        }
    } else {
        return res.status(403).json({
            message: 'Unauthorized'
        })
    }
}