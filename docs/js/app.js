'use strict'

import { getUniqueCountry } from "./modules/getCountry.js";

const inputContent = document.querySelector('.input-content')
const inputText = document.querySelector('input[id=country]')
const reset = document.querySelector('button[type=reset]')
const theme = document.querySelector('input[id=theme-switcher]')
const glass = document.querySelector('.glass-icon')
const form = document.querySelector('form')
const select = document.querySelector('select')
const footer = document.querySelector('footer')
const countries = document.querySelector('.countries')

class App {
    
    constructor() {
        this._html = '';
        this._i = 0;
        this._numberOfScroll = 1;
        this._base = Math.trunc((document.documentElement.clientHeight - 80 - 48)/ 400 * 4) || 5;
        this._observing = 1; // 0 If unobserving; 1 If observing all countries; 2 If observing a region; 3 if observing an unique country
        this._options = {
            root: null,
            rootMargins: "0px",
            threshold: 0.5,
        };
        this._observer = new IntersectionObserver(this._isInterescting.bind(this), this._options);

        this._observer.observe(footer)
        this._getLocalStorage()
        this._getAllCountries()

        theme.addEventListener('click', this._setLocalStorage)
        inputContent.addEventListener('click', () => inputText.focus())
        form.addEventListener('submit', this._getFormSubmit.bind(this))
        select.addEventListener('change', this._changeSelectInput.bind(this))
        reset.addEventListener('click', this._resetButtonClicked.bind(this))
        countries.addEventListener('click', this._setCountryNameToStorage)
    }

    _getLocalStorage() {
        const currentTheme = localStorage.getItem('theme')

        if(currentTheme) { // equivalent à currentTheme !== undefined
            document.documentElement.setAttribute('data-theme', currentTheme);
    
            if(currentTheme === "dark") {
                theme.checked = true
                theme.nextElementSibling.src = "././svg/dark-mode.svg"
                theme.nextElementSibling.nextElementSibling.textContent = "Light mode";
                glass.src = "./svg/dark-glass.svg"
            }
        }
    }

    _setLocalStorage() {
        document.documentElement.setAttribute('data-theme', `${theme.checked ? 'dark' : 'light'}`)
        theme.nextElementSibling.src = `./svg/${theme.checked ? 'dark' : 'light'}-mode.svg`
        theme.nextElementSibling.nextElementSibling.textContent = `${theme.checked ? 'Light' : 'Dark'} mode`;
        glass.src = `./svg/${theme.checked ? 'dark' : 'light'}-glass.svg`
        localStorage.setItem('theme', `${theme.checked ? 'dark' : 'light'}`)
    }

    _getFormSubmit(e) {
        e.preventDefault()
        this._resetTheDom()
        this._observing = 0
        this._displayUniqueCountry(inputText.value.trim())
        inputText.value = ""
        inputText.focus()
    }

    _changeSelectInput() {
        this._resetTheDom()
        this._observing = 2
        if(select.value === "default") {
            this._getAllCountries()
            this._observing = 1
            return;   
        }
        this._getCountriesRegion(select.value)
    }

    _setCountryNameToStorage(e) {
        const currentCountry = e.target.closest('figure')
        if(currentCountry) {
            const currentCountryName = currentCountry.dataset.name
            localStorage.setItem('countryName', currentCountryName)
            window.open('./country.html', '_self');
        }
    }

    _isInterescting(entries) {
        if (entries[0].isIntersecting) {
        
            if(this._observing === 0) {
                return;
            } else if(this._observing === 1) {
                this._getAllCountries()
            } else if (this._observing === 2) {
                this._getCountriesRegion(select.value)
            } else if (this._observing === 3) {
                this._getUniqueCountry()
            }

        }
    }

    _displayUniqueCountry(name) {
        getUniqueCountry(name)
            .then(data => {
                return this._insertInTheDom(data)
            })
    }

    async _getCountriesRegion(region) {
        try {
            const resp = await fetch(`https://restcountries.com/v3.1/region/${region}`);
            const data = await resp.json()
            this._insertInTheDom(data);
            this._i < data.length ? this._numberOfScroll++ : this._observing = 0;
        } catch(err) {
            console.log(err)
        }
    }

    async _getAllCountries() {
        try {
            const resp = await fetch('https://restcountries.com/v3.1/all');
            const data = await resp.json()
            // console.log(data);
            this._insertInTheDom(data);
            this._i < data.length ? this._numberOfScroll++ : this._observing = 0;
        } catch(err) {
            console.log(err);
        }
    }

    _insertInTheDom(obj) {
        for(; this._i < this._base * this._numberOfScroll && this._i < obj.length; this._i++) {
            this._html =
                `
                <figure data-name="${obj[this._i].name.official}">
                    <img src="${obj[this._i].flags.svg}" alt="Flag of: ${obj[this._i].name.official}">
                    <figcaption>
                        <h3 class="country-name">${obj[this._i].name.common}</h3>
                        <ul>
                            <li>
                                <u>Population:</u>
                                <span class="population">${new Intl.NumberFormat('en-GB').format(obj[this._i].population)}</span>
                            </li>
                            <li>
                                <u>Region:</u>
                                <span class="region">${obj[this._i].region}</span>
                            </li>
                            <li>
                                <u>Capital:</u>
                                <span class="capital">${obj[this._i].capital}</span>
                            </li>
                        </ul>
                    </figcaption>
                </figure>
                `
            countries.insertAdjacentHTML('beforeend', this._html);
        }
    }

    _resetButtonClicked() {
        this._resetTheDom()
        this._observing = 1
        this._getAllCountries()
    }

    _resetTheDom() {
        this._i = 0, this._numberOfScroll = 1;
        let n = countries.children.length;
        for(let i = 0; i < n; i++) {
            countries.children[0].remove()
        }
    }

}

const app = new App()