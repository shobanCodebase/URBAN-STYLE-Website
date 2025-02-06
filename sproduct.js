// Add this to your script.js or create a separate JS file for sproduct page

function addToProductCart() {
    // Get product details
    const productName = document.getElementById('product-name').textContent;
    const productPrice = parseInt(document.getElementById('product-price').textContent.replace('₹', '').replace(',', ''));
    const productImage = document.getElementById('MainImg').src;
    const quantity = parseInt(document.getElementById('quantity-input').value);
    const size = document.getElementById('size-select').value;

    // Validate size selection
    if (size === 'Select-size') {
        alert('Please select a size');
        return;
    }

    // Create product object
    const product = {
        id: generateProductId(productName),
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: quantity,
        size: size
    };

    // Load existing cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(
        item => item.id === product.id && item.size === product.size
    );

    if (existingProductIndex > -1) {
        // Update quantity if product exists
        cart[existingProductIndex].quantity += quantity;
    } else {
        // Add new product to cart
        cart.push(product);
    }

    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show confirmation
    alert(`${quantity} ${productName} (${size}) added to cart!`);

    // Optional: Redirect to cart or update cart icon
    window.location.href = 'cart.html';
}

// Helper function to generate unique product ID
function generateProductId(name) {
    // Create a simple unique identifier based on product name
    return name.toLowerCase().replace(/\s+/g, '-');
}

// Initialize page-specific interactions
document.addEventListener('DOMContentLoaded', () => {
    // Ensure quantity input doesn't go below 1
    const quantityInput = document.getElementById('quantity-input');
    quantityInput.addEventListener('change', (e) => {
        if (e.target.value < 1) {
            e.target.value = 1;
        }
    });
});