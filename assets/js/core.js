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

//Класс Слайдер, на вход которого подаются:
//Коллекция слайдов, стартовое значение и таймер.
//Автопереключение В СЕКУНДАХ(если не нужен, просто подать 0)!!!
function Slider(items, number = 0, timer) {
    Counter.apply(this);
    console.log('Autorun '+timer+'s');

    const that = this;
    
    this.setCount(number);
    
    this.check = function () {
        if (that.getCount() >= items.length) {
            that.setCount(0);
        } 
        if (that.getCount() < 0) {
            that.setCount(items.length - 1);
        }
    }
    
    this.next = function() {
        that.plus();
        that.check();
        
    }
    
    this.prev = function(){
        that.minus();
        that.check();
    }
    
//    if (timer) {
//        console.log(timer);
//        setInterval(this.next(), timer*1000);
//        console.log(timer);
//    }
}


//JS для главной страницы
document.addEventListener('DOMContentLoaded', function () {
    "use strict";
    //Блок "Спецпредложение"
    let specialSlides = document.querySelectorAll('.special-slider__content-column');
    let specialSliderPrev = document.querySelector('.special-slider__arrows-left');
    let specialSliderNext = document.querySelector('.special-slider__arrows-right');
    
    function SpecialSlider(items, number = 0, timer, btnPrev, btnNext) {
        Slider.apply(this, arguments);
        
        const that = this;
        
        this.display = function() {
            accordeonClass(items, items[that.getCount()], items[that.getCount()+1]);
            if(window.matchMedia('(min-width: 768px)').matches) {
                if (that.getCount() >= items.length-1) {
                    items[0].classList.add('active');
                } else {
                    items[that.getCount()+1].classList.add('active');
                }
            }
        }
        
        btnPrev.onclick = function() {
            that.prev();
            that.display();
        }
        btnNext.onclick = function() {
            that.next();
            that.display();
        }
    }
    
    const specialSlider = new SpecialSlider(
        specialSlides, 
        0,
        2,
        specialSliderPrev, 
        specialSliderNext
    );
    
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