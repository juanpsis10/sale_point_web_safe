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
    };
  },
  methods: {
    handleLoginSuccess() {
      // Manejar el éxito del inicio de sesión
      this.loggedIn = true;
    },
    handleLogout() {
      // Manejar el cierre de sesión
      this.loggedIn = false;
    },
  },
};
</script>

<style></style>
