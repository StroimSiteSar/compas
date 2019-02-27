'use strict';

const catalogLayout = {
    menu: {
        tag: 'ul',
        className: 'header__catalog-menu',
    },
    menuItem: {
        tag: 'li',
        className: 'header__catalog-menu__item' 
    },
    submenu: {
        tag: 'ul',
        className: 'header__catalog-menu__submenu', 
    },
    list: {
        tag: 'li',
        className: 'header__catalog-menu__submenu-item'
    },
    link: {
        tag: 'a',
        className: 'header__catalog-menu__submenu-link'
    }
}

class List {
    constructor(propList) {
        this.list = {
            id: propList.id || '',
            tag: propList.tag || 'ul',
            title: propList.title || '',
            className: propList.className || '',
            elements: propList.elements || [],
        }
    }
    createList = () => {
        const currentList = createElement({
            ...this.list,
            elements: null
        })
        this.list.elements.forEach(item => {
            
            console.log('currentList', currentList)
            currentList.appendChild(createElement({
                ...item,
                elements: null
            }))
        })
        return currentList
    }
}

fetch("catalog.json")
    .then(res => res.json())
    .then(response => createCatalog(initCatalog))
    .catch(error => createCatalog(initCatalog))

function createCatalog(catalog) {
    if (!catalog && !catalog.length) return createCatalog(initCatalog);
    
    let dropdown = document.querySelector('.header__catalog');
    
    const menu = new List({
        title: 'Каталог',
        ...catalogLayout.menu,
        elements: catalog.map(item => {
            return {...item,
                ...catalogLayout.menuItem,
                elements: [] 
           }
        })
    })   
    
    if (window.matchMedia("(min-width: 992px)").matches) {
        dropdown.parentNode.appendChild(createList({
            ...catalogLayout.menu,
            elements: catalog.map(item => {
                return {...item,
                ...catalogLayout.menuItem,
                elements: item.subgroup 
                    ? {
                        ...catalogLayout.submenu,
                        elements: item.subgroup.map(item => {
                            return {
                                ...item,
                                ...catalogLayout.list,
                                elements: item.subgroup
                                    ? item.subgroup.map(item => {
                                            return {
                                                ...item,
                                                ...catalogLayout.link
                                            }
                                        })
                                    : null
                            }
                        })
                    }
                    : null
            }})
        }))
    } else {
        console.log('small', window.visualViewport.width, catalog)
    }
}
            
function createList(list, parent) {
    console.log('list', list)
    const currentList = createElement({
        ...list,
        elements: null
    })
    list.elements.forEach(item => {
        currentList.appendChild(createElement(item))
    })
    return currentList
}

function createElement(inputElement) {
    console.log('create element', inputElement)
    const element = {
        id: inputElement.id || '',
        tag: inputElement.tag || 'div',
        className: inputElement.className || '',
        title: inputElement.title || '',
        link: inputElement.link || '',
        innerElements: inputElement.elements || null,
        onClick: inputElement.click || null
    }
    
    const outputEl = !element.link || element.tag
        ? document.createElement(element.tag)
        : (document.createElement('a'), outputEl.href = element.link)
    outputEl.classList.add(element.className);
    outputEl.onclick = element.onClick;
    outputEl.setAttribute('data-id', element.id)
    
    const title = document.createElement('span');
    title.classList.add(element.className + '-title');
    title.innerText = element.title
    
    outputEl.appendChild(title)
    
    if (element.innerElements && !element.innerElements.length) {
        outputEl.appendChild(createList(element.innerElements))
    } 
    if (element.innerElements && element.innerElements.length) {
        console.log('create inner element')
        element.innerElements.forEach(item => {
            outputEl.appendChild(createElement(item))
        })
    }
    
    return outputEl
}





class DesktopMenu extends List {
    constructor() {
        super()
        
        
    }
}