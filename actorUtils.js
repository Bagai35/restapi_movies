async function getActorId(firstName, lastName) {
  const [rows] = await pool.execute('SELECT actor_id FROM actor WHERE first_name = ? AND last_name = ?', [firstName, lastName]);
  if (rows.length > 0) {
    return rows[0].actor_id;
  } else {
    const [insertResult] = await pool.execute('INSERT INTO actor (first_name, last_name) VALUES (?, ?)', [firstName, lastName]);
    return insertResult.insertId;
  }
}

module.exports = { getActorId };
