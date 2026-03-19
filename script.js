const products = [
    {
        id: 1,
        name: "Tai nghe Bluetooth",
        price: 350000,
        image: "https://picsum.photos/seed/mp19-tws/1200/800",
        description: "Tai nghe Bluetooth không dây, pin 8 giờ, kết nối ổn định."
    },
    {
        id: 2,
        name: "Chuột không dây",
        price: 250000,
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=60",
        description: "Chuột không dây thiết kế công thái học, DPI cao, phù hợp làm việc."
    },
    {
        id: 3,
        name: "Bàn phím cơ 87 phím",
        price: 790000,
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=60",
        description: "Switch blue, led trắng, gõ sướng tay."
    }
];

let cart = [];

const initCart = () => {
    try {
        const storedCart = localStorage.getItem('mini_shop_cart');
        cart = storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
        console.error("Lỗi parse JSON, reset giỏ hàng:", error);
        cart = [];
        saveCart();
    }
};

const saveCart = () => {
    localStorage.setItem('mini_shop_cart', JSON.stringify(cart));
    renderCart();
    updateStats();
};

const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const renderProducts = () => {
    const productsGrid = document.getElementById('products-grid');
    const productsEmpty = document.getElementById('products-empty');
    const productCountBadge = document.getElementById('product-count-badge');

    if (products.length === 0) {
        productsEmpty.classList.remove('hidden');
        productsGrid.innerHTML = '';
        return;
    }

    productsEmpty.classList.add('hidden');
    productCountBadge.innerText = `${products.length} sản phẩm`;

    productsGrid.innerHTML = products.map(product => `
        <article class="card">
            <div class="card-img">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="card-body">
                <h3 class="card-title">${product.name}</h3>
                <p class="card-desc">${product.description}</p>
                <div class="card-footer">
                    <div class="price">${formatVND(product.price)}</div>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">Thêm vào giỏ</button>
                </div>
            </div>
        </article>
    `).join('');
};

window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
};

const renderCart = () => {
    const cartTbody = document.getElementById('cart-tbody');
    const cartEmpty = document.getElementById('cart-empty');

    if (cart.length === 0) {
        cartEmpty.classList.remove('hidden');
        cartTbody.innerHTML = '';
        return;
    }

    cartEmpty.classList.add('hidden');
    cartTbody.innerHTML = cart.map(item => `
        <tr>
            <td>${item.name}</td>
            <td class="right">${formatVND(item.price)}</td>
            <td class="center">
                <button class="btn btn-icon" onclick="updateQty(${item.id}, -1)">-</button>
                <span style="margin: 0 8px">${item.quantity}</span>
                <button class="btn btn-icon" onclick="updateQty(${item.id}, 1)">+</button>
            </td>
            <td class="right">${formatVND(item.price * item.quantity)}</td>
            <td class="center">
                <button class="btn btn-danger" onclick="removeFromCart(${item.id})">Xóa</button>
            </td>
        </tr>
    `).join('');
};

const updateStats = () => {
    const totalLines = cart.length;
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    document.getElementById('cart-lines-badge').innerText = `${totalLines} dòng`;
    document.getElementById('cart-qty-badge').innerText = `${totalQty} món`;
    document.getElementById('stat-lines').innerText = totalLines;
    document.getElementById('stat-qty').innerText = totalQty;
    document.getElementById('stat-total').innerText = formatVND(totalPrice);
};

window.updateQty = (id, change) => {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
        }
    }
};

window.removeFromCart = (id) => {
    const item = cart.find(i => i.id === id);
    if (confirm(`Bạn có chắc muốn xóa "${item.name}" khỏi giỏ hàng?`)) {
        cart = cart.filter(i => i.id !== id);
        saveCart();
    }
};

document.getElementById('clear-cart-btn').onclick = () => {
    if (cart.length > 0 && confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa TOÀN BỘ giỏ hàng?")) {
        cart = [];
        saveCart();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initCart();
    renderProducts();
    renderCart();
    updateStats();
});