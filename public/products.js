const productsDiv = document.getElementById("products");

async function loadProducts() {
    const res = await fetch("/products");
    const data = await res.json();

    productsDiv.innerHTML = "";

    data.forEach(p => {
        productsDiv.innerHTML += `
            <div class="card">
                <img src="${p.image}" width="100"/>
                <h3>${p.name}</h3>
                <p>Price: ${p.price}</p>
                <p>Qty: ${p.quantity}</p>
                <button onclick="deleteProduct('${p._id}')">Delete</button>
                <button onclick="editProduct('${p._id}')">Edit</button>
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
