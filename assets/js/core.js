"use strict";
//Функция аккордеона. Переключает класс .active между элементами, на активный
function accordeonClass(collection, item) {
    collection.forEach(function(item){
        item.classList.remove('active');
    })
    item.classList.add('active');
}
//Функция переключения toggle
function toggle(selector) {
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
//
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
//JS для шапки
document.addEventListener('DOMContentLoaded', function () {
    let headerCatalogBtn = document.querySelector('.header__catalog');
    
    headerCatalogBtn.onclick = function() {
        this.classList.toggle('active');
    }
    
    let sandwich = document.querySelector('.header__sandwich');
    let headerNav = document.querySelector('.header__nav');
    
    sandwich.onclick = function() {
        headerNav.classList.toggle('d-none');
    }
    
});
//JS для главной страницы
document.addEventListener('DOMContentLoaded', function () {
    "use strict";
    //В данном слайдере используется:
    //1) кнопочное переключение, 2) автопереключение 3) возможность задать стартовый итем
    //Подается: коллекция слайдов, первичный слайд, таймер(в секундах), и кнопочки переключения 
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
    
    //Главный слайдер на главной странице
    let sliderSlides = document.querySelectorAll('.slider-content__item');
    let sliderSliderPrev = document.querySelector('.slider__arrow-left');
    let sliderSliderNext = document.querySelector('.slider__arrow-right');
    
    const sliderSlider = new EasySlider(
        sliderSlides, 
        2,
        3,
        sliderSliderPrev, 
        sliderSliderNext
    );
    
    sliderSlider.display();
    
    //Блок "Спецпредложение"
    let specialSlides = document.querySelectorAll('.special-slider__content-column');
    let specialSliderPrev = document.querySelector('.special-slider__arrows-left');
    let specialSliderNext = document.querySelector('.special-slider__arrows-right');
    
    //Добавляем первый элемент в конец родителя, без внесения в келлекцию
    //Делается для того что бы последним элементом показывался первый без разрыва
    let clone = specialSlides[0].cloneNode(true);
    specialSlides[0].parentNode.appendChild(clone);
    
    const specialSlider = new EasySlider(
        specialSlides, 
        2,
        6,
        specialSliderPrev, 
        specialSliderNext
    );
    
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
})