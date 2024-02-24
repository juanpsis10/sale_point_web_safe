<template>
  <div class="client-view">
    <!-- Formulario para agregar un nuevo cliente -->
    <div class="add-client-form">
      <h2>Agregar Nuevo Cliente</h2>
      <form @submit.prevent="addClient">
        <div class="form-group">
          <label for="name">Nombre:</label>
          <input type="text" id="name" v-model="newClient.name" required />
        </div>
        <div class="form-group">
          <label for="document">Documento:</label>
          <input
            type="text"
            id="document"
            v-model="newClient.document"
            required
          />
        </div>
        <div class="form-group">
          <label for="phone">Teléfono:</label>
          <input type="text" id="phone" v-model="newClient.phone" />
        </div>
        <div class="form-group">
          <button type="submit">Agregar Cliente</button>
        </div>
      </form>
    </div>

    <!-- Lista de clientes existentes -->
    <div class="existing-clients">
      <h2>Clientes Existentes</h2>
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar cliente..."
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in filteredClients" :key="client.id">
            <td>{{ client.name }}</td>
            <td>{{ client.document }}</td>
            <td>{{ client.phone }}</td>
            <td>
              <button @click="editClient(client)" class="edit-button">
                Editar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cuadro para editar un cliente -->
    <div class="edit-client" v-if="editingClient">
      <h2>Editar Cliente</h2>
      <form @submit.prevent="updateClient">
        <div class="form-group">
          <label for="editName">Nombre:</label>
          <input
            type="text"
            id="editName"
            v-model="editingClient.name"
            required
          />
        </div>
        <div class="form-group">
          <label for="editDocument">Documento:</label>
          <input
            type="text"
            id="editDocument"
            v-model="editingClient.document"
            required
          />
        </div>
        <div class="form-group">
          <label for="editPhone">Teléfono:</label>
          <input type="text" id="editPhone" v-model="editingClient.phone" />
        </div>
        <div class="form-group">
          <button type="submit">Guardar Cambios</button>
          <button @click="cancelEdit" class="cancel-button">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClientView",
  data() {
    return {
      clients: [], // Array para almacenar los clientes existentes
      newClient: { name: "", document: "", phone: "" },
      editingClient: null, // Objeto para editar un cliente
      searchQuery: "", // Consulta de búsqueda
    };
  },
  created() {
    this.getClients();
  },
  computed: {
    filteredClients() {
      if (this.searchQuery === "") {
        return [];
      } else {
        return this.clients.filter(
          (client) =>
            client.name
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()) ||
            client.document.includes(this.searchQuery)
        );
      }
    },
  },

  methods: {
    // Método para agregar un nuevo cliente
    async addClient() {
      try {
        const response = await fetch("http://localhost:3000/client/addclient", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.newClient),
        });

        if (response.ok) {
          const newClient = await response.json();
          this.clients.push(newClient);
          this.newClient = { name: "", document: "", phone: "" };
          alert("Cliente agregado correctamente");
          this.getClients();
        } else {
          alert("Error al agregar cliente");
        }
      } catch (error) {
        console.error("Error al agregar cliente:", error);
        alert("Error al agregar cliente");
      }
    },
    // Método para obtener todos los clientes
    async getClients() {
      try {
        const response = await fetch("http://localhost:3000/client/allclients");
        if (!response.ok) {
          throw new Error("Error al obtener clientes");
        }
        this.clients = await response.json();
      } catch (error) {
        console.error("Error al obtener clientes:", error);
        alert("Error al obtener clientes");
      }
    },
    // Método para editar un cliente
    editClient(client) {
      this.editingClient = { ...client };
    },
    // Método para guardar los cambios al editar un cliente
    async updateClient() {
      try {
        const { id, name, document, phone } = this.editingClient;
        const data = { name, document, phone };
        const response = await fetch(`http://localhost:3000/client/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          const updatedClient = await response.json();
          const index = this.clients.findIndex(
            (c) => c.id === updatedClient.id
          );
          if (index !== -1) {
            this.clients.splice(index, 1, updatedClient);
          }
          this.editingClient = null;
          alert("Cliente actualizado correctamente");
          this.getClients();
        } else {
          alert("Error al actualizar cliente");
        }
      } catch (error) {
        console.error("Error al actualizar cliente:", error);
        alert("Error al actualizar cliente");
      }
    },
    // Método para cancelar la edición de un cliente
    cancelEdit() {
      this.editingClient = null;
    },
  },
};
</script>

<style scoped src="./ClientView.css"></style>
