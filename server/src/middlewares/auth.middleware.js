const jwt = require("jsonwebtoken");

exports.auth = (...roles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader.split(" ")[0] !== "Bearer") {
        return res
          .status(401)
          .send({ message: "Unauthorized: No token provided" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      req.user = decoded;
    } catch (error) {
      return res.status(401).send({ message: "Unauthorized access" });
    }

    if (roles && !roles.includes(req.user?.role)) {
      return res.status(403).send({ message: "Forbidden access" });
    }

    next();
  };
};
