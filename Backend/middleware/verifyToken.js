import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({ message: "Invalid token." });
    }
    req.userId = decoded.userId; // Attach the decoded user info to the request object
    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(400).json({ message: "Invalid token." });
  }
};
