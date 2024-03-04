<template>
  <div class="sale-form">
    <div class="div1">
      <!-- Cliente -->
      <div class="sales-info">
        <label for="clienteNombre">Nombre del Cliente:</label>
        <input
          type="text"
          id="clienteNombre"
          v-model="clienteNombre"
          disabled
        />
      </div>

      <!-- Documento de Identidad del Cliente -->
      <div class="sales-info">
        <label for="clienteDocumento">Documento de Identidad:</label>
        <input
          type="text"
          id="clienteDocumento"
          v-model="clienteDocumento"
          disabled
        />
      </div>

      <!-- Usuario -->
      <div class="sales-info">
        <label for="usuario">Usuario:</label>
        <span id="usuario" class="username-span">{{ username }}</span>
      </div>

      <!-- Numero de Boleta -->
      <div class="sales-info">
        <label for="numBoleta">Número de Boleta:</label>
        <span id="numBoleta" class="boleta-span"></span>
      </div>

      <!-- Sucursal -->
      <div class="sales-info">
        <label for="sucursal">Sucursal:</label>
        <select id="sucursal" v-model="selectedBranch" @change="onSelectBranch">
          <option value="" selected disabled>Seleccione una sucursal</option>
          <option
            v-for="branch in branches"
            :key="branch.id"
            :value="branch.id"
          >
            {{ branch.name }}
          </option>
        </select>
      </div>
      <!-- Método de pago -->
      <div class="sales-info">
        <label for="metodoPago">Método de pago:</label>
        <input
          type="checkbox"
          id="metodoPago"
          v-model="selectedPaymentMethod"
        />
        <label for="metodoPago">Yape</label>
        <!-- Texto para indicar que el checkbox es para efectivo -->
      </div>
    </div>
    <div class="div2">
      <div class="logo">
        <img src="https://i.postimg.cc/25j3g12k/happykids.png" alt="Logo" />
      </div>

      <!-- RUC -->
      <div class="ruc">
        <label for="ruc">RUC:</label>
        <label id="ruc">xxxx-xxxx</label>
      </div>
    </div>
    <div class="div3">
      <label for="productSelect">Producto:</label>
      <select id="productSelect" v-model="selectedProduct">
        <option value="" disabled selected>Selecciona un producto</option>
        <option v-for="product in products" :key="product.id" :value="product">
          {{ product.name }}
        </option>
      </select>
      <label for="quantity">Cantidad:</label>
      <input
        type="number"
        id="quantity"
        v-model.number="quantity"
        placeholder="Cantidad"
        min="1"
      />
      <button class="button-add" @click="addProductToSale(selectedProduct)">
        Agregar
      </button>
    </div>
    <div class="div4">
      <h3>Productos Agregados</h3>
      <table class="table_products">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Código</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in productsInSale" :key="index">
            <td>{{ product.name }}</td>
            <!-- Nombre del producto -->
            <td>{{ product.code }}</td>
            <!-- Código del producto -->
            <td>{{ product.quantity }}</td>
            <!-- Cantidad del producto -->
            <td>{{ product.price }}</td>
            <!-- Precio unitario del producto -->
            <td>{{ product.subtotal }}</td>
            <!-- Subtotal del producto -->
            <td>
              <!-- Botón para eliminar el producto de la lista -->
              <button class="boton_eliminar" @click="removeProduct(index)">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="total">
        <label>Total:</label>
        <label id="totalAmount">{{ totalAmount.toFixed(2) }}</label>
      </div>
    </div>
    <div class="div5">
      <label for="totalPrice" style="font-size: 20px">Precio Total:</label>
      <label id="totalAmount" style="width: 70%" class="total-big" readonly>
        {{ totalAmount.toFixed(2) }}</label
      >
      <button class="boton-vender" @click="realizarVenta()">Vender</button>

      <!-- Botón para cancelar la venta -->
      <button class="boton-cancelar" @click="cancelSale">Cancelar</button>

      <!-- Botón para el cuadre de caja -->
      <button class="boton-cuadre" @click="cuadreDeCaja">Cuadre de Caja</button>
    </div>
    <div id="modal" class="modal">
      <div class="modal-content">
        <!-- Aquí puedes agregar el contenido de tu cuadro de diálogo -->
        <div v-if="!mostrarDetalles">
          <div class="modal-span-container">
            <span class="total_ventas">TOTAL: S/. {{ totalVentas }}</span>
            <span class="total_ventas">
              Total en efectivo: S/. {{ totalVentasEfectivo }}
            </span>
            <span class="total_ventas">
              Total en Yape: S/. {{ totalVentasYape }}
            </span>
          </div>

          <table class="custom-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Número de Documento</th>
                <th>Total</th>
                <th>Metodo de Pago</th>
                <th>Imprimir</th>
                <th>Detalles</th>
                <!-- Nueva columna -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="venta in ventasDelDia" :key="venta.id">
                <td>{{ venta.usuario }}</td>
                <td>{{ venta.cliente }}</td>
                <td>{{ venta.primer_fecha }}</td>
                <td>{{ venta.numero_documento }}</td>
                <td>S/.{{ venta.total_venta }}</td>
                <td>{{ venta.payment_method }}</td>
                <td>
                  <button
                    @click="imprimirIndividual(venta.numero_documento)"
                    class="imprimir-button"
                  >
                    Imprimir
                  </button>
                </td>
                <td>
                  <button
                    @click="detallesVenta(venta.numero_documento)"
                    class="detalles-button"
                  >
                    Detalles
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Segunda tabla para mostrar detalles de la venta -->
        <div v-if="mostrarDetalles">
          <!-- Aquí debes agregar la estructura de la segunda tabla con los detalles de la venta -->
          <table class="custom-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Número de Documento</th>
                <th>SubTotal</th>
              </tr>
            </thead>
            <tbody>
              <!-- Iterar sobre los detalles de la venta y mostrar cada fila -->
              <tr v-for="(detalle, index) in detallesVentaData" :key="index">
                <td>{{ detalle.producto }}</td>
                <td>{{ detalle.precio }}</td>
                <td>{{ detalle.cantidad }}</td>
                <td>{{ detalle.numero_documento }}</td>
                <td>{{ detalle.subtotal }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4">Total</td>
                <!-- Mostrar el total de la venta calculado con la función calcularTotalVenta() -->
                <td>{{ totalVentaDetalle }}</td>
              </tr>
            </tfoot>
          </table>

          <button @click="volver" class="volver-button">Volver</button>
        </div>

        <button @click="closeModal" class="close-modal">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
//import printJS from "print-js";

export default {
  name: "SaleView",
  data() {
    return {
      username: "", // Variable para almacenar el nombre de usuario
      selectedBranch: null, // Variable para almacenar la sucursal seleccionada
      branches: [], // Array para almacenar las sucursales
      products: [], // Lista de todos los productos disponibles
      selectedProduct: null, // Producto seleccionado
      quantity: 1, // Cantidad del producto a agregar
      clienteNombre: "",
      clienteDocumento: "",
      clienteID: "",
      productsInSale: [], // Array para almacenar los productos agregados a la venta
      totalAmount: 0, // Total de la venta
      productosTicket: [],
      totalVentas: null,
      totalVentasEfectivo: 0,
      totalVentasYape: 0,
      ventasDelDia: [], // Inicializamos ventasDelDia como un array vacío
      selectedPaymentMethod: false, // Estado del método de pago seleccionado
      mostrarDetalles: false,
      detallesVentaData: null, // Variable para almacenar los detalles de la venta
      totalVentaDetalle: 0,
    };
  },
  created() {
    this.getNextDocumentNumber();
    this.getBranches();
    this.getPrimerCliente(); // Llama al método para obtener el primer cliente al cargar el componente
  },
  mounted() {
    // Llama al método para obtener el nombre de usuario al cargar el componente
    this.username = localStorage.getItem("loggedInUsername");
  },
  methods: {
    volver() {
      this.mostrarDetalles = false;
    },
    async detallesVenta(numero_documento) {
      try {
        console.log("Documento enviado: " + numero_documento);
        const response = await fetch(
          `https://sale-point-backend-test.onrender.com/sale/detallesVenta/${numero_documento}`
        );

        console.log(
          "Después de llamar a la API para obtener detalles de la venta"
        );

        if (!response.ok) {
          throw new Error("Error al obtener detalles de la venta");
        }

        const detallesVentaData = await response.json(); // Obtener los datos de la venta

        // Verificar si se encontraron detalles de venta
        if (!detallesVentaData || detallesVentaData.length === 0) {
          console.log("Detalles de venta no encontrados");
          return;
        }

        // Iterar sobre el segundo array para obtener los detalles de venta
        const detallesVenta = detallesVentaData[0];

        // Asignar los datos de la venta a una variable en el componente
        this.detallesVentaData = detallesVenta;

        // Mostrar los detalles de la venta
        this.mostrarDetalles = true;
        console.log("Detalles de venta obtenidos con éxito:", detallesVenta);

        // Calcular el total de la venta y actualizar la variable totalVentaDetalle
        this.totalVentaDetalle = this.calcularTotalVenta();
        console.log("Total de la venta:", this.totalVentaDetalle);
      } catch (error) {
        console.error("Error al obtener detalles de la venta:", error);
      }
    },

    calcularTotalVenta() {
      if (!this.detallesVentaData) return 0;

      // Calcular el total sumando todos los subtotales
      return this.detallesVentaData.reduce(
        (total, detalle) => total + detalle.subtotal,
        0
      );
    },
    async imprimirIndividual(numero_documento) {
      try {
        console.log("documento enviado: " + numero_documento);
        const response = await fetch(
          `https://sale-point-backend-test.onrender.com/sale/imprimirIndividual/${numero_documento}`
        );
        console.log("Después de llamar a la API para imprimir individualmente");

        if (!response.ok) {
          throw new Error("frontend: Error al imprimir individualmente");
        }

        const ventaIndividual = await response.json(); // Obtener los datos de la venta individual

        // Verificar si se encontraron detalles de venta
        if (ventaIndividual.message === "Venta no encontrada") {
          console.log("Venta no encontrada");
          return;
        }

        // Verificar si hay datos en la respuesta
        ventaIndividual.forEach((array) => {
          array.forEach((item) => {
            if (
              item &&
              item.product_name &&
              item.product_name.startsWith("Ticket")
            ) {
              this.productosTicket.push({
                name: item.product_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
              });
            }
          });
        });

        this.imprimirVenta();
        console.log("Impresión individual realizada con éxito");
        // Aquí puedes agregar cualquier lógica adicional necesaria después de la impresión individual, si es necesario
      } catch (error) {
        console.error("frontend: Error al imprimir individualmente:", error);
      }
    },

    calcularTotalVentasEfectivo() {
      let total = 0; // Inicializar el total en 0

      if (this.ventasDelDia.length === 0) {
        return total; // Retornar 0 si no hay ventas
      }

      // Filtrar las ventas que tienen como método de pago "efectivo"
      const ventasEfectivo = this.ventasDelDia.filter(
        (venta) => venta.payment_method === "Efectivo"
      );

      // Sumar los totales de las ventas en efectivo
      total = ventasEfectivo.reduce(
        (total, venta) => total + venta.total_venta,
        0
      );

      return total; // Retornar el total calculado
    },

    // Método para calcular el total de ventas en Yape
    calcularTotalVentasYape() {
      let total = 0; // Inicializar el total en 0

      if (this.ventasDelDia.length === 0) {
        return total; // Retornar 0 si no hay ventas
      }

      // Filtrar las ventas que tienen como método de pago "yape"
      const ventasYape = this.ventasDelDia.filter(
        (venta) => venta.payment_method === "Yape"
      );

      // Sumar los totales de las ventas en Yape
      total = ventasYape.reduce((total, venta) => total + venta.total_venta, 0);

      return total; // Retornar el total calculado
    },
    async obtenerVentasDelDia() {
      try {
        const response = await fetch(
          "https://sale-point-backend-test.onrender.com/sale/ventas-del-dia"
        );

        if (!response.ok) {
          throw new Error("Error al obtener las ventas del día");
        }

        const ventas = await response.json();
        this.ventasDelDia = ventas;
      } catch (error) {
        console.error("Error al obtener las ventas del día:", error);
      }
    },
    async mostrarTotalVentas() {
      try {
        console.log("Antes de llamar a la API");
        const response = await fetch(
          "https://sale-point-backend-test.onrender.com/sale/total-ventas"
        );
        console.log("Después de llamar a la API");

        if (!response.ok) {
          throw new Error("frontend: Error al obtener el total de ventas");
        }

        const data = await response.json();
        console.log("Datos recibidos:", data);

        if (data && data.total_ventas !== undefined) {
          this.totalVentas = data.total_ventas;
        } else {
          throw new Error(
            "frontend: No se encontró el total de ventas en la respuesta"
          );
        }
      } catch (error) {
        console.error("frontend: Error al obtener el total de ventas:", error);
      }
    },

    async cuadreDeCaja() {
      // Mostrar la ventana modal al llamar el método
      document.getElementById("modal").style.display = "block";
      await this.mostrarTotalVentas();
      await this.obtenerVentasDelDia();
      this.totalVentasEfectivo = this.calcularTotalVentasEfectivo();
      this.totalVentasYape = this.calcularTotalVentasYape();
    },

    closeModal() {
      this.mostrarDetalles = false;
      // Ocultar la ventana modal al hacer clic en el botón "Cerrar"
      document.getElementById("modal").style.display = "none";
    },
    async realizarVenta() {
      try {
        const currentDate = new Date().toLocaleString("en-US", {
          timeZone: "America/Lima",
        });
        console.log("fecha de venta:" + currentDate);
        const document_number =
          document.getElementById("numBoleta").textContent;

        // Obtener el usuario actual
        const user_id = localStorage.getItem("loggedInUserID");

        // Método de pago predeterminado
        let paymentMethod = "Efectivo"; // Por defecto, el método de pago es "Efectivo"

        // Verificar si el método de pago está seleccionado como "Yape"
        if (this.selectedPaymentMethod) {
          paymentMethod = "Yape"; // Si está marcado, cambiar el método de pago a "Yape"
        }

        // Iterar sobre los productos en venta y enviar una solicitud para registrar cada uno
        for (const product of this.productsInSale) {
          console.log("ID del producto:", product.name); // Agregar este registro de depuración
          const venta = {
            client_id: this.clienteID, // Usar directamente el ID del primer cliente
            user_id,
            branch_id: this.selectedBranch,
            product_id: product.product_id, // Cambiar product.id a product.product_id
            document_number,
            cantidad_producto: product.quantity,
            total: product.subtotal, // El total de la venta por cada producto es el subtotal
            date: currentDate,
            payment_method: paymentMethod, // Agregar el método de pago a la solicitud
          };
          if (product.name.startsWith("Ticket")) {
            // Añadir el producto al array de productosTicket
            this.productosTicket.push({
              name: product.name,
              quantity: product.quantity,
              price: product.price,
            });
          }

          // Enviar solicitud HTTP para registrar la venta del producto
          const response = await fetch(
            "https://sale-point-backend-test.onrender.com/sale/registrar-venta",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(venta),
            }
          );
          // Llamar al método para imprimir los detalles de la venta para este producto

          if (!response.ok) {
            throw new Error("Error al registrar la venta del producto");
          }
        }

        // La venta de todos los productos se realizó correctamente
        alert("Venta registrada exitosamente");
        // Limpiar la venta
        this.cancelSale();
        await this.getNextDocumentNumber();
        this.imprimirVenta();
      } catch (error) {
        console.error("Error al realizar la venta:", error);
        alert("Error al realizar la venta");
      }
    },
    // Método para imprimir la venta
    // Método para imprimir la venta
    imprimirVenta() {
      // Crear el contenido HTML de los tickets
      let content = "";
      for (const product of this.productosTicket) {
        for (let i = 0; i < product.quantity; i++) {
          content += `
          <div style="text-align: center;">
                    <img src="https://i.postimg.cc/SQgdP9ds/image.png" width="80" height="80" style="display: block; margin: auto;">
                </div>
        <b style="display: block; text-align: center;">${product.name}</b>
        <p align="center">Precio: S/.${product.price}</p>
        <p align="center">¡Gracias por su preferencia!</p>
        <hr>`; // Separador entre tickets
        }
      }

      // Crear una nueva ventana emergente con el contenido HTML de los tickets
      const popupWin = window.open("", "_blank", "width=600,height=600");
      popupWin.document.open();
      popupWin.document.write(`
    <html>
      <head>
        <title>Impresión de Tickets</title>
        <style>
          hr {
            border: none;
            border-top: 1px dashed #000;
          }
        </style>
      </head>
      <body onload="window.print(); window.close();">${content}</body>
    </html>
  `);
      popupWin.document.close();

      // Agregar un evento para ejecutar cancelSale() después de la impresión
      window.addEventListener("afterprint", () => {
        // Llamar al método para cancelar la venta y restablecer los datos
        this.productosTicket = [];
      });
      this.productosTicket = [];
    },

    cancelSale() {
      // Limpiar la lista de productos en venta
      this.productsInSale = [];

      // Restablecer la sucursal seleccionada y el producto seleccionado
      this.quantity = 1;
      this.selectedProduct = null;
      this.totalAmount = 0;
      // Desmarcar el checkbox al finalizar la venta
      this.selectedPaymentMethod = false;
    },
    async getPrimerCliente() {
      try {
        const response = await fetch(
          "https://sale-point-backend-test.onrender.com/sale/primercliente"
        ); // Cambia la URL según la ruta correcta para obtener el primer cliente
        if (!response.ok) {
          throw new Error("Error al obtener el primer cliente");
        }
        const primerCliente = await response.json();
        this.clienteNombre = primerCliente.name; // Actualiza el nombre del cliente
        this.clienteDocumento = primerCliente.document; // Actualiza el documento del cliente
        this.clienteID = primerCliente.id; // Actualiza el documento del cliente
      } catch (error) {
        console.error("Error al obtener el primer cliente:", error);
        alert("Error al obtener el primer cliente");
      }
    },
    // Método para obtener todos los productos
    async getProducts() {
      try {
        if (!this.selectedBranch) {
          // Si no se ha seleccionado una sucursal, no hacemos nada
          return;
        }

        const response = await fetch(
          "https://sale-point-backend-test.onrender.com/product/allproducts"
        );
        if (!response.ok) {
          throw new Error("Error al obtener productos");
        }
        const productsWithDetails = await response.json();

        // Filtrar productos por la sucursal seleccionada
        const productsInBranch = productsWithDetails.filter(
          (product) => product.branch_id === this.selectedBranch
        );

        // Separar productos activos y desactivados
        const activeProducts = productsInBranch.filter(
          (product) => product.state === "active"
        );

        // Actualizar la lista de productos en el componente
        this.products = activeProducts;
      } catch (error) {
        console.error("Error al obtener productos:", error);
        alert("Error al obtener productos");
      }
    },
    onSelectBranch() {
      if (this.selectedBranch) {
        this.cancelSale();
        this.getProducts();
        console.log("brnach :" + this.selectedBranch);
      }
    },
    addProductToSale() {
      // Verificar si se ha seleccionado un producto
      if (!this.selectedProduct) {
        alert("Por favor, seleccione un producto.");
        return;
      }

      // Verificar si la cantidad es válida
      if (this.quantity <= 0) {
        alert("La cantidad debe ser mayor que cero.");
        return;
      }

      // Calcular el subtotal
      const subtotal = this.quantity * this.selectedProduct.price;

      // Agregar el producto a la lista de productos en venta
      this.productsInSale.push({
        product_id: this.selectedProduct.id, // Agregar el product_id
        name: this.selectedProduct.name,
        code: this.selectedProduct.code,
        quantity: this.quantity,
        price: this.selectedProduct.price,
        subtotal: subtotal,
      });

      // Actualizar el total de la venta
      this.totalAmount += subtotal;
      console.log("codigo de producto: " + this.selectedProduct.id);
    },
    removeProduct(index) {
      // Obtener el subtotal del producto que se eliminará
      const removedSubtotal = this.productsInSale[index].subtotal;

      // Eliminar el producto de la lista de productos en venta
      this.productsInSale.splice(index, 1);

      // Restar el subtotal del total existente
      this.totalAmount -= removedSubtotal;
    },
    async getNextDocumentNumber() {
      try {
        const response = await fetch(
          "https://sale-point-backend-test.onrender.com/sale/last-document-number"
        );
        if (response.ok) {
          const data = await response.json();
          const nextDocumentNumber = data.document_number.padStart(9, "0");
          document.getElementById("numBoleta").textContent = nextDocumentNumber;
        } else {
          console.error("Error al obtener el próximo número de boleta");
        }
      } catch (error) {
        console.error("Error al obtener el próximo número de boleta:", error);
      }
    },
    async getBranches() {
      try {
        const response = await fetch(
          "https://sale-point-backend-test.onrender.com/branch/allbranches"
        );
        if (!response.ok) {
          throw new Error("Error al obtener sucursales");
        }
        const allBranches = await response.json();
        // Filtrar las sucursales con estado activo
        this.branches = allBranches.filter(
          (branch) => branch.state === "active"
        );
      } catch (error) {
        console.error("Error al obtener sucursales:", error);
        alert("Error al obtener sucursales");
      }
    },
  },
};
</script>

<style scoped src="./SaleView.css"></style>
