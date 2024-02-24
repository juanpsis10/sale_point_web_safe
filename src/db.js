const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./DB/sale_point.db", // Ruta de mi BD c:
  },
});

module.exports = knex;
