"use strict";
//Функция аккордеона. Переключает класс .active между элементами, на активный
function accordeonClass(collection, item) {
    collection.forEach(function (item) {
        item.classList.remove('active');
    })
    item.classList.add('active');
}

//Счетчик, на вход которого можно подавать стартовое значение
//По умолчанию стартовое значение равно нулю
function Counter(number) {
    let count = number || 0;

    this.plus = () => count++;

    this.minus = () => count--;

    this.getCount = () => count;

    this.setCount = (index) => count = index;
}

//Класс Слайдер, на вход которого подаются: количество слайдов, стартовое значение
//Таймер: автопереключение В СЕКУНДАХ(если не нужен, просто подать 0)!!!
function Slider(quantity, number = 0) {
    Counter.apply(this);

    const that = this;

    this.setCount(number);

    this.show = () => that.getCount();

    this.check = function () {
        if (that.getCount() >= quantity) {
            that.setCount(0);
        }
        if (that.getCount() < 0) {
            that.setCount(quantity - 1);
        }
        that.show();
    }

    this.next = function () {
        that.plus();
        that.check();
    }

    this.prev = function () {
        that.minus();
        that.check();
    }

    this.timer = (time) => setInterval(() => that.next(), time * 1000);
}

//В данном слайдере используется:
//1) кнопочное переключение, 2) автопереключение 3) возможность задать стартовый итем
//Подается: коллекция слайдов, первичный слайд, таймер(в секундах), и кнопочки переключения
//На выходе получаем самый просто слайдер где один блок получает класс active, а остльное поведение описывает css
function EasySlider(items, number = 0, time, btnPrev, btnNext) {
    Slider.apply(this, [items.length, number]);
    const that = this;

    this.display = function () {
        accordeonClass(items, items[that.show()]);
    }

    btnPrev.onclick = function () {
        that.prev();
        that.display();
    }
    btnNext.onclick = function () {
        that.next();
        that.display();
    }

    if (time) {
        this.timer(time);
        setInterval(() => this.display(), time * 1000);
    }
}
//В данном счетчике используется:
//1) кнопочное переключение, 2) возможность задать стартовое значение 3) только положительные числа
//Подается: первичный итем, инпут отображения, и кнопочки итерации
//На выходе получаем самый простой счетчик, который при необходимости может отдавать команду при изменении значения
function EasyCounter(number, display, btnPlus, btnMinus) {
    Counter.apply(this, [number]);
    const that = this;

    btnPlus.onclick = function () {
        that.plus();
        that.display();
    }

    btnMinus.onclick = function () {
        that.minus();
        that.display();
    }

    this.display = function () {
        (that.getCount() >= 0) ? display.value = that.getCount(): (display.value = '0', that.setCount(0));
        display.onchange();
    }
}

//Для всех страниц
document.addEventListener('DOMContentLoaded', function () {
    //Обработка событий на шапке
    //Кнопка "Каталог"
    let headerCatalogBtn = document.querySelector('.header__catalog');

    headerCatalogBtn.onclick = function () {
        this.classList.toggle('active');
    }
    //Сэндвич меню в шапке мобильной версии
    let sandwich = document.querySelector('.header__sandwich');
    let headerNav = document.querySelector('.header__nav');

    sandwich.onclick = () => headerNav.classList.toggle('d-none');

    //Поисковая строка в мобильной версии
    let search = document.querySelector('.search');
    let searchGo = document.querySelector('.search-panel__go');
    let searchClose = document.querySelector('.search-panel__close');
    let searchActive = false;

    searchGo.onclick = function () {
        if (searchActive) {
            return console.log('searching...');
        } else {
            search.classList.add('active');
            return searchActive = true;
        }
    }

    searchClose.onclick = function () {
        search.classList.remove('active');
        return searchActive = false;
    }

    //Счетчики: определяем все счетчики на странице.
    let counterTablets = document.querySelectorAll('.counter-tablet');

    for (let i = 0; i < counterTablets.length; i++) {
        let counterPlus = counterTablets[i].nextElementSibling;
        let counterMinus = counterTablets[i].previousElementSibling;
        counterTablets[i].onchange = () => null;

        const counter = new EasyCounter(counterTablets[i].value, counterTablets[i], counterPlus, counterMinus);
    }

    let scrollTop = document.querySelector('.scroll-top');
    scrollTop.onclick = function () {
        let i = 0;
        let scrolling = setInterval(function () {
            window.scrollBy(0, -100);
            i++;
            if (i > 15) {
                window.scrollTo(0, 0);
                return clearInterval(scrolling);
            }
        }, 20);
    }
});

