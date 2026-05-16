// --- КАТАЛОГ (Выпадающее меню) ---
const catalogBtn = document.getElementById("catalogBtn");
const catalogDropdown = document.getElementById("catalogDropdown");

if (catalogBtn && catalogDropdown) {
    catalogBtn.onclick = function(e) {
        e.preventDefault();
        catalogDropdown.classList.toggle("show");
    }
}

// Закрыть меню при клике вне области
window.onclick = function(event) {
    if (catalogBtn && !event.target.matches('#catalogBtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// --- БРЕНДЫ (Карусель) ---
document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('carouselTrack');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    // Проверяем наличие слайдера на странице (строка 22 из твоей ошибки)
    if (track && track.children.length > 0) {
        const slides = Array.from(track.children);
        const slideWidth = 400; 
        const slideMargin = 10;
        const totalSlideWidth = slideWidth + (slideMargin * 2);
        let currentIndex = 0;

        function updateCarousel() {
            slides.forEach(slide => slide.classList.remove('active-slide'));
            if (slides[currentIndex]) {
                slides[currentIndex].classList.add('active-slide');
            }

            const viewport = document.querySelector('.carousel-viewport');
            if (viewport) {
                const viewportWidth = viewport.offsetWidth;
                const targetOffset = - (currentIndex * totalSlideWidth) + (viewportWidth / 2) - (totalSlideWidth / 2);
                track.style.transform = `translateX(${targetOffset}px)`;
            }
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }

        updateCarousel();
        window.addEventListener('resize', updateCarousel);
    }
});

// --- ОТЗЫВЫ (Показать ещё) ---
const loadMoreBtn = document.getElementById('loadMoreBtn');
if (loadMoreBtn) { // Строка 77 из твоей ошибки
    loadMoreBtn.addEventListener('click', function() {
        const hiddenReviews = document.querySelectorAll('.hidden-review');
        hiddenReviews.forEach(review => {
            review.classList.remove('hidden-review');
            review.style.animation = "fadeIn 0.5s ease forwards";
        });
        this.style.display = 'none';
    });
}

// --- ПОКАЗАТЬ ПАРОЛЬ ---
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('passwordInput');

if (togglePassword && passwordInput) { 
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.src = type === 'password' ? 'img/eye-off.png' : 'img/eye-on.png';
    });
}
//ПОЛЬЗОВАТЕЛЬ 
document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('saveProfile');
    const imgInput = document.getElementById('imageUpload');
    const preview = document.getElementById('imagePreview');

    // 1. Загрузка данных из памяти
    if (localStorage.getItem('userName')) {
        document.getElementById('userName').value = localStorage.getItem('userName');
    }
    if (localStorage.getItem('userEmail')) {
        document.getElementById('userEmail').value = localStorage.getItem('userEmail');
    }
    if (localStorage.getItem('userAvatar')) {
        preview.style.backgroundImage = `url(${localStorage.getItem('userAvatar')})`;
    }

    // 2. Обработка загрузки фото
    if (imgInput) {
        imgInput.onchange = function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.style.backgroundImage = `url(${e.target.result})`;
                    localStorage.setItem('userAvatar', e.target.result); // Сохраняем фото
                }
                reader.readAsDataURL(file);
            }
        };
    }

    // 3. Сохранение текста
    if (saveBtn) {
        saveBtn.onclick = function() {
            localStorage.setItem('userName', document.getElementById('userName').value);
            localStorage.setItem('userEmail', document.getElementById('userEmail').value);
            alert('Данные успешно сохранены!');
        };
    }
});
 //ПОИСК ПО КАТАЛОГУ
const searchInput = document.getElementById('searchInput');
if (searchInput) { // Если поиск найден на странице
    searchInput.addEventListener('input', function () {
        // твой код поиска
    });
}
document.getElementById('searchInput').addEventListener('input', function () {
    let filter = this.value.toLowerCase(); // Берем текст из поиска и переводим в нижний регистр
    let cards = document.querySelectorAll('.product-card'); // Находим все карточки товаров

    cards.forEach(card => {
        let name = card.querySelector('.product-name').innerText.toLowerCase(); // Берем название товара
        
        // Если название содержит введенный текст, показываем карточку, иначе скрываем
        if (name.includes(filter)) {
            card.style.display = ""; // Показываем
        } else {
            card.style.display = "none"; // Скрываем
        }
    });
});



// Функция сохранения в localStorage
function saveCart(cartArray) {
    localStorage.setItem('teaCart', JSON.stringify(cartArray));
}

// 1. ФУНКЦИЯ ДОБАВЛЕНИЯ (вызывается из HTML кнопок: onclick="addToCart(...)")
window.addToCart = function(name, price, img) {
    let cart = JSON.parse(localStorage.getItem('teaCart')) || [];
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            img: img,
            quantity: 1
        });
    }

    saveCart(cart);
    alert(`Товар "${name}" добавлен в корзину!`);
};

