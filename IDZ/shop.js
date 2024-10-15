document.addEventListener('DOMContentLoaded', function () {
    // Переключение вкладок
    const navbarLinks = document.querySelectorAll('.navbar a');
    const tabContents = document.querySelectorAll('.tab-content');

    function showTab(tabId) {
        // Скрываем все секции
        tabContents.forEach(content => {
            content.style.display = 'none';
        });
        // Показываем нужную секцию
        document.getElementById(tabId).style.display = 'block';
    }

    navbarLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Предотвращаем переход по ссылке
            const targetId = this.getAttribute('href').substring(1); // Извлекаем ID секции
            showTab(targetId); // Показываем нужную секцию

            // Плавная прокрутка к блоку с товарами
            const targetElement = document.getElementById(targetId);
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Показываем по умолчанию видеокарты
    showTab('videocards');

    // Работа с слайдами
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

    // Генерация товаров из базы данных (products.js)
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    const cart = {};

    // Функция для генерации карточек товаров по категориям
    function generateProductCards(products) {
        const grids = document.querySelectorAll('.product-grid');

        grids.forEach(grid => {
            const category = grid.getAttribute('data-category');
            grid.innerHTML = ''; // Очищаем текущие карточки товаров

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

        // Обработчики для кнопок "Придбати"
        document.querySelectorAll('.buy-btn').forEach(button => {
            button.addEventListener('click', function (event) {
                event.preventDefault(); // Предотвращаем переход по ссылке
                const productCard = this.closest('.product-card');
                const productName = productCard.getAttribute('data-product');
                const productPrice = productCard.getAttribute('data-price');
                addToCart(productName, productPrice);
            });
        });
    }

    // Генерация карточек товаров из базы данных products.js
    generateProductCards(products);

    // Плавающая кнопка корзины
    const floatingCartBtn = document.getElementById('floating-cart-btn');
    const cartCount = document.getElementById('cart-count');

    floatingCartBtn.addEventListener('click', () => {
        document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
    });

    function updateCartCount(count) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    }

    // Функция для обновления корзины
    function updateCart() {
        cartItemsContainer.innerHTML = ''; // Очищаем контейнер с товарами
        let totalSum = 0;

        // Генерируем каждый товар в корзине
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

    // Добавление товара в корзину
    function addToCart(product, price) {
        if (cart[product]) {
            cart[product].quantity += 1;
        } else {
            cart[product] = { name: product, price: parseFloat(price), quantity: 1 };
        }
        updateCart();
    }

    // Удаление товара из корзины
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

    // Фейковая новостная лента для демонстрации
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
