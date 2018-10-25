"use strict";
//Функция аккордеона. Переключает класс .active между элементами, на активный
function accordeonClass(collection, item) {
    collection.forEach(function(item){
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

    this.next = function() {
        that.plus();
        that.check();
    }

    this.prev = function(){
        that.minus();
        that.check();
    }

    this.timer = (time) => setInterval(() => that.next(), time*1000);
}

//В данном слайдере используется:
//1) кнопочное переключение, 2) автопереключение 3) возможность задать стартовый итем
//Подается: коллекция слайдов, первичный слайд, таймер(в секундах), и кнопочки переключения
//На выходе получаем самый просто слайдер где один блок получает класс active, а остльное поведение описывает css
function EasySlider(items, number = 0, time, btnPrev, btnNext) {
    Slider.apply(this, [items.length, number]);
    const that = this;

    this.display = function() {
        accordeonClass(items, items[that.show()]);
    }

    btnPrev.onclick = function() {
        that.prev();
        that.display();
    }
    btnNext.onclick = function() {
        that.next();
        that.display();
    }

    if(time) {
        this.timer(time);
        setInterval(() => this.display(), time*1000);
    }
}
//В данном счетчике используется:
//1) кнопочное переключение, 2) возможность задать стартовое значение
//Подается: первичный итем, инпут отображения, и кнопочки итерации
//На выходе получаем самый простой счетчик, который при необходимости может отдавать команду при изменении значения
function EasyCounter(number, display, btnPlus, btnMinus) {
    Counter.apply(this, [number]);
    const that = this;

    btnPlus.onclick = function() {
        that.plus();
        that.display();
    }

    btnMinus.onclick = function() {
        that.minus();
        that.display();
    }

    this.display = function() {
        (that.getCount() >= 0) ? display.value = that.getCount() : display.value = '0';
        display.onchange();
    }
}

//Для всех страниц
document.addEventListener('DOMContentLoaded', function () {
    //Обработка событий на шапке
    //Кнопка "Каталог"
    let headerCatalogBtn = document.querySelector('.header__catalog');

    headerCatalogBtn.onclick = function() {
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

    for (let i = 0; i < counterTablets.length; i++ ) {
        let counterPlus = counterTablets[i].nextElementSibling;
        let counterMinus = counterTablets[i].previousElementSibling;
        counterTablets[i].onchange = function() {return null}

        const counter = new EasyCounter(counterTablets[i].value, counterTablets[i], counterPlus, counterMinus);
    }
});

//JS for catalog
document.addEventListener('DOMContentLoaded', function () {
    "use strict";
    let catalogMenuItems = document.querySelectorAll('.catalog-menu__item');
    let catalogSubmenuItems = document.querySelectorAll('.catalog-menu__submenu-item');

    for (let i = 0; i < catalogMenuItems.length; i++ ) {
        catalogMenuItems[i].id = i;
        catalogMenuItems[i].onclick = function() {
            if (this.classList.contains('active')) {
                return this.classList.remove('active');
            }
            accordeonClass(catalogMenuItems, this);
        }
    }

    for (let i = 0; i < catalogSubmenuItems.length; i++ ) {
        catalogSubmenuItems[i].id = i;
        catalogSubmenuItems[i].onclick = function(ev) {
            accordeonClass(catalogSubmenuItems, this);
            ev.stopPropagation();
        }
    }

    //Слайдер с товарами
    let catalogCategoryes = document.querySelectorAll('.catalog-content__category');

    //Класс для работы каталоговых слайдеров, слайды двигаются на определенный % 
    function CatalogSlider(obj) {
        let position = +obj.slider.style.left.replace(/\D/g, '') || 0;
        Slider.apply(this, [obj.slider.children.length-2, position/100]);

        this.display = () => {
            if(window.matchMedia('(min-width: 768px)').matches) {
                return obj.slider.style.left = -this.show()*100/3 + '%';
            }
            return obj.slider.style.left = -this.show()*100/2 + '%';
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

    catalogCategoryes.forEach(function(category) {
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

    galleryBtnBuy.onclick =() => alert('Добавлено в корзину!');

    //Описание товара
    let descBtns = document.querySelectorAll('.productpage-desc__points-item');
    let descText = document.querySelectorAll('.productpage-desc__text-item');

    for (let i = 0; i < descBtns.length; i++ ) {
        descBtns[i].id = i;
        descBtns[i].onclick = function() {
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

    for (let i = 0; i < categoryesBtns.length; i++ ) {
        categoryesBtns[i].id = i;
        categoryesBtns[i].onclick = function() {
            accordeonClass(categoryesBtns, this);
            accordeonClass(categoryesText, categoryesText[this.id]);
        }
    }
});


//НЕОБХОДИМЫ СЕРЬЕЗНЫЕ РАБОТЫ ПО СОЗДАНИЮ ОБЪЕКТА КОРЗИНЫ
//JS for basket
document.addEventListener('DOMContentLoaded', function () {
    let counterTablets = document.querySelectorAll('.counter-tablet');
    let totalCost = document.querySelector('.basket-bottom__info-cost .num');
    let localCost = document.querySelectorAll('.basket-table__item-cost .num');

    function totalSum() {
        totalCost.innerText = '0';
        for (let i = 0; i < localCost.length; i++ ) {
            totalCost.innerText = +totalCost.innerText + +localCost[i].innerText;
        }
    }

    counterTablets.forEach(function(item) {
        let priceNum = item.parentNode.parentNode.querySelector('.basket-table__item-price .num');
        let costNum = item.parentNode.parentNode.querySelector('.basket-table__item-cost .num');

        if (costNum) {
            item.onchange = function() {
                let quantity = +item.value;
                costNum.innerText = +priceNum.innerText * quantity;
                totalSum();
            }
        }
    });

    totalSum();

    let basketDropBtns = document.querySelectorAll('.basket-table__item-cansel');
    let quantityOfProducts = basketDropBtns.length;

    basketDropBtns.forEach(function(item){
        item.onclick = function(){
            this.parentNode.parentNode.remove();
            quantityOfProducts--;
            totalSum();
        }
    });

    let basketProgressFields = document.querySelectorAll('.basket-progress__box-item');
    let basketContainers = document.querySelectorAll('.basket-container');
    let basketBtnNext = document.querySelector('.basket-bottom__btn-next');

    basketBtnNext.number = 1;

    basketBtnNext.onclick = function() {
        accordeonClass(basketProgressFields, basketProgressFields[basketBtnNext.number]);
        accordeonClass(basketContainers, basketContainers[basketBtnNext.number]);
        basketBtnNext.number++;
    }
    
    function Pull(...products) {
        this.getProducts = () => console.log(products);
    }
    
    
    let basket = document.querySelector('.basket');
    let products = document.querySelectorAll('.basket-table__item-row');
    
    function Basket(obj, products, orderNumber) {
        const basket = obj;
        let items = products;
        let orderN = orderNumber;
        
        this.state = {
            status: 0,
            quantity: items.length,
            totalCost: 0,
            person: {
                name: '',
                phone: '',
                email: ''
            },
            delivery: false
        }
        
        Pull.apply(this, products);
        
    }
    
    const newBasket = new Basket(basket, products, '023');
    
    console.log(newBasket.getProducts());
});