//JS for catalog
document.addEventListener('DOMContentLoaded', function () {
    "use strict";
    let catalogMenuItems = document.querySelectorAll('.catalog-menu__item');
    let catalogSubmenuItems = document.querySelectorAll('.catalog-menu__submenu-item');

    for (let i = 0; i < catalogMenuItems.length; i++) {
        catalogMenuItems[i].id = i;
        catalogMenuItems[i].onclick = function () {
            if (this.classList.contains('active')) {
                return this.classList.remove('active');
            }
            accordeonClass(catalogMenuItems, this);
        }
    }

    for (let i = 0; i < catalogSubmenuItems.length; i++) {
        catalogSubmenuItems[i].id = i;
        catalogSubmenuItems[i].onclick = function (ev) {
            accordeonClass(catalogSubmenuItems, this);
            ev.stopPropagation();
        }
    }

    //Слайдер с товарами
    let catalogCategoryes = document.querySelectorAll('.catalog-content__category');

    //Класс для работы каталоговых слайдеров, слайды двигаются на определенный % 
    function CatalogSlider(obj) {
        let position = +obj.slider.style.left.replace(/\D/g, '') || 0;
        Slider.apply(this, [obj.slider.children.length - 2, position / 100]);

        this.display = () => {
            if (window.matchMedia('(min-width: 768px)').matches) {
                return obj.slider.style.left = -this.show() * 100 / 3 + '%';
            }
            return obj.slider.style.left = -this.show() * 100 / 2 + '%';
        }

        obj.next.onclick = () => {
            this.next();
            return this.display();
        }

        obj.prev.onclick = () => {
            this.prev();
            return this.display();
        }
    }

    catalogCategoryes.forEach(function (category) {
        const catalogCategory = {
            conteiner: category,
            prev: category.querySelector('.arrow-left'),
            next: category.querySelector('.arrow-right'),
            slider: category.querySelector('.catalog-content__category-wrapper'),
        };
        if (catalogCategory.slider) {
            const catalogSlider = new CatalogSlider(catalogCategory);
        }
    })



});

//JS for productpage
document.addEventListener('DOMContentLoaded', function () {
    //Геллерея
    let galleryModal = document.querySelector('.productpage-gallery');
    let galleryBtnOpen = document.querySelector('.productpage-img__btn');
    let galleryWrapper = document.querySelector('.productpage-gallery__wrapper');
    let galleryItems = document.querySelectorAll('.productpage-gallery__item');
    let galleryBtnClose = document.querySelector('.productpage-gallery__btn-close');
    let galleryBtnLeft = document.querySelector('.productpage-gallery__arrows-left');
    let galleryBtnRight = document.querySelector('.productpage-gallery__arrows-right');

    galleryBtnOpen.onclick = () => galleryModal.style.display = 'flex';
    galleryModal.onclick = () => galleryModal.style.display = 'none';
    galleryBtnClose.onclick = () => galleryModal.style.display = 'none';
    galleryWrapper.onclick = (ev) => ev.stopPropagation();

    const productSlider = new EasySlider(galleryItems, 0, 0, galleryBtnLeft, galleryBtnRight);

    //Кнопочка купить

    let galleryBtnBuy = document.querySelector('.productpage-panel__props-btn');

    galleryBtnBuy.onclick = () => alert('Добавлено в корзину!');

    //Описание товара
    let descBtns = document.querySelectorAll('.productpage-desc__points-item');
    let descText = document.querySelectorAll('.productpage-desc__text-item');

    for (let i = 0; i < descBtns.length; i++) {
        descBtns[i].id = i;
        descBtns[i].onclick = function () {
            accordeonClass(descBtns, this);
            accordeonClass(descText, descText[this.id]);
        }
    }
});

