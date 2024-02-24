<template>
  <div class="product-view">
    <!-- Formulario para agregar un nuevo producto -->
    <div class="add-product-form">
      <h2>Agregar Nuevo Producto</h2>
      <form @submit.prevent="addProduct">
        <div class="form-group">
          <label for="productName">Nombre:</label>
          <input
            type="text"
            id="productName"
            v-model="newProduct.name"
            required
          />
        </div>
        <div class="form-group">
          <label for="productDescription">Descripción:</label>
          <input
            type="text"
            id="productDescription"
            v-model="newProduct.description"
          />
        </div>
        <div class="form-group">
          <label for="productPrice">Precio:</label>
          <input
            type="number"
            step="0.01"
            id="productPrice"
            v-model="newProduct.price"
            required
          />
        </div>
        <div class="form-group">
          <label for="productCode">Código:</label>
          <input
            type="text"
            id="productCode"
            v-model="newProduct.code"
            required
          />
        </div>
        <div class="form-group">
          <label for="productBranch">Sucursal:</label>
          <select id="productBranch" v-model="newProduct.branchId" required>
            <option
              v-for="branch in branches"
              :key="branch.id"
              :value="branch.id"
            >
              {{ branch.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <button type="submit">Agregar Producto</button>
        </div>
      </form>
    </div>

    <!-- Lista de productos existentes -->
    <div class="existing-products">
      <h2>Productos Existentes</h2>
      <table class="product-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Código</th>
            <th>Sucursal</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ product.description }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.code }}</td>
            <td>{{ product.branch_name }}</td>
            <td>{{ product.stock_quantity }}</td>
            <td>
              <button
                v-if="product.state === 'active'"
                @click="editProduct(product)"
              >
                Editar
              </button>
              <button
                v-if="product.state === 'active'"
                @click="disableProduct(product)"
              >
                Desactivar
              </button>
              <button
                v-if="product.state === 'disable'"
                @click="activeProduct(product)"
              >
                Activar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cuadro para editar un producto -->
    <div class="edit-product" v-if="editingProduct">
      <h2>Editar Producto</h2>
      <form @submit.prevent="updateProduct">
        <div class="form-group">
          <label for="editProductName">Nombre:</label>
          <input
            type="text"
            id="editProductName"
            v-model="editingProduct.name"
            required
          />
        </div>
        <div class="form-group">
          <label for="editProductDescription">Descripción:</label>
          <input
            type="text"
            id="editProductDescription"
            v-model="editingProduct.description"
          />
        </div>
        <div class="form-group">
          <label for="editProductPrice">Precio:</label>
          <input
            type="number"
            step="0.01"
            id="editProductPrice"
            v-model="editingProduct.price"
            required
          />
        </div>
        <div class="form-group">
          <label for="editProductCode">Código:</label>
          <input
            type="text"
            id="editProductCode"
            v-model="editingProduct.code"
            required
          />
        </div>
        <div class="form-group">
          <label for="editProductStock">Stock:</label>
          <input
            type="number"
            id="editProductStock"
            v-model="editingProduct.stockQuantity"
            required
          />
        </div>
        <div class="form-group">
          <button type="submit" :disabled="!editingProduct">
            Guardar Cambios
          </button>

          <button @click="cancelEdit">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductView",
  data() {
    return {
      products: [], // Array para almacenar los productos existentes
      branches: [], // Array para almacenar las sucursales existentes
      newProduct: {
        name: "",
        description: "",
        price: 0,
        code: "",
        branchId: null,
      },
      editingProduct: null, // Objeto para editar un producto
    };
  },
  created() {
    this.getProducts();
    this.getBranches();
  },
  methods: {
    // Método para agregar un nuevo producto
    async addProduct() {
      try {
        const response = await fetch(
          "http://localhost:3000/product/addproduct",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.newProduct),
          }
        );

        if (response.ok) {
          const newProduct = await response.json();
          this.products.push(newProduct);
          this.newProduct = {
            name: "",
            description: "",
            price: 0,
            code: "",
            branchId: null,
          };
          alert("Producto agregado correctamente");
          this.getProducts();
        } else {
          alert("Error al agregar producto");
        }
      } catch (error) {
        console.error("Error al agregar producto:", error);
        alert("Error al agregar producto");
      }
    },
    // Método para obtener todos los productos
    async getProducts() {
      try {
        const response = await fetch(
          "http://localhost:3000/product/allproducts"
        );
        if (!response.ok) {
          throw new Error("Error al obtener productos");
        }
        const productsWithDetails = await response.json();

        // Separar productos activos y desactivados
        const activeProducts = productsWithDetails.filter(
          (product) => product.state === "active"
        );
        const disabledProducts = productsWithDetails.filter(
          (product) => product.state === "disable"
        );

        // Ordenar productos activos al principio
        const sortedProducts = [...activeProducts, ...disabledProducts];

        // Actualizar la lista de productos en el componente
        this.products = sortedProducts;
      } catch (error) {
        console.error("Error al obtener productos:", error);
        alert("Error al obtener productos");
      }
    },

    // Método para obtener todas las sucursales
    async getBranches() {
      try {
        const response = await fetch(
          "http://localhost:3000/branch/allbranches"
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

    // Método para editar un producto
    editProduct(product) {
      // Incluye el ID de la sucursal en el objeto editingProduct
      this.editingProduct = {
        ...product,
        branchId: product.branch_id, // Asigna el ID de la sucursal a branchId
      };
    },
    // Método para guardar los cambios al editar un producto
    async updateProduct() {
      try {
        const { id, name, description, code, branchId } = this.editingProduct;
        const productData = { name, description, code };

        // Llamar a la API para actualizar los datos en la tabla product
        const productResponse = await fetch(
          `http://localhost:3000/product/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
          }
        );

        if (!productResponse.ok) {
          throw new Error("Error al actualizar datos del producto");
        }

        // Llamar al método para actualizar los datos en la tabla product_branch
        const productBranchResponse = await fetch(
          `http://localhost:3000/product/${id}/branch/${branchId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              price: this.editingProduct.price,
              stockQuantity: this.editingProduct.stockQuantity,
              branchId,
            }),
          }
        );

        if (!productBranchResponse.ok) {
          console.log("Error al actualizar datos de la sucursal del producto");
        }

        // Si ambas actualizaciones tienen éxito, notificar al usuario

        alert("Producto actualizado correctamente");
        // Actualizar la lista de productos

        // Llamar al método para actualizar los datos de la sucursal del producto
        await this.updateProductBranch(id, branchId);
        this.editingProduct = null;
        this.getProducts();
      } catch (error) {
        console.error("Error al actualizar producto:", error);
        alert("Error al actualizar producto");
      }
    },

    async updateProductBranch(productId, branchId) {
      try {
        // Verifica si editingProduct es nulo
        if (!this.editingProduct) {
          console.log("No se ha seleccionado ningún producto para editar.");
        }

        // Desestructura 'price' y 'stockQuantity' solo si editingProduct no es nulo
        const { price, stockQuantity } = this.editingProduct;

        const response = await fetch(
          `http://localhost:3000/product/${productId}/branch/${branchId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ price, stockQuantity }),
          }
        );
        if (response.ok) {
          alert("Datos de la sucursal del producto actualizados correctamente");
        } else {
          console.log("Error al actualizar datos de la sucursal del producto");
        }
      } catch (error) {
        console.error(
          "Error al actualizar datos de la sucursal del producto:",
          error
        );
        alert("Error al actualizar datos de la sucursal del producto");
      }
    },

    // Método para cancelar la edición de un producto
    cancelEdit() {
      this.editingProduct = null;
    },
    // Método para desactivar un producto
    async disableProduct(productId) {
      try {
        const { id, branch_id } = productId;
        const response = await fetch(
          `http://localhost:3000/product/${id}/branch/${branch_id}/disable`,
          {
            method: "PUT",
          }
        );
        if (response.ok) {
          // Actualizar el estado del producto en la vista localmente
          const productIndex = this.products.findIndex(
            (product) => product.id === id
          );
          if (productIndex !== -1) {
            this.products[productIndex].state = "disable";
          }
          alert("Producto desactivado correctamente en la sucursal");
          this.getProducts();
        } else {
          throw new Error("Error al desactivar producto en la sucursal");
        }
      } catch (error) {
        console.error("Error al desactivar producto en la sucursal:", error);
        alert("Error al desactivar producto en la sucursal");
      }
    },
    async activeProduct(productId) {
      try {
        const { id, branch_id } = productId;
        const response = await fetch(
          `http://localhost:3000/product/${id}/branch/${branch_id}/activate`,
          {
            method: "PUT",
          }
        );
        if (response.ok) {
          // Actualizar el estado del producto en la vista localmente
          const productIndex = this.products.findIndex(
            (product) => product.id === id
          );
          if (productIndex !== -1) {
            this.products[productIndex].state = "active";
          }
          alert("Producto activado correctamente en la sucursal");
          this.getProducts();
        } else {
          throw new Error("Error al activar producto en la sucursal");
        }
      } catch (error) {
        console.error("Error al activar producto en la sucursal:", error);
        alert("Error al activar producto en la sucursal");
      }
    },
  },
};
</script>

<style scoped src="./ProductView.css"></style>
