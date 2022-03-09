"use strict";
class Joke {
    constructor(description, score, date) {
        this.description = description;
        this.score = score;
        this.date = date;
    }
}
class UI {
    constructor() {
        // API information
        this.apiJokesURL = "https://icanhazdadjoke.com/";
        this.apiChuckURL = "https://api.chucknorris.io/jokes/random";
        this.apiWeatherURL = "https://api.openweathermap.org/data/2.5/";
        this.apiWeatherKEY = "aee177c467100e7458a1fd62845ff423";
        // Barcelona coords
        this.bcnLocationLat = 41.390205;
        this.bcnLocationLong = 2.154007;
        // DOM Elements
        this.elBody = document.body;
        this.arrayReportJokes = [];
        this.elMessage = document.querySelector('#message');
        this.elRatingButtonsContainer = document.querySelector('#ratingButtonsContainer');
        this.elMain = document.querySelector('#main');
        this.elJokeContainer = document.querySelector('#joke-container');
        this.elsRatingButtons = document.querySelectorAll('.rateButton');
        this.elBtnNextJoke = document.querySelector('#btnNextJoke');
        this.elWeatherInfo = document.querySelector('#weather-info');
        this.elBubble1 = document.querySelector('#bubble1');
        this.elBubble2 = document.querySelector('#bubble2');
        // UI elements
        this.imgsPath = "assets/imgs/";
        this.arrayBGs = ["blob0.svg", "blob1.svg", "blob2.svg", "blob3.svg", "blob4.svg", "blob5.svg", "blob6.svg", "blob7.svg", "blob8.svg", "blob9.svg"];
        this.apiNextJoke = () => {
            if (this.randomBool()) {
                fetch(`${this.apiChuckURL}`)
                    .then(response => response.json())
                    .then(joke => {
                    this.setJoke(joke.value);
                });
            }
            else {
                fetch(`${this.apiJokesURL}`, { headers: { 'Accept': 'application/json' } })
                    .then(response => response.json())
                    .then(joke => {
                    this.setJoke(joke.joke);
                });
            }
        };
        this.saveRate = (event) => {
            let tempScore;
            switch (event.target.innerHTML) {
                case ': (':
                    tempScore = 1;
                    break;
                case ': |':
                    tempScore = 2;
                    break;
                case ': )':
                    tempScore = 3;
                    break;
                default:
                    return false;
            }
            let description = this.elMessage.firstChild.textContent;
            this.arrayReportJokes.push(new Joke(description, tempScore, (new Date()).toISOString()));
            console.log(this.arrayReportJokes);
            this.elRatingButtonsContainer.style.visibility = "hidden";
            this.elBtnNextJoke.removeAttribute('disabled');
            return true;
        };
        this.getLocation = () => {
            return new Promise((resolve, reject) => {
                try {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((position) => {
                            resolve(position.coords);
                        });
                    }
                    else {
                        reject('Navigator do not support geolocation or permission denied.');
                    }
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.fetchWeather = (lat = this.bcnLocationLat, lon = this.bcnLocationLong) => {
            fetch(`${this.apiWeatherURL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiWeatherKEY}&units=metric`)
                .then(response => response.json())
                .then(data => {
                this.elWeatherInfo.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].main}"> ${data.name}: ${Math.floor(data.main.temp)}ºC`;
            });
            return true;
        };
    }
    // Methods
    randomBool() {
        Math.floor(Math.random() * 10);
        return Boolean(Math.floor(Math.random() * 10) % 2);
    }
    randomInt0_9() {
        return Math.floor(Math.random() * 10);
    }
    setJoke(text) {
        let p = document.createElement('p');
        p.appendChild(document.createTextNode(text));
        this.elMessage.firstChild.remove();
        this.elMessage.appendChild(p);
        this.elRatingButtonsContainer.style.visibility = "visible";
        this.elBtnNextJoke.setAttribute('disabled', 'disabled');
        this.changeBubbles();
    }
    changeBubbles() {
        console.log(this.imgsPath + this.arrayBGs[this.randomInt0_9()]);
        this.elBubble1.style.backgroundImage = `url("${this.imgsPath}${this.arrayBGs[this.randomInt0_9()]}")`;
        this.elBubble2.style.backgroundImage = `url("${this.imgsPath}${this.arrayBGs[this.randomInt0_9()]}")`;
        this.elBody.style.backgroundImage = `url("${this.imgsPath}${this.arrayBGs[this.randomInt0_9()]}")`;
    }
}
// UI instance
let ui = new UI();
// DOM ready
document.addEventListener("DOMContentLoaded", function () {
    ui.elWeatherInfo.innerHTML = `${ui.imgsPath}loading.gif`;
    ui.fetchWeather();
    ui.elJokeContainer.style.backgroundImage = `url('data:image/svg+xml;utf8,${ui.arrayBGs[0]}')`;
    // DOM Events
    ui.elBtnNextJoke.addEventListener('click', ui.apiNextJoke);
    ui.elsRatingButtons.forEach(button => {
        button.addEventListener('click', ui.saveRate);
    });
    const tabs = document.querySelectorAll('.tabs');
    tabs.forEach((tab) => {
        tab.addEventListener('click', (event) => {
            let tabHTML = event.target;
            tabs.forEach((element) => {
                let elementHTML = element;
                elementHTML.style.textDecoration = 'none';
            });
            tabHTML.style.textDecoration = 'underline';
            if (tabHTML.innerHTML == "Barcelona") {
                ui.elWeatherInfo.innerHTML = `<img src="${ui.imgsPath}loading.gif">`;
                ui.fetchWeather();
            }
            else {
                ui.elWeatherInfo.innerHTML = `<img src="${ui.imgsPath}loading.gif">`;
                ui.getLocation().then((geoloc) => {
                    ui.fetchWeather(geoloc.latitude, geoloc.longitude);
                }).catch((error) => {
                    console.log(error);
                    ui.elWeatherInfo.innerHTML = error;
                });
            }
        });
    });
});
/**
l'ús del "!"" perquè TS no es queixi
per què transforma let i const en var si no volem passar a versió antinga de JS??
**/ 
//# sourceMappingURL=index.js.map