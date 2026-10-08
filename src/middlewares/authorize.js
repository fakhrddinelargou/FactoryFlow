const authorize = (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: 'something wrong' })
    }
    if (user.role !== 'admin') {
        return res.status(403).json({ error: 'tou dont have access' })
    }
    next()
}

module.exports = authorize