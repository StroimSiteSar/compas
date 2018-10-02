document.addEventListener('DOMContentLoaded', function () {
    "use strict";
    var photos = document.querySelectorAll('.article__photogallery-item'),
        slider = document.querySelector('.modalSlider'),
        sliderDisplay = document.querySelector('.modalSlider__display'),
        prev = document.querySelector('.modalSlider__arrow-prev'),
        next = document.querySelector('.modalSlider__arrow-next'),
        closeBtn = document.querySelector('.modalSlider__close'),
        i,
        slideNumber,
        pictures = [];
    
    /* ============================== Фотогалерея ================================*/
    function check(slide) {
        if (slide === photos.length) {
            slide = 0;
        }
        if (slide < 0) {
            slide = photos.length - 1;
        }
        return slide;
    }
    
    function showSlides(number) {
        slideNumber = check(number);
        sliderDisplay.style.backgroundImage = pictures[slideNumber];
    }
    
    if (window.matchMedia('(min-width: 768px)').matches) {
        for (i = 0; i < photos.length; i += 1) {
            pictures[i] = 'url(' + photos[i].src + ')';
            photos[i].number = i;
            photos[i].onclick = function () {
                slider.style.display = 'flex';
                showSlides(this.number);
            };
        }
    }
    
    prev.onclick = function () {
        showSlides(slideNumber -= 1);
    };
    next.onclick = function () {
        showSlides(slideNumber += 1);
    };
    closeBtn.onclick = function () {
        slider.style.display = 'none';
    };
    
    slider.onclick = function (mouseEvent) {
        var actualEvent = mouseEvent || window.event,
            target = actualEvent.target || actualEvent.srcElement;
        if (this === target) {
            slider.style.display = "none";
        }
    };
    
    /* ===========================================================================*/
});
document.addEventListener('DOMContentLoaded', function () {
    
    /* ============================= Сортировка отзывов =============================*/
    
    var reviews = document.querySelectorAll('.article-reviews__item'),
        pagination = document.querySelector('.pagination'),
        elementsOnPage = 6;
    
    function paginationGenerate() { 
        var pagesQuantity = Math.trunc(reviews.length/elementsOnPage);
        reviews.length % elementsOnPage === 0 ? pagesQuantity : pagesQuantity++;
        for (let i = 1; i <= pagesQuantity; i++) {
            var pageItem = document.createElement('li');
            pageItem.classList.add('page-item');
            pageItem.innerHTML = '<a class="page-link">' + i + '</a>';
            
            pagination.appendChild(pageItem);
        }
    }
    
    paginationGenerate();
    
    var paginationPoints = document.querySelectorAll('.page-item');
    
    function showReviews(n) {
        paginationPoints.forEach(function(point){
            point.classList.remove('disabled', 'active-link');
            point.removeAttribute('disabled','disabled');
        }); 
        var n = +this.firstChild.innerHTML || 1;
        this.classList.add('disabled', 'active-link');
        this.setAttribute('disabled','disabled');
        for (let i = 0; i < reviews.length; i++) {
            if ((i >= elementsOnPage*(n-1)) && (i < elementsOnPage*n)) {
                reviews[i].style.display = "block";
            } else {
                reviews[i].style.display = "none";
            }
        }
        window.scrollTo({
            top: 500,
            behavior: "smooth"
        });
    }
    
    paginationPoints.forEach(function(point){
        point.onclick = showReviews;
    }); 
    
    paginationPoints[0].onclick ();
    
    /* ==============================================================================*/
    /* =============================== Новый отзыв ===============================*/
    var openFormBtn = document.querySelector('.article-openForm'),
        inputAreas = document.querySelectorAll('form input, form textarea'),
        reviewForm = document.querySelector('.article__form'),
        completeBtn = document.querySelector('.article__form-button');
    
    openFormBtn.onclick = function () {
        reviewForm.style.display = 'block';
        openFormBtn.style.display = 'none';
    };
    
    function validateRequired() {
        return this.value !== '';
    }
    
    function cleanValidation() {
        var nextElement = this.nextElementSibling;
        this.classList.remove('is-invalid');
        if (nextElement && nextElement.classList.contains('article__form-error')) {
            nextElement.parentNode.removeChild(nextElement);
        }
    }
    
    function addValidationError() {
        cleanValidation.call(this);
        var error = document.createElement('span');
        error.classList.add('article__form-error');
        error.style.color = "red";
        error.innerHTML = 'Это поле обязательно для заполнения!';
        
        this.parentNode.insertBefore(error, this.nextElementSibling);
        this.classList.add('is-invalid');
    }
    
    function validateForm() {
        var formValide = true;
        
        inputAreas.forEach(function (input) {
            var validationAttribute = input.getAttribute('data-validate');
            var validationRules = validationAttribute ? validationAttribute.split(',') : [];
            var valid = true;
            validationRules.forEach(function (rule) {
                valid = valid && validateRequired.call(input);
                
                if (!valid) {
                    addValidationError.call(input);
                } else {
                    cleanValidation.call(input);
                }
                formValide = formValide && valid;
            });
        });
        
        return formValide;
    }
    completeBtn.onclick = function () {
        if (validateForm.call(this)) {
            var username = document.querySelector('.article__form-name').value,
                usertext = document.querySelector('.article__form-review').value,
                date = new Date();
            
            let reviewName = document.createElement('span');
            reviewName.classList.add('article-reviews__item-name');
            reviewName.innerHTML = username;
            
            let reviewDate = document.createElement('span');
            reviewDate.classList.add('article-reviews__item-date');
            reviewDate.innerHTML = date.getDate()+'.'+date.getMonth()+'.'+date.getFullYear()+'&nbsp;'+date.getHours()+':'+date.getMinutes();
            
            let reviewText = document.createElement('div');
            reviewText.classList.add('article-reviews__item-text');
            reviewText.innerHTML = usertext;
            
            let newReview = document.createElement('div');
            newReview.classList.add('article-reviews__item');
            newReview.appendChild(reviewName);
            newReview.appendChild(reviewDate);
            newReview.appendChild(reviewText);
            console.log(newReview);
            
            this.parentNode.nextElementSibling.insertBefore(newReview, this.parentNode.nextElementSibling.firstChild)

            reviewForm.style.display = 'none';
            openFormBtn.style.display = "block";
        }
    };
});