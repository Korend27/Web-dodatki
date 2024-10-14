document.addEventListener('DOMContentLoaded', function () {
    // Плавная прокрутка до разделов
    const navbarLinks = document.querySelectorAll('.navbar a');

    navbarLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1); // Извлечение ID раздела
            const targetElement = document.getElementById(targetId); // Нахождение элемента по ID
            
            // Прокрутка к выбранному разделу с учетом смещения навбара
            const headerOffset = 80; // Учитываем высоту навбара
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth' // Плавная прокрутка
            });

            showTab(targetId); // Переключаем вкладку
        });
    });

    // Работа с слайдами
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval;

    // Функция для показа слайда с паузой
    function showSlideWithPause(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'inactive');
            if (i === index) {
                setTimeout(() => {
                    slide.classList.add('active');
                }, 1000); // Пауза 1000 миллисекунд (1 секунда)
            } else {
                slide.classList.add('inactive');
            }
        });
    }

    // Автопрокрутка каждые 5 секунд
    function startAutoSlide() {
        clearInterval(slideInterval);
        slideInterval = setInterval(function () {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlideWithPause(currentSlide);
        }, 5000); // Каждые 5 секунд
    }

    // Обработчики для ручного переключения слайдов
    document.querySelector('.arrow.left').addEventListener('click', function () {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlideWithPause(currentSlide);
        startAutoSlide();
    });

    document.querySelector('.arrow.right').addEventListener('click', function () {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlideWithPause(currentSlide);
        startAutoSlide();
    });

    // Инициализация первого слайда и автопрокрутки
    showSlideWithPause(currentSlide);
    startAutoSlide();

    // Переключение вкладок
    const tabContents = document.querySelectorAll('.tab-content');

    function showTab(tabId) {
        tabContents.forEach(content => {
            content.style.display = 'none';
        });
        document.getElementById(tabId).style.display = 'block';
    }

    showTab('videocards'); // По умолчанию показываем видеокарты

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

        // Обновляем общую сумму
        cartTotalContainer.textContent = totalSum;
    }

    // Добавление товара в корзину
    function addToCart(product, price) {
        if (cart[product]) {
            cart[product].quantity += 1; // Если товар уже есть в корзине, увеличиваем количество
        } else {
            cart[product] = { name: product, price: parseFloat(price), quantity: 1 }; // Добавляем новый товар
        }
        updateCart();
    }

    // Удаление товара из корзины
    function removeFromCart(product) {
        if (cart[product]) {
            delete cart[product]; // Удаляем товар из корзины
            updateCart();
        }
    }

    // Обработчик для удаления товара
    cartItemsContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('cart-remove')) {
            const product = event.target.getAttribute('data-product');
            removeFromCart(product);
        }
    });
});