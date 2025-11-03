const db = require("../config/pgConfig");

const postBatteryData = async (req, res) => {
  const { battery_id, current, voltage, temperature } = req.body;

  if (!battery_id || !current || !voltage || !temperature) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const time = new Date().toISOString();

  const insertQuery = `
  INSERT INTO battery_data (battery_id,current,voltage,temperature,time)
  VALUES ($1,$2,$3,$4,$5)
  RETURNING *;  
  `;

  const values = [battery_id, current, voltage, temperature, time];

  try {
    const result = await db.query(insertQuery, values);
    return res.status(201).json({
      success: true,
      data: result,
      message: "battery data inserted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "database error during the insertion",
      error: error.message,
    });
  }
};

const getBatteryData = async (Req, res) => {
  const getQuery = `
  SELECT * FROM battery_data`;

  try {
    const result = await db.query(getQuery);
    return res.status(200).json({
      success: true,
      message: "battery data fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "database error during the fetching",
      error: error.message,
    });
  }
};

const getBatteryDataById = async (req, res) => {
  const { id } = req.params;

  const getQuery = `
  SELECT * FROM battery_data
  WHERE battery_id = $1
  ORDER BY time DESC;
  `;

  const values = [id];

  try {
    const result = await db.query(getQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No battery data found for the given id: " + id,
      });
    }
    return res.status(200).json({
      success: true,
      message: "battery data fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "database error during fetching by id",
      error: error.message,
    });
  }
};

const getBatteryFieldData = async (req, res) => {
  const { id, field } = req.params;
  const { start, end } = req.query;

  const validFields = ["current", "voltage", "temperature", "time"];
  if (!validFields.includes(field)) {
    return res.status(400).json({
      success: false,
      message: "invalid field requested: " + field,
    });
  }

  let getQuery = `
  SELECT ${field},time FROM battery_data
  WHERE battery_id = $1
  `;
  const values = [id];

  if (start && end) {
    getQuery += ` AND time >= $2 AND time <= $3`;
    values.push(start, end);
  }

  getQuery += `ORDER BY time ASC;`;

  try {
    const result = await db.query(getQuery, values);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found for the given parameter",
      });
    }
    return res.status(200).json({
      success: true,
      message: "battery field data fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "database error during fetching field data",
    });
  }
};

module.exports = {
  postBatteryData,
  getBatteryData,
  getBatteryDataById,
  getBatteryFieldData,
};
