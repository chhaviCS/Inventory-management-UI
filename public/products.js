const productsDiv = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
let allProducts = [];

async function loadProducts() {
    const res = await fetch("/products");
    allProducts = await res.json();
    updateDashboard(allProducts);
    renderProducts(allProducts);
}

function updateDashboard(products) {
    const totalCount = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const lowStockCount = products.filter(p => p.quantity < 5).length;
    const mostExpensive = products.length > 0 ? Math.max(...products.map(p => p.price)) : 0;

    document.getElementById("totalProducts").textContent = totalCount;
    document.getElementById("totalValue").textContent = `$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById("lowStock").textContent = lowStockCount;
    document.getElementById("topPrice").textContent = `$${mostExpensive.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

function renderProducts(products) {
    productsDiv.innerHTML = "";
    
    if (products.length === 0) {
        productsDiv.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No products found matching your search.</p>';
        return;
    }

    products.forEach(p => {
        const isLowStock = p.quantity < 5;
        const statusClass = isLowStock ? 'status-low' : 'status-healthy';
        const statusText = isLowStock ? 'Low Stock' : 'In Stock';

        productsDiv.innerHTML += `
            <div class="card">
                <img src="${p.image}" alt="${p.name}" class="card-img" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'"/>
                <div class="card-content">
                    <h3>${p.name}</h3>
                    <p class="price">$${p.price.toFixed(2)}</p>
                    <p class="qty">
                        ${p.quantity} units
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </p>
                </div>
                <div class="card-actions">
                    <button class="btn btn-edit" onclick="editProduct('${p._id}')">Edit</button>
                    <button class="btn btn-delete" onclick="deleteProduct('${p._id}')">Delete</button>
                </div>
            </div>
        `;
    });
    
    // Re-initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }
}

searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
});

// Modal Elements
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");

async function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/delete/${id}`, { method: "DELETE" });
    loadProducts();
}

function openEditModal(product) {
    document.getElementById("editId").value = product._id;
    document.getElementById("editName").value = product.name;
    document.getElementById("editPrice").value = product.price;
    document.getElementById("editQuantity").value = product.quantity;
    
    editModal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling
}

function closeEditModal() {
    editModal.classList.remove("active");
    document.body.style.overflow = "auto";
}

closeModal.onclick = closeEditModal;
cancelBtn.onclick = closeEditModal;
window.onclick = (e) => {
    if (e.target === editModal) closeEditModal();
};

async function editProduct(id) {
    const product = allProducts.find(p => p._id === id);
    if (product) {
        openEditModal(product);
    }
}

editForm.onsubmit = async (e) => {
    e.preventDefault();
    
    const id = document.getElementById("editId").value;
    const name = document.getElementById("editName").value;
    const price = Number(document.getElementById("editPrice").value);
    const quantity = Number(document.getElementById("editQuantity").value);

    await fetch(`/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, quantity })
    });

    closeEditModal();
    loadProducts();
};

loadProducts();
