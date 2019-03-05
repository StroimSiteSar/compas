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

const normalizeData = data => {
    let parsed = {
        heads: {},
        subs: {},
        links: {}
    }

    data.forEach(item => parsed.heads[item.id] = {...item, parent: 'catalog'})

    function letsParse(from, to){
        Object.keys(parsed[from]).forEach(headId => {
        return parsed[from][headId].subgroup 
            ? (
                parsed[from][headId].subgroup.forEach(item => parsed[to][item.id] = {...item, parent: headId}),
                parsed[from][headId].subgroup = parsed[from][headId].subgroup.map(item => item.id)
            )
            : null 
        })
    }

    letsParse('heads', 'subs')
    letsParse('subs', 'links')

    return parsed
}

function createElement(inputElement) {
    const element = {
        id: inputElement.id || '',
        tag: inputElement.tag || 'div',
        className: inputElement.className || 'empty',
        title: inputElement.title || '',
        link: inputElement.link || '',
        childEl: inputElement.childEl || null,
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
    
    if (element.childEl) outputEl.appendChild(element.childEl)
    
    return outputEl
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
            ...this.list
        })
        this.list.elements.forEach(item => {
            currentList.appendChild(createElement({...item}))
        })
        return currentList
    }
}

class SubCatalog {
    constructor(lvl2, lvl3) {
        this.lvl2 = lvl2
        this.lvl3 = lvl3
    }
    
    get createGroups() {
        return new List({
            ...catalogLayout.submenu,
            elements: Object.values(this.lvl2).map(item => (
                {
                    ...catalogLayout.list,
                    ...item,
                    childEl: item.subgroup && this.lvl3 ? new List({elements: this.getMap(item.subgroup, this.lvl3)}).createList() : null
                }
            ))
        }).createList()
    }
    
    getMap = (ids, data) => {
        return ids.map(id => ({...catalogLayout.link, ...data[id]}))
    }
}

class Catalog {
    constructor(lvl1, lvl2 = null, lvl3 = null) {
        this.list = lvl1
        this.lvl2 = lvl2
        this.lvl3 = lvl3
    }
    
    get createLvl() {
        return new List({
            ...catalogLayout.menu,
            elements: Object.values(this.list).map(item => (
                {
                    ...catalogLayout.menuItem,
                    ...item,
                    childEl: item.subgroup && this.lvl2 
                        ? new SubCatalog(this.getObject(item.subgroup, this.lvl2), this.lvl3).createGroups 
                        : null
                }
            ))
        }).createList()
    }
    
    getObject = (ids, data) => {
        return ids.reduce((acc, item) => {
            return {
                ...acc,
                [item]: data[item]
            }
        }, {})
    }
}

let menuData = '';

fetch("catalog.json")
    .then(res => res.json())
    .then(response => menuData = normalizeData(response))
    .then(() => createCatalog(menuData))
    .catch(error => {
        menuData = normalizeData(initCatalog)
        return createCatalog(menuData)
    })

function createCatalog(catalog) {
    if (!catalog) return setTimeout(() => {createCatalog(menuData)}, 1000);
    
    let dropdown = document.querySelector('.header__catalog');

    let DesktopCatalog = new Catalog(catalog.heads, catalog.subs, catalog.links)
    let MobileCatalog = new Catalog(catalog.heads)
    
    console.log(DesktopCatalog.createLvl)
    
    
    if (window.matchMedia("(min-width: 992px)").matches) {
        dropdown.parentNode.appendChild(DesktopCatalog.createLvl)
    } else {
        dropdown.parentNode.appendChild(MobileCatalog.createLvl)
    }
}
            
window.onresize = () => createCatalog(menuData);