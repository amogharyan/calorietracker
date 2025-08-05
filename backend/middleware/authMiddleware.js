import jwt from "jsonwebtoken";

// middleware to protect routes and verify jwt token
const authMiddleware = (req, res, next) => {
  // get authorization header from incoming request
  const authHeader = req.headers.authorization;

  // check if header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // if no token or malformed header, deny access
    return res.status(401).json({ message: "no token provided, authorization denied" });
  }

  // extract token from header "Bearer tokenstring"
  const token = authHeader.split(" ")[1];

  try {
    // verify token using jwt secret from env variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach decoded user info (id, email) to req object for use in next handlers
    req.user = decoded;

    // call next middleware/controller
    next();
  } catch (err) {
    // if token verification fails, deny access with appropriate message
    return res.status(401).json({ message: "token is not valid" });
  }
};

export default authMiddleware;