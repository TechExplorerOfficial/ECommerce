document.addEventListener('DOMContentLoaded', () => {
    const cartItems = [];
    const cartItemsElement = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', event => {
            const productElement = event.target.closest('.product');
            const product = {
                id: productElement.getAttribute('data-id'),
                name: productElement.getAttribute('data-name'),
                price: parseFloat(productElement.getAttribute('data-price'))
            };
            addToCart(product);
        });
    });

    function addToCart(product) {
        cartItems.push(product);
        renderCart();
    }

    function renderCart() {
        cartItemsElement.innerHTML = '';
        let total = 0;

        cartItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - R$${item.price.toFixed(2)}`;
            cartItemsElement.appendChild(li);
            total += item.price;
        });

        totalPriceElement.textContent = total.toFixed(2);
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const cartItems = [];
    const cartItemsElement = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-button');
    const paymentFormElement = document.getElementById('payment-form');
    const paymentMessageElement = document.getElementById('payment-message');

    // Stripe
    const stripe = Stripe('sua_chave_publica_aqui');
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', event => {
            const productElement = event.target.closest('.product');
            const product = {
                id: productElement.getAttribute('data-id'),
                name: productElement.getAttribute('data-name'),
                price: parseFloat(productElement.getAttribute('data-price'))
            };
            addToCart(product);
        });
    });

    checkoutButton.addEventListener('click', async () => {
        const total = calculateTotal();
        const response = await fetch('http://localhost:3000/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: total })
        });

        const { clientSecret } = await response.json();

        paymentFormElement.style.display = 'block';

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement
            }
        });

        if (error) {
            paymentMessageElement.textContent = `Erro: ${error.message}`;
        } else if (paymentIntent.status === 'succeeded') {
            paymentMessageElement.textContent = 'Pagamento realizado com sucesso!';
            clearCart();
        }
    });

    function addToCart(product) {
        cartItems.push(product);
        renderCart();
    }

    function renderCart() {
        cartItemsElement.innerHTML = '';
        let total = 0;

        cartItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - R$${item.price.toFixed(2)}`;
            cartItemsElement.appendChild(li);
            total += item.price;
        });

        totalPriceElement.textContent = total.toFixed(2);
    }

    function calculateTotal() {
        return cartItems.reduce((total, item) => total + item.price, 0);
    }

    function clearCart() {
        cartItems.length = 0;
        renderCart();
        paymentFormElement.style.display = 'none';
    }
});