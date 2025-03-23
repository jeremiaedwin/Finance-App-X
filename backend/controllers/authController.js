const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs');
const path = require('path');

// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
    const { username, password } = req.body;


    if (!username || !password) {
        return res.status(400).json({ message: 'All fields (user and password) are required' });
    }

    // Read and parse the JSON file
    const filePath = path.join(__dirname, '../data/user.json'); // Adjust path as needed
    let users;

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        users = JSON.parse(data);
    } catch (error) {
        console.error('Error reading users.json:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }


    // Find user in JSON data
    const foundUser = users.find(user => user.username === username);

    if (!foundUser || !foundUser.active) {
        console.log(`User ${username} not found or inactive.`);
        return res.status(401).json({ message: 'User Identified Unauthorized' });
    }

    // Compare passwords
    const match = await bcrypt.compare(password, foundUser.password);


    if (!match) return res.status(401).json({ message: 'User Identified Unauthorized' });

    // Generate JWT tokens
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser.username,
                "displayname": foundUser.displayname,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match refresh token
    });

    // Send accessToken containing username and roles 
    res.json({ accessToken });
};

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies

    console.log(cookies)

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const filePath = path.join(__dirname, '../data/user.json'); // Adjust path as needed
            let users;
        
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                users = JSON.parse(data);
            } catch (error) {
                console.error('Error reading users.json:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        
        
            // Find user in JSON data
            const foundUser = users.find(user => user.username === decoded.username);

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "displayname": foundUser.displayname,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        }
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout,
}