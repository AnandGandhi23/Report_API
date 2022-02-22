const authentication = (req, res) => {
    const {username, password} = req.body;
    const response = {
        isAuthenticated: false
    }
    if (username === 'admin@gmail.com' && password === 'password123') {
        response.isAuthenticated = true;
    }
    res.send(JSON.stringify(response));
};

module.exports = {
    authentication
}
