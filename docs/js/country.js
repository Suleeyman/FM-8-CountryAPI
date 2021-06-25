import { getUniqueCountry } from "./modules/getCountry.js";

const title = document.querySelector('title')
const theme = document.querySelector('input[id="theme-switcher"]')
const body = document.querySelector('body')

class App {
    
    constructor() {
        this._currentCountry = localStorage.getItem('countryName')
        this._getLocalStorage()
        getUniqueCountry(this._currentCountry).then(data => this._insertInTheDom(data)) 

        theme.addEventListener('click', this._setLocalStorage)
        

    }

    _getLocalStorage() {
        const currentTheme = localStorage.getItem('theme')
        if(currentTheme) {
            document.documentElement.setAttribute('data-theme', currentTheme)
        
            if(currentTheme === "dark") {
                theme.nextElementSibling.src = "./svg/dark-mode.svg";
                theme.nextElementSibling.nextElementSibling.textContent = "Light mode"
                theme.checked = true
            }
        }
    }

    _setLocalStorage() {
        document.documentElement.setAttribute('data-theme', `${theme.checked ? 'dark' : 'light'}`)
        theme.nextElementSibling.src = `./svg/${theme.checked ? 'dark' : 'light'}-mode.svg`
        theme.nextElementSibling.nextElementSibling.textContent = `${theme.checked ? 'Light' : 'Dark'} mode`;
        localStorage.setItem('theme', `${theme.checked ? 'dark' : 'light'}`)
    }

    _insertInTheDom(data) {
        title.textContent = this._currentCountry
        const html = `
            <figure>
            <img src="${data[0].flag}" alt="Flag of ${data[0].name}">
            <figcaption>
                <h3>${data[0].name}</h3>
                <ul class="details">
                    <li>
                        <u>Native Name:</u>
                        <span> ${data[0].nativeName}</span>
                    </li>
                    <li>
                        <u>Population:</u>
                        <span> ${new Intl.NumberFormat('en-GB').format(data[0].population)}</span>
                    </li>
                    <li>
                        <u>Region:</u>
                        <span> ${data[0].region}</span>
                    </li>
                    <li>
                        <u>Sub Region:</u>
                        <span> ${data[0].subregion}</span>
                    </li>
                    <li>
                        <u>Capital:</u>
                        <span> ${data[0].capital}</span>
                    </li>
                    <li>
                        <u>Top Level Domain:</u>
                        <span> ${data[0].topLevelDomain.join(' ')}</span>
                    </li>
                    <li>
                        <u>Currencies:</u>
                        <span> ${data[0].currencies[0].name}</span>
                    </li>
                    <li>
                        <u>Languages:</u>
                        <span> ${data[0].languages.reduce( (a,b) => {
                            return a += b.name + ', '
                        }, '').slice(0, -2)}
                        </span>
                    </li>
                </ul>
                <aside>
                    <h4>Border Countries:</h4>
                    <ul>${this._createLiElement([...data[0].borders])}</ul>
                </aside>
            </figcaption>
        </figure>
        `
        body.insertAdjacentHTML('beforeend', html)
    }

    _createLiElement(lis) {
        let strLi = ''
        lis.forEach(li => {
            strLi += `<li>${li}</li>` 
        })
        return strLi
    }

}

const app = new App()