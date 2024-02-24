const express = require("express");
const router = express.Router();
const knex = require("knex");
const dbConfig = require("../../knexfile");

const db = knex(dbConfig.development);

router.get("/ventas-del-dia", async (req, res) => {
  const { fecha } = req.query;
  const [year, month, day] = fecha.split("-");
  const formattedMonth = parseInt(month, 10).toString(); // Eliminar el cero inicial
  const formattedDay = parseInt(day, 10).toString(); // Eliminar el cero inicial
  const formattedFecha = `${formattedMonth}/${formattedDay}/${year}`;
  console.log("fecha serv:" + formattedFecha);
  // Consulta SQL para obtener las ventas del día
  const query = `
      SELECT
        u.username AS usuario,
        c.name AS cliente,
        sale.document_number AS numero_documento,
        MIN(sale.date) AS primer_fecha,
        SUM(sale.total) AS total_venta
      FROM
        sale
      JOIN
        user u ON sale.user_id = u.id
      JOIN
        client c ON sale.client_id = c.id
      WHERE
        date LIKE '${formattedFecha}%'
      GROUP BY
        sale.document_number`;

  try {
    // Ejecutar la consulta
    const result = await db.raw(query);

    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron ventas para la fecha especificada" });
    }

    // Enviar las ventas del día como respuesta
    res.json(result);
  } catch (error) {
    console.error("Error al obtener las ventas del día:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
