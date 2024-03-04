<template>
  <div>
    <LoginView v-if="!loggedIn" @login-success="handleLoginSuccess" />
    <HomeView v-else @logout="handleLogout" />
  </div>
</template>

<script>
import LoginView from "./components/Views/LoginView.vue";
import HomeView from "./components/Views/HomeView.vue";

export default {
  name: "App",
  components: {
    LoginView,
    HomeView,
  },
  data() {
    return {
      credentials: {},
      loggedIn: false,
      intervalId: null, // ID del intervalo para hacer solicitudes periódicas
    };
  },
  methods: {
    handleLoginSuccess() {
      // Manejar el éxito del inicio de sesión
      this.loggedIn = true;
      this.startSessionKeepAlive();
    },
    handleLogout() {
      // Manejar el cierre de sesión
      this.loggedIn = false;
      this.stopSessionKeepAlive();
    },
    startSessionKeepAlive() {
      // Generar un token aleatorio
      const yourAuthToken = this.generateRandomToken();
      console.log("Tocken antes: " + yourAuthToken);
      // Iniciar el intervalo para mantener activa la sesión del usuario
      this.intervalId = setInterval(() => {
        // Hacer una solicitud al servidor para mantener activa la sesión del usuario
        fetch("https://sale-point-backend-test.onrender.com/keep-alive", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${yourAuthToken}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error al mantener activa la sesión del usuario");
            }
          })
          .catch((error) => {
            console.error(
              "Error al mantener activa la sesión del usuario:",
              error
            );
          });

        console.log(
          "Solicitud periódica al servidor para mantener activa la sesión del usuario."
        );
      }, 300000); // Hacer la solicitud cada 5 minutos (300,000 milisegundos)
    },
    stopSessionKeepAlive() {
      // Detener el intervalo cuando el usuario cierra sesión
      clearInterval(this.intervalId);
    },
    generateRandomToken() {
      // Longitud del token
      const length = 64;

      // Caracteres permitidos en el token
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      let token = "";
      for (let i = 0; i < length; i++) {
        token += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }

      return token;
    },
  },
};
</script>

<style></style>
