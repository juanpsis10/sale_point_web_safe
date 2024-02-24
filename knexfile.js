// Conexion chida
module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./DB/sale_point.db",
    },
    useNullAsDefault: true,
  },
};
