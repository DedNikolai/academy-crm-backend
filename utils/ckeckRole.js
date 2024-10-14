const checkRole = (role) => {
    return (req, res, next) => {
        if (req.userRoles.includes(role)) {
            next()
        } else {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
    }
}

export default checkRole;