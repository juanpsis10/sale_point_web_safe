<template>
  <div class="report-view">
    <!-- Input de fecha -->
    <input type="date" v-model="fechaConsulta" class="date-input" />

    <!-- Botón Consultar -->
    <button @click="consultarReporte" class="consultar-button">
      Consultar
    </button>

    <!-- Muestra el texto Total y el total de ventas -->
    <label class="total-text" v-if="totalVentas !== null">
      Total: S/ {{ totalVentas }}
    </label>

    <!-- Tabla para mostrar resultados del reporte -->
    <table class="report-table">
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Cliente</th>
          <th>Fecha</th>
          <th>Número de Documento</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <!-- Aquí se iterarán los resultados del reporte -->
        <tr v-for="venta in ventasDelReporte" :key="venta.id">
          <td>{{ venta.usuario }}</td>
          <td>{{ venta.cliente }}</td>
          <td>{{ venta.primer_fecha }}</td>
          <td>{{ venta.numero_documento }}</td>
          <td>S/.{{ venta.total_venta }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "ReportView",
  data() {
    return {
      fechaConsulta: "", // Almacena la fecha seleccionada para la consulta
      ventasDelReporte: [], // Almacena los resultados del reporte
      totalVentas: null, // Total de ventas
    };
  },
  methods: {
    async consultarReporte() {
      try {
        console.log("fecha:" + this.fechaConsulta);
        // Realizar la solicitud HTTP GET al servidor con la fecha de consulta
        const response = await fetch(
          `http://localhost:3000/report/ventas-del-dia?fecha=${this.fechaConsulta}`
        );

        // Verificar si la solicitud fue exitosa
        if (!response.ok) {
          throw new Error("Error al consultar el reporte");
        }

        // Obtener los datos de la respuesta en formato JSON
        const data = await response.json();
        console.log(
          "Cantidad de arrays en data:",
          Array.isArray(data) ? data.length : 0
        );
        console.log("Datos recibidos:", data);

        // Asignar los datos obtenidos al arreglo ventasDelReporte en el componente Vue
        if (typeof data === "object" && !Array.isArray(data)) {
          // Crear un array y agregar el objeto de datos a este array
          const arrayData = [data];
          // Asignar el array de datos a ventasDelReporte
          this.ventasDelReporte = arrayData;
        } else {
          // Si los datos son un array, asignarlos directamente a ventasDelReporte
          this.ventasDelReporte = data;
        }

        // Calcular el total de ventas
        this.calcularTotalVentas();
      } catch (error) {
        // Manejar cualquier error que ocurra durante la consulta
        console.error("Error al consultar el reporte:", error);
      }
    },
    // Método para calcular el total de ventas
    calcularTotalVentas() {
      if (this.ventasDelReporte.length === 0) {
        this.totalVentas = null;
      } else {
        this.totalVentas = this.ventasDelReporte.reduce((total, venta) => {
          return total + venta.total_venta;
        }, 0);
      }
    },
  },
};
</script>

<style scoped src="./ReportView.css"></style>
