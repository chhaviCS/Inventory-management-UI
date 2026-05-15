const productsDiv = document.getElementById("products");

async function loadProducts() {
    const res = await fetch("/products");
    const data = await res.json();

    productsDiv.innerHTML = "";

    data.forEach(p => {
        productsDiv.innerHTML += `
            <div class="card">
                <img src="${p.image}" alt="${p.name}" class="card-img" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'"/>
                <div class="card-content">
                    <h3>${p.name}</h3>
                    <p class="price">$${p.price.toFixed(2)}</p>
                    <p class="qty">${p.quantity} in stock</p>
                </div>
                <div class="card-actions">
                    <button class="btn btn-edit" onclick="editProduct('${p._id}')">Edit</button>
                    <button class="btn btn-delete" onclick="deleteProduct('${p._id}')">Delete</button>
                </div>
            </div>
        `;
    });
}

async function deleteProduct(id) {
    await fetch(`/delete/${id}`, { method: "DELETE" });
    loadProducts();
}

async function editProduct(id) {
    const res = await fetch("/products");
    const data = await res.json();

    const product = data.find(p => p._id === id);

    const name = prompt("Edit Name", product.name);
    const price = prompt("Edit Price", product.price);
    const quantity = prompt("Edit Quantity", product.quantity);

    if (name === null || price === null || quantity === null) return;

    await fetch(`/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name,
            price: Number(price),
            quantity: Number(quantity)
        })
    });

    loadProducts();
}

loadProducts();
