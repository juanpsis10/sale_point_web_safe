<template>
  <div class="principal-page">
    <div class="background-image"></div>
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="validateUser">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            autocomplete="current-password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async validateUser() {
      try {
        const response = await fetch("http://localhost:3000/validate-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        if (response.ok) {
          const userData = await response.json();
          const { username, role, id } = userData; // Suponiendo que el servidor devuelve el nombre de usuario y el rol del usuario

          localStorage.setItem("loggedInUsername", username);
          localStorage.setItem("loggedInUserRole", role); // Guardar el rol del usuario en localStorage
          localStorage.setItem("loggedInUserID", id);

          console.log("Usuario logeado:", username);
          console.log("Rol del usuario:", role);
          console.log("Id del usuario:", id);

          this.$emit("login-success"); // Emitir evento de inicio de sesión exitoso
          alert("Correcto: Usuario y contraseña válidos");
        } else {
          alert("Incorrecto: Usuario o contraseña incorrectos");
        }
      } catch (error) {
        console.error("Error al validar usuario:", error);
        alert("Error al validar usuario");
      }
    },
  },
};
</script>

<style scoped src="./LoginView.css"></style>
