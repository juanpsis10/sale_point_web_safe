const express = require("express");
const router = express.Router();
const knex = require("knex");
const dbConfig = require("../../knexfile");

const db = knex(dbConfig.development);

router.get("/ventas-del-dia", async (req, res) => {
  try {
    // Obtener la fecha actual
    const fecha = new Date().toLocaleDateString("en-US", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

    // Consulta SQL para obtener las ventas del día con los detalles requeridos
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
          date LIKE '${fecha}%'
      GROUP BY
          sale.document_number;
    `;

    // Ejecutar la consulta en la base de datos
    const result = await db.raw(query);

    // Enviar los resultados como respuesta al cliente
    res.json(result);
  } catch (error) {
    console.error("Error al obtener las ventas del día:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/total-ventas", async (req, res) => {
  const fecha = new Date().toLocaleDateString("en-US", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  console.log("fecha: " + fecha);
  // Consulta SQL para obtener el total de ventas del día
  const query = `
    SELECT SUM(total) AS total_ventas
    FROM sale
    WHERE date LIKE '${fecha}%';`;

  try {
    // Ejecutar la consulta
    const result = await db.raw(query);

    const totalVentas = result[0].total_ventas; // Acceder directamente al total de ventas

    if (!totalVentas) {
      return res
        .status(404)
        .json({ error: "No se encontraron ventas para la fecha especificada" });
    }
    // Enviar el total de ventas como respuesta
    res.json({ total_ventas: totalVentas });
  } catch (error) {
    console.error("Error al obtener el total de ventas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta para obtener el primer cliente
router.get("/primercliente", async (req, res) => {
  try {
    // Obtener el primer cliente de la base de datos
    const primerCliente = await db("client").first();
    if (!primerCliente) {
      return res
        .status(404)
        .json({ message: "No se encontró ningún cliente." });
    }
    res.json(primerCliente);
  } catch (error) {
    console.error("Error al obtener el primer cliente:", error);
    res.status(500).json({
      error: "Error interno del servidor al obtener el primer cliente.",
    });
  }
});

router.post("/registrar-venta", async (req, res) => {
  try {
    const {
      client_id,
      user_id,
      branch_id,
      product_id,
      document_number,
      cantidad_producto,
      total,
      date, // Agregar la fecha y hora de la venta
    } = req.body;

    // Insertar la venta en la base de datos
    await db("sale").insert({
      client_id,
      user_id,
      branch_id,
      product_id,
      document_number,
      cantidad_producto,
      total,
      date, // Agregar la fecha y hora de la venta
    });

    // Actualizar el stock del producto en la sucursal
    await db("product_branch")
      .where({ product_id, branch_id })
      .decrement("stock_quantity", cantidad_producto);

    res.status(200).json({ message: "Venta registrada exitosamente" });
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al registrar la venta" });
  }
});

router.get("/last-document-number", async (req, res) => {
  try {
    // Consulta para obtener el último número de documento
    const lastDocument = await db("sale")
      .orderBy("document_number", "desc")
      .select("document_number")
      .limit(1)
      .first();

    // Si no hay ventas registradas aún, asignamos el número inicial
    let nextDocumentNumber = 1;
    if (lastDocument) {
      // Incrementamos el último número de documento en 1
      nextDocumentNumber = lastDocument.document_number + 1;
    }

    // Formateamos el número de documento para que tenga 9 dígitos
    const formattedDocumentNumber = String(nextDocumentNumber).padStart(9, "0");

    res.status(200).json({ document_number: formattedDocumentNumber });
  } catch (error) {
    console.error("Error al obtener el último número de documento:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
