"use strict";
const apiURL = "https://icanhazdadjoke.com/";
const apiNextJoke = () => {
    fetch(`${apiURL}`, { headers: { 'Accept': 'application/json' } }).then(response => console.log(response));
};
document.querySelector('#btnNextJoke').addEventListener('click', apiNextJoke);
//# sourceMappingURL=index.js.map