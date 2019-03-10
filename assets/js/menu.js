'use strict';
//==================== Пользовательские настройки =============================

const apiUrl = 'catalog.json';

const classPrefix = 'header__catalog' 

//=============================================================================

//======================= Расширенные настройки ===============================
const dropdown = document.querySelector(`.${classPrefix}`);

const catalogLayout = {
    menu: {
        tag: 'ul',
        className: `${classPrefix}-menu`,
    },
    menuItem: {
        tag: 'li',
        className: `${classPrefix}-menu__item`,
    },
    submenu: {
        tag: 'ul',
        className: `${classPrefix}-menu__submenu`, 
    },
    list: {
        tag: 'li',
        className: `${classPrefix}-menu__submenu-item`,
    },
    link: {
        tag: 'a',
        className: `${classPrefix}-menu__submenu-link`
    }
}
//=============================================================================

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
    
    console.log(element.link || element.tag === 'a')
    
    const outputEl = element.link && element.tag === 'a'
        ? document.createElement('a')
        : document.createElement(element.tag)
    
    const classNames = element.className ? element.className.split(' ') : []
    
    classNames.forEach(classTxt => outputEl.classList.add(classTxt))
    outputEl.onclick = element.onClick;
    outputEl.setAttribute('data-id', element.id)
    
    if (element.link && element.tag === 'a') {
        outputEl.href = element.link;
        outputEl.innerText = element.title;
    } else {
        const title = element.link ? document.createElement('a') : document.createElement('span');
        if (element.link) title.href = element.link;
        title.classList.add(classNames.length ? classNames[0] + '-title' : '-title');
        title.innerText = element.title
        outputEl.appendChild(title)
    }
    
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
            currentList.appendChild(createElement({
                ...item, 
                link: item.subgroup && item.subgroup.length ? '' : item.link
            }))
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

class DesktopCatalog {
    constructor(container, cat) {
        this.container = container
        this.heads = cat.heads
        this.subs = cat.subs
        this.links = cat.links
    }
    
    render() {
        this.container.parentNode.appendChild(new Catalog(this.heads, this.subs, this.links).createLvl)
    }
}

class MobileCatalog {
    constructor(container, cat) {
        this.container = container
        this.data = this.createData(cat)
        this.state = 'catalog'
    }
    
    createData = (data) => ({
        catalog: {
            id: 'catalog',
            title: 'Каталог',
            subgroup: Object.keys(data.heads),
        },
        ...data.heads,
        ...data.subs,
        ...data.links
    });

    getDropdown = () => {
        if (!this.data[this.state].subgroup) return {}
        return this.data[this.state].subgroup.reduce((acc, id) => {
            return {
                ...acc,
                [id]: {
                    ...this.data[id],
                    click: () => this.setState(id)
                }
            }
        }, {})
    }
    
    setState = id =>  {
        if (!id) return
        this.state = id;
        this.render()
    }
    
    createControls = () => {
        let backBtn = createElement({
            tag: 'button',
            title: '',
            className: `${classPrefix}-menu-title-btn`,
            childEl: createElement({
                tag: 'i',
                className: 'fal fa-caret-left' 
            }),
            click: () => this.setState(this.data[this.state].parent)
        })
        let currentGroupTitle = createElement({
            tag: 'span',
            title: this.data[this.state].title,
            click: null
        })
        let closeBtn = createElement({
            tag: 'button',
            title: '',
            className: `${classPrefix}-menu-title-btn`,
            childEl: createElement({
                tag: 'i',
                className: 'fal fa-times' 
            }),
            click: () => {
                this.setState('catalog')
                dropdown.classList.remove('active')
            }
        })
        return [backBtn, currentGroupTitle, closeBtn]
    }
        
    render = () => {
        document.querySelector('.header__catalog-menu') 
            && document.querySelector('.header__catalog-menu').remove()
        this.container.parentNode.appendChild(new Catalog(this.getDropdown()).createLvl)
        this.createControls().forEach(node => {
            document.querySelector('.header__catalog-menu-title').appendChild(node)
        })
    }
}

let menuData = '';
let flagDesktopSize = false;

fetch(apiUrl)
    .then(res => res.json())
    .then(response => menuData = normalizeData(response))
    .then(() => createCatalog(menuData))
    .catch(error => {
        menuData = normalizeData(initCatalog)
        return createCatalog(menuData)
    })

function createCatalog(catalog) {
    if (!catalog) return setTimeout(() => createCatalog(menuData), 1000);
    
    console.log(catalog)
    
    if (window.innerWidth >= 768) {
        flagDesktopSize = true;
        document.querySelector(`.${catalogLayout.menu.className}`) 
            && document.querySelector(`.${catalogLayout.menu.className}`).remove()
        new DesktopCatalog(dropdown, catalog).render()
    } else {
        flagDesktopSize = false;
        document.querySelector(`.${catalogLayout.menu.className}`) 
            && document.querySelector(`.${catalogLayout.menu.className}`).remove()
        new MobileCatalog(dropdown, catalog).render()
    }
}
            
window.onresize = () => (window.innerWidth >= 768)
                            ? !flagDesktopSize && createCatalog(menuData) 
                            : flagDesktopSize && createCatalog(menuData)