document.addEventListener('DOMContentLoaded', function () {

    const navbarLinks = document.querySelectorAll('.navbar a');
    const tabContents = document.querySelectorAll('.tab-content');

    function showTab(tabId) {
        tabContents.forEach(content => {
            content.style.display = 'none';
        });
        document.getElementById(tabId).style.display = 'block';
    }

    navbarLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showTab(targetId);

            const targetElement = document.getElementById(targetId);
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    showTab('videocards');

    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    let isSliding = false;
    const totalSlides = slides.length;

    function showSlide(index) {
        if (isSliding) return;
        isSliding = true;
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        setTimeout(() => isSliding = false, 1000);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    document.querySelector('.arrow.left').addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    });

    document.querySelector('.arrow.right').addEventListener('click', nextSlide);
    setInterval(nextSlide, 5000);

    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    const cart = {};

    function generateProductCards(products) {
        const grids = document.querySelectorAll('.product-grid');

        grids.forEach(grid => {
            const category = grid.getAttribute('data-category');
            grid.innerHTML = '';

            const filteredProducts = products.filter(product => product.category === category);

            filteredProducts.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.setAttribute('data-product', product.name);
                productCard.setAttribute('data-price', product.price);

                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="name">${product.name}</div>
                    <div class="price">${product.price}$</div>
                    <a href="#" class="buy-btn">Придбати</a>
                `;

                grid.appendChild(productCard);
            });
        });

        document.querySelectorAll('.buy-btn').forEach(button => {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                const productCard = this.closest('.product-card');
                const productName = productCard.getAttribute('data-product');
                const productPrice = productCard.getAttribute('data-price');
                addToCart(productName, productPrice);
            });
        });
    }

    generateProductCards(products);

    const floatingCartBtn = document.getElementById('floating-cart-btn');
    const cartCount = document.getElementById('cart-count');

    floatingCartBtn.addEventListener('click', () => {
        document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
    });

    function updateCartCount(count) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    }

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let totalSum = 0;

        Object.keys(cart).forEach(product => {
            const item = cart[product];
            const itemTotal = item.price * item.quantity;
            totalSum += itemTotal;

            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <span>${item.name}</span>
                <span>${item.price}$</span>
                <span>Кількість: ${item.quantity}</span>
                <span>Сума: ${itemTotal}$</span>
                <button class="cart-remove" data-product="${product}">Видалити</button>
            `;

            cartItemsContainer.appendChild(cartItemElement);
        });

        cartTotalContainer.textContent = totalSum;
        updateCartCount(Object.keys(cart).length);
    }

    function addToCart(product, price) {
        if (cart[product]) {
            cart[product].quantity += 1;
        } else {
            cart[product] = { name: product, price: parseFloat(price), quantity: 1 };
        }
        updateCart();
    }

    function removeFromCart(product) {
        if (cart[product]) {
            delete cart[product];
            updateCart();
        }
    }

    cartItemsContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('cart-remove')) {
            const product = event.target.getAttribute('data-product');
            removeFromCart(product);
        }
    });
    
    const newsFeed = document.getElementById('news-feed');
    const fakeNews = [
        { title: "New GeForce RTX 4090 Available Now!", link: "https://www.nvidia.com/en-eu/geforce/news/" },
        { title: "Driver Update for GeForce Cards", link: "https://www.nvidia.com/en-eu/geforce/news/" },
        { title: "NVIDIA Announces New AI Technology", link: "https://www.nvidia.com/en-eu/geforce/news/" }
    ];

    fakeNews.forEach(news => {
        const newsElement = document.createElement('div');
        newsElement.classList.add('news-item');
        newsElement.innerHTML = `<a href="${news.link}" target="_blank">${news.title}</a>`;
        newsFeed.appendChild(newsElement);
    });
});
