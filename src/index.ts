class Joke {
    public description: string;
    public score: number;
    public date: string;

    constructor(description: string, score: number, date: string) {
        this.description = description;
        this.score = score;
        this.date = date;
    }
}
class UI {
    // API information
    private apiJokesURL = "https://icanhazdadjoke.com/";
    private apiChuckURL = "https://api.chucknorris.io/jokes/random";
    private apiWeatherURL = "https://api.openweathermap.org/data/2.5/";
    private apiWeatherKEY = "aee177c467100e7458a1fd62845ff423";
    // Barcelona coords
    public bcnLocationLat = 41.390205;
    public bcnLocationLong = 2.154007;
    // DOM Elements
    public elBody = <HTMLElement>document.body;
    public arrayReportJokes: Array<{description: string, score: number, date: string}> = [];
    public elMessage = document.querySelector('#message');
    public elRatingButtonsContainer = <HTMLElement>document.querySelector('#ratingButtonsContainer');
    public elMain = <HTMLElement>document.querySelector('#main');
    public elJokeContainer = <HTMLElement>document.querySelector('#joke-container');
    public elsRatingButtons = document.querySelectorAll('.rateButton');
    public elBtnNextJoke = document.querySelector('#btnNextJoke');
    public elWeatherInfo = <HTMLElement>document.querySelector('#weather-info');
    public elBubble1 = <HTMLElement>document.querySelector('#bubble1');
    public elBubble2 = <HTMLElement>document.querySelector('#bubble2');
    // UI elements
    public imgsPath = "assets/imgs/";
    public arrayBGs = ["blob0.svg", "blob1.svg", "blob2.svg", "blob3.svg", "blob4.svg", "blob5.svg", "blob6.svg", "blob7.svg", "blob8.svg", "blob9.svg"];
    // Methods
    private randomBool():boolean {
        Math.floor(Math.random() * 10);
        return Boolean(Math.floor(Math.random() * 10)%2);
    }
    private randomInt0_9():number {
        return Math.floor(Math.random() * 10);
    }
    public apiNextJoke = () => {
        if(this.randomBool()){
            fetch(`${this.apiChuckURL}`)
            .then(response => response.json())
            .then(joke => {
                this.setJoke(joke.value);
            });
        }else{
            fetch(`${this.apiJokesURL}`,{headers: {'Accept':'application/json'}})
            .then(response => response.json())
            .then(joke => {
                this.setJoke(joke.joke);
            });
        }
    }
    private setJoke(text:string):void {
        let p = document.createElement('p');
        p.appendChild(document.createTextNode(text));
        this.elMessage!.firstChild!.remove();
        this.elMessage!.appendChild(p);
        this.elRatingButtonsContainer!.style.visibility = "visible";
        this.elBtnNextJoke!.setAttribute('disabled','disabled');
        this.changeBubbles();
    }
    private changeBubbles():void {
        console.log(this.imgsPath + this.arrayBGs[this.randomInt0_9()]);
        this.elBubble1.style.backgroundImage = `url("${this.imgsPath}${this.arrayBGs[this.randomInt0_9()]}")`;
        this.elBubble2.style.backgroundImage = `url("${this.imgsPath}${this.arrayBGs[this.randomInt0_9()]}")`;
        this.elBody.style.backgroundImage = `url("${this.imgsPath}${this.arrayBGs[this.randomInt0_9()]}")`;
    }
    public saveRate = (event: any) => {
        let tempScore: number;
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
        let description = this.elMessage!.firstChild!.textContent;
        this.arrayReportJokes.push( new Joke (description!, tempScore,(new Date()).toISOString()) );
        console.log(this.arrayReportJokes);
        this.elRatingButtonsContainer!.style.visibility = "hidden";
        this.elBtnNextJoke!.removeAttribute('disabled');
        return true;
    }
    public getLocation = () => {
        return new Promise<any>( (resolve, reject) => {
            try {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition( (position) => {
                        resolve(position.coords);
                    });
                }else{
                    reject('Navigator do not support geolocation or permission denied.');
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    public fetchWeather = (lat: number = this.bcnLocationLat, lon: number = this.bcnLocationLong) => {
        fetch(`${this.apiWeatherURL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiWeatherKEY}&units=metric`)
        .then(response => response.json())
        .then(data => {
            this.elWeatherInfo!.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].main}"> ${data.name}: ${Math.floor(data.main.temp)}ºC`;
        });
        return true;
    }
}
// UI instance
let ui = new UI();
// DOM ready
document.addEventListener("DOMContentLoaded", function() {
    ui.elWeatherInfo!.innerHTML = `${ui.imgsPath}loading.gif`;
    ui.fetchWeather();
    ui.elJokeContainer.style.backgroundImage = `url('data:image/svg+xml;utf8,${ui.arrayBGs[0]}')`;
    // DOM Events
    ui.elBtnNextJoke!.addEventListener('click',ui.apiNextJoke);
    ui.elsRatingButtons!.forEach( button => {
        button.addEventListener('click',ui.saveRate);
    });
    const tabs = document.querySelectorAll('.tabs');
    tabs.forEach( (tab) => {
        tab.addEventListener('click', (event) => {
            let tabHTML = <HTMLElement>event.target;
            tabs.forEach( (element) => {
                let elementHTML = <HTMLElement>element;
                elementHTML.style.textDecoration = 'none';
            });
            tabHTML.style.textDecoration = 'underline';
            if (tabHTML.innerHTML == "Barcelona") {
                ui.elWeatherInfo!.innerHTML = `<img src="${ui.imgsPath}loading.gif">`;
                ui.fetchWeather();
            } else {
                ui.elWeatherInfo!.innerHTML = `<img src="${ui.imgsPath}loading.gif">`;
                ui.getLocation().then( (geoloc) => {
                    ui.fetchWeather(geoloc.latitude, geoloc.longitude);
                }).catch( (error) => {
                    console.log(error);
                    ui.elWeatherInfo!.innerHTML = error;
                } );
            }
        });
    });
});


/**
l'ús del "!"" perquè TS no es queixi
per què transforma let i const en var si no volem passar a versió antinga de JS??
**/