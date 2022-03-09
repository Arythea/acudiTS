var Joke = /** @class */ (function () {
    function Joke(description, score, date) {
        this.description = description;
        this.score = score;
        this.date = date;
    }
    return Joke;
}());
var UI = /** @class */ (function () {
    function UI() {
        var _this = this;
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
        this.apiNextJoke = function () {
            if (_this.randomBool()) {
                fetch("".concat(_this.apiChuckURL))
                    .then(function (response) { return response.json(); })
                    .then(function (joke) {
                    _this.setJoke(joke.value);
                });
            }
            else {
                fetch("".concat(_this.apiJokesURL), { headers: { 'Accept': 'application/json' } })
                    .then(function (response) { return response.json(); })
                    .then(function (joke) {
                    _this.setJoke(joke.joke);
                });
            }
        };
        this.saveRate = function (event) {
            var tempScore;
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
            var description = _this.elMessage.firstChild.textContent;
            _this.arrayReportJokes.push(new Joke(description, tempScore, (new Date()).toISOString()));
            console.log(_this.arrayReportJokes);
            _this.elRatingButtonsContainer.style.visibility = "hidden";
            _this.elBtnNextJoke.removeAttribute('disabled');
            return true;
        };
        this.getLocation = function () {
            return new Promise(function (resolve, reject) {
                try {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (position) {
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
        this.fetchWeather = function (lat, lon) {
            if (lat === void 0) { lat = _this.bcnLocationLat; }
            if (lon === void 0) { lon = _this.bcnLocationLong; }
            fetch("".concat(_this.apiWeatherURL, "/weather?lat=").concat(lat, "&lon=").concat(lon, "&appid=").concat(_this.apiWeatherKEY, "&units=metric"))
                .then(function (response) { return response.json(); })
                .then(function (data) {
                _this.elWeatherInfo.innerHTML = "<img src=\"https://openweathermap.org/img/wn/".concat(data.weather[0].icon, ".png\" alt=\"").concat(data.weather[0].main, "\"> ").concat(data.name, ": ").concat(Math.floor(data.main.temp), "\u00BAC");
            });
            return true;
        };
    }
    // Methods
    UI.prototype.randomBool = function () {
        Math.floor(Math.random() * 10);
        return Boolean(Math.floor(Math.random() * 10) % 2);
    };
    UI.prototype.randomInt0_9 = function () {
        return Math.floor(Math.random() * 10);
    };
    UI.prototype.setJoke = function (text) {
        var p = document.createElement('p');
        p.appendChild(document.createTextNode(text));
        this.elMessage.firstChild.remove();
        this.elMessage.appendChild(p);
        this.elRatingButtonsContainer.style.visibility = "visible";
        this.elBtnNextJoke.setAttribute('disabled', 'disabled');
        this.changeBubbles();
    };
    UI.prototype.changeBubbles = function () {
        console.log(this.imgsPath + this.arrayBGs[this.randomInt0_9()]);
        this.elBubble1.style.backgroundImage = "url(\"".concat(this.imgsPath).concat(this.arrayBGs[this.randomInt0_9()], "\")");
        this.elBubble2.style.backgroundImage = "url(\"".concat(this.imgsPath).concat(this.arrayBGs[this.randomInt0_9()], "\")");
        this.elBody.style.backgroundImage = "url(\"".concat(this.imgsPath).concat(this.arrayBGs[this.randomInt0_9()], "\")");
    };
    return UI;
}());
// UI instance
var ui = new UI();
// DOM ready
document.addEventListener("DOMContentLoaded", function () {
    ui.elWeatherInfo.innerHTML = "".concat(ui.imgsPath, "loading.gif");
    ui.fetchWeather();
    ui.elJokeContainer.style.backgroundImage = "url('data:image/svg+xml;utf8,".concat(ui.arrayBGs[0], "')");
    // DOM Events
    ui.elBtnNextJoke.addEventListener('click', ui.apiNextJoke);
    ui.elsRatingButtons.forEach(function (button) {
        button.addEventListener('click', ui.saveRate);
    });
    var tabs = document.querySelectorAll('.tabs');
    tabs.forEach(function (tab) {
        tab.addEventListener('click', function (event) {
            var tabHTML = event.target;
            tabs.forEach(function (element) {
                var elementHTML = element;
                elementHTML.style.textDecoration = 'none';
            });
            tabHTML.style.textDecoration = 'underline';
            if (tabHTML.innerHTML == "Barcelona") {
                ui.elWeatherInfo.innerHTML = "<img src=\"".concat(ui.imgsPath, "loading.gif\">");
                ui.fetchWeather();
            }
            else {
                ui.elWeatherInfo.innerHTML = "<img src=\"".concat(ui.imgsPath, "loading.gif\">");
                ui.getLocation().then(function (geoloc) {
                    ui.fetchWeather(geoloc.latitude, geoloc.longitude);
                })["catch"](function (error) {
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
