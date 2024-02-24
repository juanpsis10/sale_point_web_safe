<template>
  <div class="user-view">
    <!-- Formulario para agregar un nuevo usuario -->
    <div class="add-user-form">
      <h2>Agregar Nuevo Usuario</h2>
      <form @submit.prevent="addUser">
        <div class="form-group">
          <label for="username">Nombre de Usuario:</label>
          <input
            type="text"
            id="username"
            v-model="newUser.username"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            v-model="newUser.password"
            required
          />
        </div>
        <div class="form-group">
          <label for="role">Rol:</label>
          <select id="role" v-model="newUser.role" required>
            <option value="admin">Admin</option>
            <option value="employee">Empleado</option>
          </select>
        </div>
        <div class="form-group">
          <button type="submit">Agregar Usuario</button>
        </div>
      </form>
    </div>

    <!-- Lista de usuarios existentes -->
    <div class="existing-users">
      <h2>Usuarios Existentes</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre de Usuario</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.username }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button
                v-if="user.state === 'active'"
                @click="editUser(user)"
                class="custom-button edit-button"
              >
                Editar
              </button>

              <button
                v-if="user.state === 'active'"
                @click="deactivateUser(user)"
                class="custom-button deactivate-button"
              >
                Desactivar
              </button>

              <button
                v-if="user.state === 'disable'"
                @click="activateUser(user)"
                class="custom-button activate-button"
              >
                Activar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cuadro para editar un usuario -->
    <div class="edit-user" v-if="editingUser">
      <h2>Editar Usuario</h2>
      <form @submit.prevent="updateUser">
        <div class="form-group">
          <label for="editUsername">Nombre de Usuario:</label>
          <input
            type="text"
            id="editUsername"
            v-model="editingUser.username"
            required
          />
        </div>
        <div class="form-group">
          <label for="editRole">Rol:</label>
          <select id="editRole" v-model="editingUser.role" required>
            <option value="admin">Admin</option>
            <option value="employee">Empleado</option>
          </select>
        </div>
        <div class="form-group">
          <label for="newPassword">Nueva Contraseña:</label>
          <input type="password" id="newPassword" v-model="newPassword" />
        </div>
        <div class="form-group">
          <button type="submit">Guardar Cambios</button>
          <button @click="cancelEdit" class="custom-button cancel-button">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserView",
  data() {
    return {
      users: [], // Array para almacenar los usuarios existentes
      newUser: { username: "", password: "", role: "employee" },
      editingUser: null, // Objeto para editar un usuario
      newPassword: "", // Nueva contraseña al editar usuario
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    // Método para agregar un nuevo usuario
    async addUser() {
      try {
        // Realizar la solicitud POST para agregar un nuevo usuario
        const response = await fetch("http://localhost:3000/user/adduser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.newUser),
        });

        if (response.ok) {
          const newUser = await response.json();
          // Agregar el nuevo usuario a la lista de usuarios
          this.users.push(newUser);
          // Limpiar el formulario
          this.newUser = { username: "", password: "", role: "employee" };
          alert("Usuario agregado correctamente");
          this.getUsers();
        } else {
          alert("Error al agregar usuario");
        }
      } catch (error) {
        console.error("Error al agregar usuario:", error);
        alert("Error al agregar usuario");
      }
    },
    async getUsers() {
      try {
        const response = await fetch("http://localhost:3000/user/allusers");
        if (!response.ok) {
          throw new Error("Error al obtener usuarios");
        }
        const allUsers = await response.json();
        const activeUsers = allUsers.filter((user) => user.state === "active");
        const disableUsers = allUsers.filter(
          (user) => user.state === "disable"
        );
        this.users = [...activeUsers, ...disableUsers];
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        // Manejar el error según tus necesidades
      }
    },

    // Método para activar un usuario
    async activateUser(user) {
      try {
        const response = await fetch(
          `http://localhost:3000/user/${user.id}/activate`,
          {
            method: "PUT",
          }
        );
        if (response.ok) {
          user.state = "active";
          alert("Usuario activado correctamente");
          this.getUsers();
        } else {
          alert("Error al activar usuario");
        }
      } catch (error) {
        console.error("Error al activar usuario:", error);
        alert("Error al activar usuario");
      }
    },
    // Método para desactivar un usuario
    async deactivateUser(user) {
      try {
        const response = await fetch(
          `http://localhost:3000/user/${user.id}/disable`,
          {
            method: "PUT",
          }
        );
        if (response.ok) {
          user.state = "disable";
          alert("Usuario desactivado correctamente");
          this.getUsers();
        } else {
          alert("Error al desactivar usuario");
        }
      } catch (error) {
        console.error("Error al desactivar usuario:", error);
        alert("Error al desactivar usuario");
      }
    },
    // Método para editar un usuario
    editUser(user) {
      this.editingUser = { ...user };
    },
    // Método para guardar los cambios al editar un usuario
    async updateUser() {
      try {
        const { id, username, role } = this.editingUser;
        const data = { username, role };
        if (this.newPassword) {
          data.password = this.newPassword;
        }
        const response = await fetch(`http://localhost:3000/user/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          const updatedUser = await response.json();
          // Actualizar la lista de usuarios
          const index = this.users.findIndex((u) => u.id === updatedUser.id);
          if (index !== -1) {
            this.users.splice(index, 1, updatedUser);
          }
          this.editingUser = null;
          this.newPassword = "";
          alert("Usuario actualizado correctamente");
          this.getUsers();
        } else {
          alert("Error al actualizar usuario");
        }
      } catch (error) {
        console.error("Error al actualizar usuario:", error);
        alert("Error al actualizar usuario");
      }
    },
    // Método para cancelar la edición de un usuario
    cancelEdit() {
      this.editingUser = null;
      this.newPassword = "";
    },
  },
};
</script>

<style scoped src="./UserView.css"></style>