//JS для главной страницы
document.addEventListener('DOMContentLoaded', function () {
    "use strict";

    //Главный слайдер на главной странице
    let sliderSlides = document.querySelectorAll('.slider-content__item');
    let sliderSliderPrev = document.querySelector('.slider__arrow-left');
    let sliderSliderNext = document.querySelector('.slider__arrow-right');

    const sliderSlider = new EasySlider(sliderSlides, 2, 3, sliderSliderPrev, sliderSliderNext);

    sliderSlider.display();

    //Блок "Спецпредложение"
    let specialSlides = document.querySelectorAll('.special-slider__content-column');
    let specialSliderPrev = document.querySelector('.special-slider__arrows-left');
    let specialSliderNext = document.querySelector('.special-slider__arrows-right');

    //Добавляем первый элемент в конец родителя, без внесения в келлекцию
    //Делается для того что бы последним элементом показывался первый без разрыва
    let clone = specialSlides[0].cloneNode(true);
    specialSlides[0].parentNode.appendChild(clone);

    const specialSlider = new EasySlider(specialSlides, 2, 6, specialSliderPrev, specialSliderNext);

    specialSlider.display();

    //Блог категорий товарос с описанием для сео
    let categoryesBtns = document.querySelectorAll('.categoryes-menu__item');
    let categoryesText = document.querySelectorAll('.categoryes-desc');

    for (let i = 0; i < categoryesBtns.length; i++) {
        categoryesBtns[i].id = i;
        categoryesBtns[i].onclick = function () {
            accordeonClass(categoryesBtns, this);
            accordeonClass(categoryesText, categoryesText[this.id]);
        }
    }

    //Блок "О магазине"
    let aboutBtn = document.querySelector('.about__link');

    aboutBtn.onclick = function () {
        let paragaphs = this.parentNode.querySelectorAll('p');
        this.style.display = 'none';
        paragaphs.forEach(function (text) {
            text.style = ''
        })
    }

    let btnsFastSale = document.querySelectorAll('.btn-fast-sale')

    btnsFastSale.forEach(btn => btn.onclick = createBubble)

    function createBubble(event) {
        let bubble = document.createElement('div');

        bubble.style.right = `${event.screenX*(-1)-50}px`;
        bubble.style.top = `${event.screenY-50}px`;

        let prodImg = document.createElement('img');
        prodImg.src = this.previousElementSibling.src;
        bubble.appendChild(prodImg);

        this.parentNode.appendChild(bubble);
        bubble.classList.add('bubble')
        bubble.classList.add('create')

        setTimeout(() => {
            bubble.classList.add('fly')
        }, 100)

        setTimeout(() => {
            bubble.parentNode.removeChild(bubble);
        }, 2000)
    }
});

