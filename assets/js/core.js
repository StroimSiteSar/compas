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


//JS для главной страницы
document.addEventListener('DOMContentLoaded', function () {
    "use strict";
    //Блок "Спецпредложение"
    let specialSlides = document.querySelectorAll('.special-slider__content-column');
    let specialSliderPrev = document.querySelector('.special-slider__arrows-left');
    let specialSliderNext = document.querySelector('.special-slider__arrows-right');
    
    
    //В данном слайдере используется:
    //1) кнопочное переключение, 2) автопереключение 3) возможность задать стартовый итем
    //Подается: коллекция слайдов, первичный слайд, таймер(в секундах), и кнопочки переключения 
    function SpecialSlider(items, number = 0, time, btnPrev, btnNext) {
        Slider.apply(this, [items.length, number]);
        
        this.display = function() {
            accordeonClass(items, items[that.getCount()]);
            if(window.matchMedia('(min-width: 768px)').matches) {
                if (that.show() >= items.length-1) {
                    items[0].classList.add('active');
                } else {
                    items[that.show()+1].classList.add('active');
                }
            }
        }
        
        const that = this;
        
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
    
    const specialSlider = new SpecialSlider(
        specialSlides, 
        2,
        1,
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