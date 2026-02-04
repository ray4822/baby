let cart = [];
let currentSlide = 0;
let autoSlideInterval;

// Live Products
function listenToProducts() {
    db.collection("products").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        document.getElementById('product-list').innerHTML = products.map(p => `
            <div class="product-card">
                <img src="${p.image}">
                <h4>${p.name}</h4>
                <p>${p.price} DT</p>
                <button class="btn-add" onclick="addToCart('${p.name}', '${p.price}')">Ajouter</button>
            </div>`).join('');
    });
}

// Slider
function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => moveSlide(1), 3000);
}
window.moveSlide = (n) => {
    const slides = document.querySelectorAll('.slide');
    currentSlide = (currentSlide + n + slides.length) % slides.length;
    document.getElementById('main-slider').style.transform = `translateX(-${currentSlide * 100}%)`;
    startAutoSlide();
}

// Panier
function addToCart(name, price) { cart.push({ name, price }); updateCart(); }
function updateCart() {
    document.getElementById('cart-count').innerText = cart.length;
    let total = 0;
    document.getElementById('cart-items').innerHTML = cart.map(item => {
        total += parseFloat(item.price);
        return `<div style="display:flex; justify-content:space-between; padding:5px; border-bottom:1px solid #eee;"><span>${item.name}</span><b>${item.price} DT</b></div>`;
    }).join('');
    document.getElementById('total-price').innerText = total;
}

// Order Logic
async function confirmOrder() {
    const name = document.getElementById('user-name').value;
    const tel = document.getElementById('user-phone').value;
    const productNames = cart.map(item => item.name).join(", ");
    if(!name || !tel) return alert("Remplissez les champs!");

    await db.collection("orders").add({
        client: name, tel: tel, items: productNames,
        total: document.getElementById('total-price').innerText,
        date: new Date().toISOString()
    });
    alert("Commande envoyée! 🚀");
    cart = []; updateCart(); toggleCart(); closeOrderModal();
}

function toggleCart() { document.getElementById('cart-sidebar').classList.toggle('active'); }
function openOrderModal() { if(cart.length > 0) document.getElementById('order-modal').style.display='flex'; }
function closeOrderModal() { document.getElementById('order-modal').style.display='none'; }

listenToProducts();
startAutoSlide();










