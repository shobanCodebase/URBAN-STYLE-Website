// Cart functionality
let cartItems = [];

// Load cart items from localStorage when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartDisplay();
});

// Function to load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
    }
}

// Function to save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Add to cart function
function addToCart(productId, name, price, image) {
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            id: productId,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
}

// Remove from cart function
function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
}

// Update quantity function
function updateQuantity(productId, newQuantity) {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        if (newQuantity > 0) {
            item.quantity = parseInt(newQuantity);
        } else {
            removeFromCart(productId);
        }
        saveCart();
        updateCartDisplay();
    }
}

// Calculate subtotal for an item
function calculateItemSubtotal(item) {
    return item.price * item.quantity;
}

// Calculate cart total
function calculateTotal() {
    return cartItems.reduce((total, item) => total + calculateItemSubtotal(item), 0);
}

// Calculate shipping
function calculateShipping(total) {
    // Free shipping for orders over ₹1000
    return total >= 1000 ? 0 : 100;
}

// Update cart display
function updateCartDisplay() {
    const tableBody = document.querySelector('#cart table tbody');
    const subtotalElement = document.querySelector('#subtotal table');
    
    if (!tableBody || !subtotalElement) return;

    // Clear existing rows
    tableBody.innerHTML = '';

    // Add items to table
    cartItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#" onclick="removeFromCart('${item.id}'); return false;">
                <i class="far fa-times-circle"></i>
            </a></td>
            <td><img src="${item.image}" alt="${item.name}"></td>
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>
                <input type="number" value="${item.quantity}" 
                onchange="updateQuantity('${item.id}', this.value)">
            </td>
            <td>₹${calculateItemSubtotal(item)}</td>
        `;
        tableBody.appendChild(row);
    });

    // Calculate totals
    const subtotal = calculateTotal();
    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping;

    // Update totals display
    subtotalElement.innerHTML = `
        <tr>
            <td>Cart subtotal</td>
            <td>₹${subtotal}</td>
        </tr>
        <tr>
            <td>Shipping</td>
            <td>${shipping === 0 ? 'Free' : '₹' + shipping}</td>
        </tr>
        <tr>
            <td><strong>Total</strong></td>
            <td><strong>₹${total}</strong></td>
        </tr>
    `;
}

// Apply coupon function
function applyCoupon() {
    const couponInput = document.querySelector('#coupon input');
    const couponCode = couponInput.value.trim().toUpperCase();
    
    // Example coupon codes
    const validCoupons = {
        'FIRST10': 0.10,  // 10% off
        'SPECIAL20': 0.20 // 20% off
    };

    const subtotal = calculateTotal();

    if (validCoupons.hasOwnProperty(couponCode)) {
        const discountPercentage = validCoupons[couponCode];
        const discount = subtotal * discountPercentage;
        const totalAfterDiscount = subtotal - discount;

        // Modify updateCartDisplay to handle coupon discount
        function updateCartDisplayWithCoupon() {
            const tableBody = document.querySelector('#cart table tbody');
            const subtotalElement = document.querySelector('#subtotal table');
            
            if (!tableBody || !subtotalElement) return;

            // Clear existing rows
            tableBody.innerHTML = '';

            // Add items to table
            cartItems.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><a href="#" onclick="removeFromCart('${item.id}'); return false;">
                        <i class="far fa-times-circle"></i>
                    </a></td>
                    <td><img src="${item.image}" alt="${item.name}"></td>
                    <td>${item.name}</td>
                    <td>₹${item.price}</td>
                    <td>
                        <input type="number" value="${item.quantity}" 
                        onchange="updateQuantity('${item.id}', this.value)">
                    </td>
                    <td>₹${calculateItemSubtotal(item)}</td>
                `;
                tableBody.appendChild(row);
            });

            // Calculate totals
            const shipping = calculateShipping(subtotal);
            const total = totalAfterDiscount + shipping;

            // Update totals display with discount information
            subtotalElement.innerHTML = `
                <tr>
                    <td>Cart subtotal</td>
                    <td>₹${subtotal}</td>
                </tr>
                <tr>
                    <td>Discount (${discountPercentage * 100}%)</td>
                    <td>-₹${discount.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Subtotal after discount</td>
                    <td>₹${totalAfterDiscount.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Shipping</td>
                    <td>${shipping === 0 ? 'Free' : '₹' + shipping}</td>
                </tr>
                <tr>
                    <td><strong>Total</strong></td>
                    <td><strong>₹${total.toFixed(2)}</strong></td>
                </tr>
            `;
        }

        // Replace the original updateCartDisplay with our new version
        updateCartDisplay = updateCartDisplayWithCoupon;

        alert(`Coupon applied! You saved ₹${discount.toFixed(2)}`);
        updateCartDisplay();
    } else {
        alert('Invalid coupon code');
    }
}

// Add event listener for coupon button
document.querySelector('#coupon button')?.addEventListener('click', applyCoupon);

// Add event listener for checkout button
document.querySelector('#subtotal button')?.addEventListener('click', () => {
    if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    // Add your checkout logic here
    alert('Proceeding to checkout...');
});