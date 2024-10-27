const checkRole = (roles) => {
    return (req, res, next) => {
        const isAllow = roles.some(role => req.userRoles.includes(role))
        if (isAllow) {
            next()
        } else {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
    }
}

export default checkRole;