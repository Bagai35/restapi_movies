async function getLanguageId(languageName) {
  const [rows] = await pool.execute('SELECT language_id FROM language WHERE name = ?', [languageName]);
  if (rows.length > 0) {
    return rows[0].language_id;
  } else {
    const [insertResult] = await pool.execute('INSERT INTO language (name) VALUES (?)', [languageName]);
    return insertResult.insertId;
  }
}

module.exports = { getLanguageId };