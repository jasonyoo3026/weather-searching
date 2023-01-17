const searchBtn = document.getElementById('search-btn');
const cityRef = document.getElementById('city');
const tempRef = document.getElementById('temp');
const windRef = document.getElementById('wind');
const humRef = document.getElementById('humidity');


searchBtn.addEventListener('click', getWeather);


function getWeather() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    console.log(searchInputTxt);
    saveSearchHistory(searchInputTxt);
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchInputTxt}&appid=cd245a7bcbb6501c4566a2d7163d25d6`)
    .then(response=>response.json())
    .then(data => {
        let date = new Date().toLocaleDateString();
        let city = `
        <div class="weather-icon">
            <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" />
        </div>
        `;
        cityRef.innerHTML = data.name + " ("+date+")" + city;
        tempRef.innerHTML = "Temp: "+ data.main.temp +"K";
        windRef.innerHTML = "Wind: "+ data.wind.speed +"MPH";
        humRef.innerHTML = "Humidity: "+ data.main.humidity +"%";
        return data.coord;
    })
    .then(coord => {
        // console.log(coord);
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=5e3509d2b9be85cca01541d79d6c8018`)
        .then(response=>response.json())
        .then(data => data.list)
        .then(data => {
            var i = 1;
            let r = [1,2,3,4,5];
            r.forEach(index => {
                let forecast = data[(index*8)-1];
                // console.log(forecast);
                // change date
                let dateRef = document.getElementById('date-'+i);
                var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                d.setUTCSeconds(forecast.dt);
                let icon = `
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/w/${forecast.weather[0].icon}.png" />
                </div>
                `;
                dateRef.innerHTML = d.toLocaleDateString() + icon;
                // change temp
                let tempRef = document.getElementById('temp-'+i);
                tempRef.innerHTML = "Temp: "+ forecast.main.temp +"K";
                // change wind
                let windRef = document.getElementById('wind-'+i);
                windRef.innerHTML = "Wind: "+ forecast.wind.speed +"MPH";
                // change Humidity
                let humRef = document.getElementById('humidity-'+i);
                humRef.innerHTML = "Humidity: "+ forecast.main.humidity +"%";
                i++;
            })
        })
        
    });
}

//Search history
function getSearchHistory() {
    var searchHistory = localStorage.getItem("searchHistory");
    searchHistory = (searchHistory) ? JSON.parse(searchHistory) : [];
    console.log(searchHistory);
    return searchHistory;
}

function saveSearchHistory(keyword) {
    var searchHistory = getSearchHistory();
    if(!searchHistory.includes(keyword)){
        searchHistory.push(keyword);    
    }
    console.log(searchHistory);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    displaySearchHistory();
}

function displaySearchHistory() {
    var searchHistory = getSearchHistory();
    let historyRef = document.getElementById('history');
    let html = ""
    searchHistory.forEach(history => {
        html += `
        <div>
            <button class="city-name-list" id=${history} onclick="historyClick(${history})">${history}</button>
        </div>
        `;
        // document.getElementById(history).addEventListener('click', test);
    })
    historyRef.innerHTML = html;
}

function historyClick(keyword){
    console.log(keyword.id);
    document.getElementById('search-input').value = keyword.id;
    getWeather();
}


// function checkLocalStorage() {
//     var element = document.getElementById("hidden-element");
//     if (!localStorage.getItem("searchHistory")) {
//         element.style.visibility = "hidden";
//     } else {
//         element.style.visibility = "visible";
//     }
// }