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
    <!-- Muestra el texto Total y el total de ventas de Yape -->
    <label class="total-text" v-if="totalVentasYape !== null">
      Total Yape: S/ {{ totalVentasYape }}
    </label>

    <!-- Muestra el texto Total y el total de todas las ventas -->
    <label class="total-text" v-if="totalVentas !== null">
      Total en Efectivo: S/ {{ totalVentasEfectivo }}
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
          <th>Metodo de Pago</th>
          <th>Eliminar</th>
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
          <td>{{ venta.payment_method }}</td>
          <td>
            <button
              @click="eliminarVenta(venta.numero_documento)"
              class="eliminar-button"
            >
              Eliminar
            </button>
          </td>
          <!-- Botón para eliminar la venta -->
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
      totalVentasEfectivo: null, // Total de ventas en efectivo
      totalVentasYape: null, // Total de ventas con Yape
    };
  },
  methods: {
    async consultarReporte() {
      try {
        console.log("fecha:" + this.fechaConsulta);
        // Realizar la solicitud HTTP GET al servidor con la fecha de consulta
        const response = await fetch(
          `https://sale-point-backend-test.onrender.com/report/ventas-del-dia?fecha=${this.fechaConsulta}`
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
        this.calcularTotalVentasEfectivo();
        this.calcularTotalVentasYape();
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
    calcularTotalVentasEfectivo() {
      if (this.ventasDelReporte.length === 0) {
        this.totalVentasEfectivo = null;
      } else {
        this.totalVentasEfectivo = this.ventasDelReporte.reduce(
          (total, venta) => {
            if (venta.payment_method === "Efectivo") {
              const totalVenta = total + venta.total_venta;
              console.log("Total de ventas en efectivo:", totalVenta);
              return totalVenta;
            }
            return total;
          },
          0
        );
      }
    },
    calcularTotalVentasYape() {
      if (this.ventasDelReporte.length === 0) {
        this.totalVentasYape = null;
      } else {
        this.totalVentasYape = this.ventasDelReporte.reduce((total, venta) => {
          if (venta.payment_method === "Yape") {
            const totalVentaYape = total + venta.total_venta;
            console.log("Total de ventas con Yape:", totalVentaYape);
            return totalVentaYape;
          }
          return total;
        }, 0);
      }
    },
    async eliminarVenta(numeroDocumento) {
      try {
        console.log(
          "Número de documento de la venta a eliminar:",
          numeroDocumento
        );

        // Realizar la solicitud HTTP DELETE al servidor para eliminar la venta
        const response = await fetch(
          `https://sale-point-backend-test.onrender.com/report/eliminar_venta/${numeroDocumento}`,
          {
            method: "DELETE",
          }
        );

        // Verificar si la solicitud fue exitosa
        if (!response.ok) {
          throw new Error("Error al eliminar la venta");
        }

        // Si la eliminación fue exitosa, recargar los datos del reporte
        this.consultarReporte();
      } catch (error) {
        // Manejar cualquier error que ocurra durante la eliminación de la venta
        console.error("Error al eliminar la venta:", error);
      }
    },
  },
};
</script>

<style scoped src="./ReportView.css"></style>
