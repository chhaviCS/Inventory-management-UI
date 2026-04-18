const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        quantity: document.getElementById("quantity").value,
        image: document.getElementById("image").value
    };

    await fetch("/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    alert("Product Added!");
    form.reset();
});