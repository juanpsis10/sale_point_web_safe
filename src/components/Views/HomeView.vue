<template>
  <div class="home-container">
    <div class="menu">
      <ion-icon name="menu-outline"></ion-icon>
      <ion-icon name="close-outline"></ion-icon>
    </div>

    <aside class="barra-lateral">
      <div>
        <div class="nombre-pagina">
          <ion-icon id="cloud" name="cloud-outline"></ion-icon>
          <span>Happy Kids</span>
        </div>
        <button class="boton" @click="mostrarVenta">
          <ion-icon name="add-outline"></ion-icon>
          <span>Nueva Venta</span>
        </button>
      </div>

      <nav class="navegacion" :class="{ opaque: navOpacity }">
        <ul>
          <li @click="mostrarCliente">
            <a href="#">
              <ion-icon name="bag-outline"></ion-icon>
              <span>Clientes</span>
            </a>
          </li>
          <li @click="mostrarProducto">
            <a href="#">
              <ion-icon name="bag-add-outline"></ion-icon>
              <span>Productos</span>
            </a>
          </li>
          <li @click="mostrarReporte">
            <a href="#">
              <ion-icon name="newspaper-outline"></ion-icon>
              <span>Reportes</span>
            </a>
          </li>
          <li @click="mostrarEstadisticas">
            <a href="#">
              <ion-icon name="stats-chart-outline"></ion-icon>
              <span>Estadistica</span>
            </a>
          </li>
          <li @click="mostrarUsuario">
            <a href="#">
              <ion-icon name="person-outline"></ion-icon>
              <span>Usuarios</span>
            </a>
          </li>
          <li @click="mostrarBranch">
            <a href="#">
              <ion-icon name="business-outline"></ion-icon>
              <span>Sucursales</span>
            </a>
          </li>
        </ul>
      </nav>

      <div>
        <div class="linea"></div>

        <div class="modo-oscuro">
          <div class="info">
            <ion-icon name="moon-outline"></ion-icon>
            <span>Dark Mod</span>
          </div>
          <div class="switch">
            <div class="base">
              <div class="circulo"></div>
            </div>
          </div>
        </div>

        <div class="usuario">
          <div class="info-usuario">
            <div class="nombre-email">
              <span class="nombre">{{ username }}</span>
              <div class="logout-button">
                <button @click="logout">Cerrar sesión</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <!-- Agregar componente SaleView solo si la variable mostrarComponenteVenta es verdadera -->
      <SaleView
        v-if="
          mostrarComponenteVenta &&
          !mostrarComponenteCliente &&
          !mostrarComponenteBranch &&
          !mostrarComponenteProduct &&
          !mostrarComponenteReport &&
          !mostrarComponenteStadistics &&
          !mostrarComponenteUser
        "
      />

      <!-- Agregar otros componentes de acuerdo a la lógica similar -->
      <ClientView
        v-if="
          mostrarComponenteCliente &&
          !mostrarComponenteVenta &&
          !mostrarComponenteBranch &&
          !mostrarComponenteProduct &&
          !mostrarComponenteReport &&
          !mostrarComponenteStadistics &&
          !mostrarComponenteUser
        "
      />
      <BranchView
        v-if="
          mostrarComponenteBranch &&
          !mostrarComponenteVenta &&
          !mostrarComponenteCliente &&
          !mostrarComponenteProduct &&
          !mostrarComponenteReport &&
          !mostrarComponenteStadistics &&
          !mostrarComponenteUser
        "
      />
      <ProductView
        v-if="
          mostrarComponenteProduct &&
          !mostrarComponenteVenta &&
          !mostrarComponenteCliente &&
          !mostrarComponenteBranch &&
          !mostrarComponenteReport &&
          !mostrarComponenteStadistics &&
          !mostrarComponenteUser
        "
      />
      <ReportView
        v-if="
          mostrarComponenteReport &&
          !mostrarComponenteVenta &&
          !mostrarComponenteCliente &&
          !mostrarComponenteBranch &&
          !mostrarComponenteProduct &&
          !mostrarComponenteStadistics &&
          !mostrarComponenteUser
        "
      />
      <StadisticsView
        v-if="
          mostrarComponenteStadistics &&
          !mostrarComponenteVenta &&
          !mostrarComponenteCliente &&
          !mostrarComponenteBranch &&
          !mostrarComponenteProduct &&
          !mostrarComponenteReport &&
          !mostrarComponenteUser
        "
      />
      <UserView
        v-if="
          mostrarComponenteUser &&
          !mostrarComponenteVenta &&
          !mostrarComponenteCliente &&
          !mostrarComponenteBranch &&
          !mostrarComponenteProduct &&
          !mostrarComponenteReport &&
          !mostrarComponenteStadistics
        "
      />
    </main>
  </div>
