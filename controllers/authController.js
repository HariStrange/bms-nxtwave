const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../config/pgConfig");

const register = async (req, res) => {
  const { username, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const registerQuery = `
  INSERT INTO users(username,password)
  VALUES($1,$2)
  RETURNING *;
  `;
  const values = [username, hashed];

  try {
    const result = await db.query(registerQuery, values);
    return res.status(201).json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to register user",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const findUserQuery = `
  SELECT * FROM users WHERE username = $1;
  `;

  const userResponse = await db.query(findUserQuery, [username]);

  if (userResponse.rows.length === 0) {
    res.status(404).json({
      success: false,
      message: "user not found",
    });
  }

  const user = userResponse.rows[0];
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    res.status(400).json({
      success: false,
      message: "invalid credentials",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  res.status(200).json({
    success: true,
    message: "login successfull",
    token,
  });
};

module.exports = {
  register,
  login,
};
