signup, login workflow

signup (/signup)
    1.user signup with username, password, role.
    2./signup endpoint checks and saves in db.
    3.hashes the password using bcrypt.

login (/login)
    1.user login with username, password, role.
    2./login endpoint verifies with db.
    3.once verfied,token is issued(signed) using jwt.
    4.token send back to client as a json (as of now,in production, we can use httponly to store the token in cookies)
    5.subsequent calls to the backend other public routes such as /signup and /login, must include jwt token and that token is verified with middleware(authMiddleware.js)