// middleware/isAdmin.js
const isAdmin = (req, res, next) => {
  try {
    const { name, role } = req.body;

    if (!name || !role) {
      return res.status(400).json({ error: "Name and role are required" });
    }

    if (role === "admin") {
      next(); // Allowed to proceed
    } else {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = isAdmin;
