<template>
  <div class="branch-view">
    <!-- Formulario para agregar una nueva sucursal -->
    <div class="add-branch-form">
      <h2>Agregar Nueva Sucursal</h2>
      <form @submit.prevent="addBranch">
        <div class="form-group">
          <label for="branchName">Nombre de la Sucursal:</label>
          <input
            type="text"
            id="branchName"
            v-model="newBranch.name"
            required
          />
        </div>
        <div class="form-group">
          <label for="branchLocation">Ubicación:</label>
          <input
            type="text"
            id="branchLocation"
            v-model="newBranch.location"
            required
          />
        </div>
        <div class="form-group">
          <label for="branchManager">Encargado:</label>
          <input type="text" id="branchManager" v-model="newBranch.manager" />
        </div>
        <div class="form-group">
          <label for="branchPhone">Celular:</label>
          <input type="text" id="branchPhone" v-model="newBranch.phone" />
        </div>
        <div class="form-group">
          <button type="submit">Agregar Sucursal</button>
        </div>
      </form>
    </div>

    <!-- Lista de sucursales existentes -->
    <div class="existing-branches">
      <h2>Sucursales Existenes</h2>
      <!-- Lista de sucursales existentes -->
      <table class="branch-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Encargado</th>
            <th>Celular</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="branch in branches" :key="branch.id">
            <td>{{ branch.name }}</td>
            <td>{{ branch.location }}</td>
            <td>{{ branch.manager }}</td>
            <td>{{ branch.phone }}</td>
            <td>
              <!-- Mostrar solo si la sucursal está activa -->
              <button
                v-if="branch.state === 'active'"
                @click="editBranch(branch)"
              >
                Editar
              </button>
              <!-- Mostrar solo si la sucursal está activa -->
              <button
                v-if="branch.state === 'active'"
                @click="disableBranch(branch)"
              >
                Desactivar
              </button>
              <!-- Mostrar solo si la sucursal está desactivada -->
              <button
                v-if="branch.state === 'disabled'"
                @click="activateBranch(branch)"
              >
                Activar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cuadro para editar una sucursal -->
    <div class="edit-branch" v-if="editingBranch">
      <h2>Editar Sucursal</h2>
      <form @submit.prevent="updateBranch">
        <div class="form-group">
          <label for="editBranchName">Nombre de la Sucursal:</label>
          <input
            type="text"
            id="editBranchName"
            v-model="editingBranch.name"
            required
          />
        </div>
        <div class="form-group">
          <label for="editBranchLocation">Ubicación:</label>
          <input
            type="text"
            id="editBranchLocation"
            v-model="editingBranch.location"
            required
          />
        </div>
        <div class="form-group">
          <label for="editBranchManager">Encargado:</label>
          <input
            type="text"
            id="editBranchManager"
            v-model="editingBranch.manager"
          />
        </div>
        <div class="form-group">
          <label for="editBranchPhone">Celular:</label>
          <input
            type="text"
            id="editBranchPhone"
            v-model="editingBranch.phone"
          />
        </div>
        <div class="form-group">
          <button type="submit">Guardar Cambios</button>
          <button class="cancel-button" @click="cancelEdit">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "BranchView",
  // Otros detalles del componente...
  data() {
    return {
      branches: [], // Array para almacenar las sucursales existentes
      newBranch: { name: "", location: "", manager: "", phone: "" },
      editingBranch: null, // Objeto para editar una sucursal
    };
  },
  created() {
    this.getBranches();
  },
  methods: {
    // Método para agregar una nueva sucursal
    async addBranch() {
      try {
        const response = await fetch("http://localhost:3000/branch/addbranch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.newBranch),
        });

        if (response.ok) {
          const newBranchData = await response.json();

          console.log("Sucursal agregada:", newBranchData);

          // Actualizar la lista de sucursales con la sucursal recién agregada
          this.branches.push(newBranchData);

          // Limpiar el formulario
          this.newBranch = { name: "", location: "", manager: "", phone: "" };

          alert("Correcto: Sucursal agregada correctamente");
        } else {
          alert("Error: No se pudo agregar la sucursal");
        }
      } catch (error) {
        console.error("Error al agregar la sucursal:", error);
        alert("Error al agregar la sucursal");
      }
    },
    //selecionar todas
    async getBranches() {
      try {
        const response = await fetch(
          "http://localhost:3000/branch/allbranches"
        );
        if (!response.ok) {
          throw new Error("Error al obtener las sucursales");
        }
        const data = await response.json();
        // Separar las sucursales activas y desactivadas
        const activeBranches = data.filter(
          (branch) => branch.state === "active"
        );
        const disabledBranches = data.filter(
          (branch) => branch.state === "disabled"
        );
        // Poner las sucursales desactivadas al final de la lista
        this.branches = [...activeBranches, ...disabledBranches];
      } catch (error) {
        console.error("Error al obtener las sucursales:", error);
        // Maneja el error de acuerdo a tus necesidades
      }
    },

    // Método para editar una sucursal
    editBranch(branch) {
      // Al hacer clic en el botón de editar, establecemos la sucursal seleccionada en el objeto editingBranch
      this.editingBranch = { ...branch };
    },
    // Método para guardar los cambios al editar una sucursal
    async updateBranch() {
      try {
        const { id, name, location, manager, phone } = this.editingBranch;
        const response = await fetch(`http://localhost:3000/branch/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, location, manager, phone }),
        });

        if (response.ok) {
          const updatedBranchData = await response.json();

          console.log("Sucursal actualizada:", updatedBranchData);
          // Limpiar el objeto de edición
          this.editingBranch = null;

          // Actualizar la lista de sucursales llamando al método getBranches
          this.getBranches();

          alert("Correcto: Sucursal actualizada correctamente");
        } else {
          alert("Error: No se pudo actualizar la sucursal");
        }
      } catch (error) {
        console.error("Error al actualizar la sucursal:", error);
        alert("Error al actualizar la sucursal");
      }
    },
    // Método para cancelar la edición de una sucursal
    cancelEdit() {
      // Limpiar el objeto de edición
      this.editingBranch = null;
    },
    // Método para eliminar una sucursal
    // Método para desactivar un branch
    async disableBranch(branch) {
      try {
        const response = await fetch(
          `http://localhost:3000/branch/${branch.id}/disable`,
          {
            method: "PUT",
          }
        );

        if (response.ok) {
          console.log("Branch desactivado correctamente");
          // Actualizar la lista de sucursales llamando al método getBranches
          this.getBranches();
          alert("Correcto: Sucursal desactivada correctamente");
        } else {
          alert("Error: No se pudo desactivar la sucursal");
        }
      } catch (error) {
        console.error("Error al desactivar la sucursal:", error);
        alert("Error al desactivar la sucursal");
      }
    },
    // Método para activar una sucursal
    // Método para activar una sucursal desactivada
    async activateBranch(branch) {
      try {
        const response = await fetch(
          `http://localhost:3000/branch/${branch.id}/activate`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          // Actualizar el estado de la sucursal en la lista local
          branch.state = "active";
          alert("Correcto: Sucursal activada correctamente");
        } else {
          alert("Error: No se pudo activar la sucursal");
        }
      } catch (error) {
        console.error("Error al activar la sucursal:", error);
        alert("Error al activar la sucursal");
      }
    },
  },
};
</script>

<style scoped src="./BranchView.css"></style>