//JS for basket
document.addEventListener('DOMContentLoaded', function () {
    function Product(item, addChanges) {
        let cost = +item.costDisplay.innerText || 0;
        let quantity = +item.counter.value;
        let that = this;

        this.getQuantity = () => quantity = +item.counter.value;
        this.setCost = () => cost = item.price * quantity;
        this.getCost = () => cost;

        item.counter.onchange = () => {
            quantity = this.getQuantity();
            that.setCost();
            item.costDisplay.innerText = cost;
            this.refresh();

            return newBasket.setChanges();
        }

        item.close.onclick = function () {
            item.product.remove();
            quantity = 0;
            cost = 0;
            that.refresh();

            return newBasket.setChanges();
        }

        this.refresh = () => addChanges(item.id, cost, quantity);
    }

    function Step1(callback, ...products) {
        const costs = [];
        const quantityes = [];

        function addChanges(index, cost, quantity) {
            costs[index] = cost;
            quantityes[index] = quantity;
        }

        products.forEach(function (item) {
            const basketItem = {
                product: item,
                counter: item.querySelector('.counter-tablet'),
                price: +item.querySelector('.basket-table__item-price .num').innerText,
                close: item.querySelector('.basket-table__item-cansel'),
                costDisplay: item.querySelector('.basket-table__item-cost .num'),
                id: products.indexOf(item)
            }
            const newProduct = new Product(basketItem, addChanges);
            newProduct.refresh();
        });

        this.getCosts = () => costs;
        this.getQuantityes = () => quantityes;

        function reverseFlow() {
            return callback()
        };
    }

    function Step2(person) {
        let delivery = false;
        const basketForm = basket.querySelector('.basket-data');
        const deliveryBtns = basket.querySelectorAll('.basket-data__radio-btn');
        const formFields = basketForm.querySelectorAll('.basket-data__form input');
        const chechConfidanse = basketForm.querySelector('input[name="confidance"]');
        const endBtn = basket.querySelector('.step2');
        let that = this;

        for (let i = 1; i < deliveryBtns.length; i++) {
            deliveryBtns[i].onclick = () => {
                person.delivery = i;
                return delivery = true;
            }
        }

        this.required = (selector) => (selector.value === '') ? false : true;

        this.requiredEmail = (selector) => /^([a-z0-9\.\+_%-]+@[a-z0-9]+\.[a-z]{2,4})$/i.test(selector.value);

        this.requiredPhone = (selector) => /^((\+?[7-8]?[^\w\s]?[8-9]\d{2}[^\w\s]?\d{1})?([^\w\s]?\d{2}){3})$/.test(selector.value);

        chechConfidanse.onclick = function () {
            return this.hasAttribute('checked') ?
                (this.setAttribute('checked', ''), endBtn.setAttribute('disabled', 'disabled')) :
                (this.removeAttribute('checked'), endBtn.removeAttribute('disabled'));
        }

        this.validForm = () => {
            let valid = true;
            formFields.forEach(function (input) {
                if (input.getAttribute("name") === "email") {
                    input.setAttribute('valid', that.requiredEmail(input));
                    person.email = input.value;
                    return valid = valid && that.requiredEmail(input);
                }
                if (input.getAttribute("name") === "phone") {
                    input.setAttribute('valid', that.requiredPhone(input));
                    person.phone = input.value;
                    return valid = valid && that.requiredPhone(input);
                }
                if (input.getAttribute("name") === "comment") {
                    input.setAttribute('valid', true);
                    person.comment = input.value;
                    return valid = valid && true;
                }
                if (input.getAttribute("name") === 'adress') {
                    !delivery ? input.setAttribute('valid', true) : person.adress = input.value;
                    input.setAttribute('valid', that.required(input));
                    return valid = valid && true;
                }
                if (input.getAttribute("name") === "name") {
                    person.name = input.value;
                }
                input.setAttribute('valid', that.required(input));
                return valid = valid && that.required(input);
            });
            return valid;
        }
    }

    function StatusBar(basket, props) {
        const basketProgressBar = basket.querySelectorAll('.basket-progress__box-item');
        const basketActivePlace = basket.querySelectorAll('.basket-container');
        const basketBottom = basket.querySelectorAll('.basket-bottom__container');
        const basketItemsQuantity = basket.querySelectorAll('.quantity');
        const basketTotalCost = basket.querySelectorAll('.total-cost');
        const basketBtnBack = basket.querySelector('.basket-bottom__btn-back');
        //конечный вывод
        const basketComplete = basket.querySelector('.basket-complete');
        const orderNumber = basketComplete.querySelector('.basket-complete__datas-number');
        const personName = basketComplete.querySelector('.person-name');
        const personPhone = basketComplete.querySelector('.person-phone');
        const personEmail = basketComplete.querySelector('.person-email');
        const orderDelivery = basketComplete.querySelector('.order-delivery');

        this.refresh = function () {
            accordeonClass(basketProgressBar, basketProgressBar[this.state.status]);

            accordeonClass(basketActivePlace, basketActivePlace[this.state.status]);

            accordeonClass(basketBottom, basketBottom[this.state.status]);

            basketTotalCost.forEach(function (text) {
                text.innerHTML = props.totalCost;
            });

            basketItemsQuantity.forEach(function (text) {
                if (/[1][\d]$/.test(props.totalQuantity)) {
                    return text.innerHTML = `${props.totalQuantity} товаров`;
                } else if (/[1]$/.test(props.totalQuantity)) {
                    return text.innerHTML = `${props.totalQuantity} товар`;
                } else if (/[2-4]$/.test(props.totalQuantity)) {
                    return text.innerHTML = `${props.totalQuantity} товара`;
                } else {
                    return text.innerHTML = `${props.totalQuantity} товаров`;
                }
            });

            orderNumber.innerHTML = '№ ' + props.orderN;
            personName.innerHTML = props.person.name;
            personPhone.innerHTML = props.person.phone;
            personEmail.innerHTML = props.person.email;

            (props.person.delivery) ? orderDelivery.innerHTML = '+ доставка': orderDelivery.innerHTML = ' самовывоз';
        }
    }

    let basket = document.querySelector('.basket');
    let products = document.querySelectorAll('.basket-table__item-row');

    function Basket(obj, products, orderNumber) {
        const basket = obj;
        let items = products;
        let that = this;

        //Свойства, которые необходимо отображать
        this.state = {
            status: 0,
            totalQuantity: 0, //Берется значение из Шага 1
            totalCost: 0, //Берется значение из Шага 1
            orderN: orderNumber,
            person: {
                name: '',
                phone: '',
                email: '',
                adress: '',
                comment: '',
                delivery: ''
            }
        }

        this.setChanges = function () {
            let totalCost = 0;
            this.getCosts().forEach((cost) => totalCost = totalCost + cost);
            this.state.totalCost = totalCost;

            let totalQuantity = 0;
            this.getQuantityes().forEach((quantity) => totalQuantity = totalQuantity + quantity);
            this.state.totalQuantity = totalQuantity;

            return this.refresh();
        };

        Step1.apply(this, [this.setChanges, ...products]);

        StatusBar.apply(this, [basket, this.state]);

        //Переход к следующему шагу корзины
        const switchStatusBtns = basket.querySelectorAll('.basket-bottom__btn-next');
        switchStatusBtns.forEach(function (btn) {
            btn.onclick = () => {
                if (that.state.status === 0 && that.state.totalQuantity === 0) {
                    return that.refresh();
                }
                if (that.state.status === 1 && !that.validForm()) {
                    return that.refresh();
                }
                that.state.status++;
                return that.refresh();
            }
        });
        //Возврат в корзину из формы
        const switchStatusBack = basket.querySelector('button.basket-bottom__btn-back');
        switchStatusBack.onclick = () => {
            that.state.status = 0;
            that.state.delivery = false;
            return that.refresh();
        }

        Step2.apply(this, [this.state.person]);
    }

    const newBasket = new Basket(basket, products, '023');
    newBasket.setChanges();

    console.log();
});
