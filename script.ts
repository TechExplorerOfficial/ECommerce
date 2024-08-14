interface Product {
    id: string;
    name: string;
    price: number;
}

document.addEventListener('DOMContentLoaded', () => {
    const cartItems: Product[] = [];
    const cartItemsElement = document.getElementById('cart-items') as HTMLUListElement;
    const totalPriceElement = document.getElementById('total-price') as HTMLSpanElement;

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', event => {
            const productElement = (event.target as HTMLElement).closest('.product') as HTMLElement;
            const product: Product = {
                id: productElement.getAttribute('data-id') as string,
                name: productElement.getAttribute('data-name') as string,
                price: parseFloat(productElement.getAttribute('data-price') as string)
            };
            addToCart(product);
        });
    });

    function addToCart(product: Product) {
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