</template>

<script>
import SaleView from "./SaleView.vue";
import ClientView from "./ClientView.vue";
import BranchView from "./BranchView.vue";
import ProductView from "./ProductView.vue";
import ReportView from "./ReportView.vue";
import StadisticsView from "./StadisticsView.vue";
import UserView from "./UserView.vue";

export default {
  name: "HomeView",
  components: {
    SaleView,
    ClientView,
    BranchView,
    ProductView,
    ReportView,
    StadisticsView,
    UserView,
  },
  data() {
    return {
      username: "", // Agregar una propiedad para almacenar el nombre de usuario
      userRole: "",
      navOpacity: false,
      mostrarComponenteVenta: true,
      mostrarComponenteCliente: false,
      mostrarComponenteBranch: false,
      mostrarComponenteProduct: false,
      mostrarComponenteReport: false,
      mostrarComponenteStadistics: false,
      mostrarComponenteUser: false,
    };
  },
  methods: {
    mostrarVenta() {
      this.ocultarComponentesAdicionales();
      this.mostrarComponenteVenta = true;
    },
    mostrarCliente() {
      // Obtener el rol del usuario del localStorage
      const userRole = localStorage.getItem("loggedInUserRole");

      // Verificar si el rol es "employee"
      if (userRole === "employee") {
        // Si el rol es "employee", no permitir mostrar el componente de Cliente
        console.log("No tienes permiso para acceder a la vista de Cliente.");
        return;
      }

      // Si el rol no es "employee", permitir mostrar el componente de Cliente
      this.ocultarComponentesAdicionales();
      this.mostrarComponenteCliente = true;
    },
    mostrarBranch() {
      const userRole = localStorage.getItem("loggedInUserRole");

      // Verificar si el rol es "employee"
      if (userRole === "employee") {
        // Si el rol es "employee", no permitir mostrar el componente de Cliente
        console.log("No tienes permiso para acceder a la vista de Cliente.");
        return;
      }
      this.ocultarComponentesAdicionales();
      this.mostrarComponenteBranch = true;
    },
    mostrarProducto() {
      const userRole = localStorage.getItem("loggedInUserRole");

      // Verificar si el rol es "employee"
      if (userRole === "employee") {
        // Si el rol es "employee", no permitir mostrar el componente de Cliente
        console.log("No tienes permiso para acceder a la vista de Cliente.");
        return;
      }
      this.ocultarComponentesAdicionales();
      this.mostrarComponenteProduct = true;
    },
    mostrarReporte() {
      const userRole = localStorage.getItem("loggedInUserRole");

      // Verificar si el rol es "employee"
      if (userRole === "employee") {
        // Si el rol es "employee", no permitir mostrar el componente de Cliente
        console.log("No tienes permiso para acceder a la vista de Cliente.");
        return;
      }
      this.ocultarComponentesAdicionales();
      this.mostrarComponenteReport = true;
    },
    mostrarEstadisticas() {
      const userRole = localStorage.getItem("loggedInUserRole");

      // Verificar si el rol es "employee"
      if (userRole === "employee") {
        // Si el rol es "employee", no permitir mostrar el componente de Cliente
        console.log("No tienes permiso para acceder a la vista de Cliente.");
        return;
      }
      this.ocultarComponentesAdicionales();
      this.mostrarComponenteStadistics = true;
    },
    mostrarUsuario() {
      const userRole = localStorage.getItem("loggedInUserRole");

      // Verificar si el rol es "employee"
      if (userRole === "employee") {
        // Si el rol es "employee", no permitir mostrar el componente de Cliente
        console.log("No tienes permiso para acceder a la vista de Cliente.");
        return;
      }
      this.ocultarComponentesAdicionales();
      this.mostrarComponenteUser = true;
    },
    ocultarComponentesAdicionales() {
      this.mostrarComponenteVenta = false;
      this.mostrarComponenteCliente = false;
      this.mostrarComponenteBranch = false;
      this.mostrarComponenteProduct = false;
      this.mostrarComponenteReport = false;
      this.mostrarComponenteStadistics = false;
      this.mostrarComponenteUser = false;
    },
    logout() {
      // Emitir evento de cierre de sesión
      this.$emit("logout");
    },
  },
  mounted() {
    this.username = localStorage.getItem("loggedInUsername");
    this.userRole = localStorage.getItem("loggedInUserRole"); // Obtenemos el rol del usuario del localStorage
    console.log("Usuario logeado:", this.username);
    console.log("Rol del usuario:", this.userRole);
    const userRole = localStorage.getItem("loggedInUserRole");
    if (userRole === "employee") {
      this.navOpacity = true;
    }
    // Obtenemos referencias a los elementos del DOM
    const cloud = document.getElementById("cloud");
    const barraLateral = document.querySelector(".barra-lateral");
    const spans = document.querySelectorAll("span");
    const palanca = document.querySelector(".switch");
    const circulo = document.querySelector(".circulo");
    const menu = document.querySelector(".menu");
    const main = document.querySelector("main");

    // Manejador de clic en el menú
    const handleMenuClick = () => {
      barraLateral.classList.toggle("max-barra-lateral");
      if (barraLateral.classList.contains("max-barra-lateral")) {
        menu.children[0].style.display = "none";
        menu.children[1].style.display = "block";
      } else {
        menu.children[0].style.display = "block";
        menu.children[1].style.display = "none";
      }
      if (window.innerWidth <= 320) {
        barraLateral.classList.add("mini-barra-lateral");
        main.classList.add("min-main");
        spans.forEach((span) => {
          span.classList.add("oculto");
        });
      }
    };

    // Manejador de clic en la palanca
    const handlePalancaClick = () => {
      let body = document.body;
      body.classList.toggle("dark-mode");
      circulo.classList.toggle("prendido");
    };

    // Manejador de clic en el icono de la nube
    const handleCloudClick = () => {
      barraLateral.classList.toggle("mini-barra-lateral");
      main.classList.toggle("min-main");
      spans.forEach((span) => {
        span.classList.toggle("oculto");
      });
    };

    // Agregamos los event listeners
    menu.addEventListener("click", handleMenuClick);
    palanca.addEventListener("click", handlePalancaClick);
    cloud.addEventListener("click", handleCloudClick);

    // Guardamos las funciones en el objeto para que estén disponibles en beforeUnmount
    this.handleMenuClick = handleMenuClick;
    this.handlePalancaClick = handlePalancaClick;
    this.handleCloudClick = handleCloudClick;
  },
  beforeUnmount() {
    // Removemos los event listeners al desmontar el componente
    const menu = document.querySelector(".menu");
    const palanca = document.querySelector(".switch");
    const cloud = document.getElementById("cloud");

    menu.removeEventListener("click", this.handleMenuClick);
    palanca.removeEventListener("click", this.handlePalancaClick);
    cloud.removeEventListener("click", this.handleCloudClick);
  },
};
</script>

<style scoped>
/* Aquí importamos los estilos del archivo HomeView.css */
@import "./HomeView.css";

/* Puedes agregar estilos adicionales específicos para este componente si lo necesitas */
</style>
