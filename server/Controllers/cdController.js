const pool = require("../configs/db")

/** @type {import('express').RequestHandler} */
// Récupérer tous les CD
exports.getAllCDs = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cds ORDER BY id ASC")
    return res.json(result.rows)
  } catch (/** @type {any} */ error) {
    res.status(500).json({ error: error.message })
  }
}

/** @type {import('express').RequestHandler} */
// Ajouter un CD
exports.addCD = async (req, res) => {
  const { title, artist, year } = req.body
  try {
    const result = await pool.query(
      "INSERT INTO cds (title, artist, year) VALUES ($1, $2, $3) RETURNING *",
      [title, artist, year]
    )
    return res.status(201).json(result.rows[0])
  } catch (/** @type {any} */ error) {
    res.status(500).json({ error: error.message })
  }
}

/** @type {import('express').RequestHandler} */
// Supprimer un CD
exports.deleteCD = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query("DELETE FROM cds WHERE id = $1", [id])
    return res.status(204).send()
  } catch (/** @type {any} */ error) {
    res.status(500).json({ error: error.message })
  }
}