// 2. ФУНКЦИЯ ОТОБРАЖЕНИЯ (отрисовывает товары в <section id="cart-items-list">)
window.renderCart = function() {
    const cartContainer = document.getElementById('cart-items-list');
    const summaryBlock = document.getElementById('cart-summary-block');
    const emptyMsg = document.getElementById('empty-cart-msg');
    const totalPrice = document.getElementById('total-price');
    const finalPrice = document.getElementById('final-price');

    if (!cartContainer) return; // Защита: выходим, если мы не на странице корзины

    let cart = JSON.parse(localStorage.getItem('teaCart')) || [];

    // Если корзина пуста
    if (cart.length === 0) {
        cartContainer.innerHTML = '';
        if (emptyMsg) emptyMsg.style.display = 'block';
        if (summaryBlock) summaryBlock.style.display = 'none';
        return;
    }

    // Если в корзине есть товары
    if (emptyMsg) emptyMsg.style.display = 'none';
    if (summaryBlock) summaryBlock.style.display = 'block';

    cartContainer.innerHTML = '';
    let total = 0;

    // Цикл по всем товарам
    cart.forEach((item, index) => {
        const itemSum = item.price * item.quantity;
        total += itemSum;
        
        // Вставляем красивую строчку с компактной структурой
        cartContainer.innerHTML += `
            <div class="cart-item-row">
                <div class="cart-item-image">
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <div class="cart-item-details">
                        <span class="cart-item-price">${itemSum} ₽</span>
                        <span class="cart-item-count">количество: ${item.quantity} шт.</span>
                    </div>
                </div>
                <button class="cart-item-delete" onclick="removeFromCart(${index})">🗑️</button>
            </div>
        `;
    });

    // Обновляем итоговые цифры на странице
    if (totalPrice) totalPrice.innerText = total + ' ₽';
    if (finalPrice) finalPrice.innerText = total + ' ₽';
};

// 3. ФУНКЦИЯ УДАЛЕНИЯ
window.removeFromCart = function(index) {
    let cart = JSON.parse(localStorage.getItem('teaCart')) || [];
    cart.splice(index, 1);
    saveCart(cart);
    renderCart(); // Мгновенно перерисовываем страницу
};

// 4. Автоматический запуск при полной загрузке страницы
document.addEventListener('DOMContentLoaded', renderCart);

//Оформление заказа
document.addEventListener('DOMContentLoaded', function() {
    const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
    const addressBlock = document.getElementById('address-block');
    const addressInput = document.getElementById('user-address');

    if (!deliveryRadios.length || !addressBlock) return; // Защита, если мы не на странице корзины

    // Функция проверки выбранного способа
    function toggleAddressVisibility() {
        // Ищем, какая кнопка нажата в данный момент
        const selectedDelivery = document.querySelector('input[name="delivery"]:checked').value;

        if (selectedDelivery === 'courier' || selectedDelivery === 'sdek') {
            // Показываем блок адреса и делаем поле обязательным
            addressBlock.classList.remove('hidden-block');
            if (addressInput) addressInput.required = true;
        } else {
            // Прячем блок адреса и убираем обязательность
            addressBlock.classList.add('hidden-block');
            if (addressInput) {
                addressInput.required = false;
                addressInput.value = ''; // Очищаем поле при скрытии
            }
        }
    }

    // Слушаем изменения на каждой радио-кнопке
    deliveryRadios.forEach(radio => {
        radio.addEventListener('change', toggleAddressVisibility);
    });

    // Запускаем один раз при загрузке, чтобы проверилось дефолтное значение (pickup)
    toggleAddressVisibility();
});


//нажата кнопка оформить заказ
window.placeOrder = function() {
    // 1. Находим форму и проверяем, заполнена ли она
    const form = document.getElementById('checkout-form');
    
    if (form) {
        // Проверяем, заполнил ли пользователь обязательные поля (ФИО, телефон)
        if (!form.checkValidity()) {
            form.reportValidity(); // Если не заполнил — браузер сам покажет подсказку "Заполните это поле"
            return; // Выходим из функции, дальше код не пойдет
        }
    }

    // 2. СНАЧАЛА показываем окошко (теперь страница не обновится и не закроет его)
    alert("🎉 Заказ успешно оформлен!\nНаш чайный сомелье уже собирает вашу посылочку. Спасибо, что выбрали Чайный уголок!");

    // 3. ТОЛЬКО ПОСЛЕ ЭТОГО очищаем форму
    if (form) {
        form.reset();
    }

    // 4. Очищаем корзину в памяти
    localStorage.removeItem('teaCart');

    // 5. Перерисовываем пустую корзину
    if (typeof renderCart === 'function') {
        renderCart();
    }
    setTimeout(() => {
            window.location.href = 'main.html';
        }, 1000);
};