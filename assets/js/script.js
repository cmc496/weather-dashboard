var searchBtn = document.querySelector("#search");

var searchedCities = document.querySelector("#searched");

var dayZero = document.querySelector("#day-zero");
dayZero.classList.add("rounded", "card");

var forecast = document.querySelector("#weather-cards");

var cityHistory = JSON.parse(localStorage.getItem('cities')) || [];

var dayZeroWeather = [];

function search() {
    searchWeather();
};

var searchWeather = function() {
    resetCity(searchedCities);

    if (cityHistory) {
        var listCity = document.createElement("ul");
        listCity.classList.add("list-unstyled", "w-100");
    
        for (var i = 0; i < cityHistory.length; i++) {
            var listCityEl = document.createElement("li");
            listCityEl.innerHTML = "<button type='button' class='list-group-item list-group-item-action' attr='"+cityHistory[i]+"'>" + cityHistory[i] + "</button>";
            listCity.appendChild(listCityEl);
        }

        searchedCities.appendChild(listCity); 
    }
};

$(document).on("click", ".list-group-item", function(event) {
    event.preventDefault();
    var city = $(this).attr("attr");
    call(city);
});

var resetCity = function(element) {
    element.innerHTML = "";
};


var UV = function(uv) {
    var uvI = parseFloat(uv);
    var uvBackground;

    if (uvI < 4) {
        uvBackground = "bg-success";
    }
    else if (uvI < 8) {
        uvBackground = "bg-warning";
    }
    else if (uvI >= 8) {
        uvBackground = "bg-danger";
    }
    else {
        uvBackground = "bg-dark";
    }
    return uvBackground;
};

var dayZeroSearch = function (city, uv) {
    resetCity(dayZero);
    resetCity(forecast);

    // Displayed city
    var displayedCity = document.createElement("div");
    displayedCity.classList.add("col-6", "mt-3");

    var displayedImg = document.createElement("div");
    displayedImg.classList.add("col-6");

    var displayedCityText = document.createElement("h2");
    displayedCityText.textContent = city + " (" + dayZeroWeather[0].dateT + ")";

    var img = document.createElement("img");
    img.setAttribute("src", dayZeroWeather[0].icon);
    console.log(dayZeroWeather[0].icon);

    displayedCity.appendChild(displayedCityText);
    displayedImg.appendChild(img);

    var weather = document.createElement("div");
    weather.classList.add("col-12");
    weather.innerHTML = "<p> Temperature: " + dayZeroWeather[0].temp + "°F" + "</p>" +
                             "<p> Humidity: " + dayZeroWeather[0].humidity + "% </p>" +
                             "<p> Wind Speed: " + dayZeroWeather[0].speed + " MPH </p>" +
                             "<p>UV index: <span class='text-white "+ UV(uv) + "'>" + uv + "</span></p>";

    dayZero.appendChild(displayedCity);
    dayZero.appendChild(displayedImg);
    dayZero.appendChild(weather);

    var nextFive = document.createElement("div");
    nextFive.classList.add("row");
    nextFive.classList.add("col-12");

    var forecastTitle = document.createElement("div");
    forecastTitle.classList.add("col-12");
    forecastTitle.innerHTML = "<h2> 5 Day Forecast </h2>";

    nextFive.appendChild(forecastTitle);
    forecast.appendChild(nextFive);

    var nextFiveCards = document.createElement("div");
    nextFiveCards.classList.add("d-flex");

    for (var i = 1; i < dayZeroWeather.length; i++) {

        var cards = document.createElement("div");
        cards.classList.add("card", "rounded", "mr-2", "flex-fill");

        var cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        var cardTitle = document.createElement("h6");
        cardTitle.classList.add("card-title");

        var forecastImg = document.createElement("img");
        cardTitle.textContent = dayZeroWeather[i].dateT;
        forecastImg.setAttribute("src", dayZeroWeather[i].icon); 

        var cardText1 = document.createElement("p");
        var cardText2 = document.createElement("p");
        var cardText3 = document.createElement("p");
        cardText1.classList.add("small");
        cardText1.textContent = " Temperature: " + dayZeroWeather[i].temp + " °F";
        cardText2.classList.add("small");
        cardText2.textContent = "Humidity: " + dayZeroWeather[i].humidity + "%";
        cardText3.classList.add("small");
        cardText3.textContent = "Wind: " + dayZeroWeather[i].speed + " MPH";
        
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(forecastImg);
        cardBody.appendChild(cardText1);
        cardBody.appendChild(cardText2);
        cardBody.appendChild(cardText3);
        cards.appendChild(cardBody);
        nextFiveCards.appendChild(cards);
    }

    forecast.appendChild(nextFiveCards);
};

// Sends city to local storage
var saved = function (city) {
    var flag = false
    if (cityHistory) {
        for (var i = 0; i < cityHistory.length; i++) {
            if (cityHistory[i] === city) {
                flag = true;
            }
        }
    }
    if (!flag) {
        cityHistory.push(city);
        localStorage.setItem("cities", JSON.stringify(cityHistory));
    }

    searchWeather();
};

var searchDate = function (str) {
    var hour = str.split(" ")[1].split(":")[0];
    var flag = false;
    
    if(hour === "09"){
        flag = true;
    }        
    
    return flag;
};

// Date formatting
var date = function (date) {
    var newDate = date.split(" ")[0].split("-");
    return (newDate[1] + "/" + newDate[2] + "/" + newDate[0]);
};

var dataObject = function (list, position) {

    if (dayZeroWeather.length) {
        dayZeroWeather = [];
    }

    var object = {
        dateT: date(list[0].dt_txt),
        humidity: list[0].main.humidity,
        speed: list[0].wind.speed,
        temp: list[0].main.temp,
        icon: "http://openweathermap.org/img/wn/" + list[0].weather[0].icon + ".png",
        lat: position.lat,
        lon: position.lon 
    };

    dayZeroWeather.push(object);
    
    for(var i = 1; i < list.length; i++) {
        

        if(searchDate(list[i].dt_txt)) {
            object = {
                dateT : date(list[i].dt_txt),
                humidity : list[i].main.humidity,
                speed: list[i].wind.speed,
                temp: list[i].main.temp,
                icon : "http://openweathermap.org/img/wn/" + list[i].weather[0].icon + ".png",
                lat : position.lat,
                lon: position.lon
            };

            dayZeroWeather.push(object);
        }
    }
    var imgChecker = function() {
        if (dayZeroWeather[0].icon == "http://openweathermap.org/img/wn/01d.png") {
            header.classList.remove("auto", "snowy", "rainy", "night");
            header.classList.add("sunny");
        }
        else if (dayZeroWeather[0].icon == "http://openweathermap.org/img/wn/01n.png") {
            header.classList.remove("auto", "snowy", "rainy", "sunny");
            header.classList.add("night");
        }
        else if (dayZeroWeather[0].icon == "http://openweathermap.org/img/wn/09d.png") {
            header.classList.remove("auto", "snowy", "sunny", "night");
            header.classList.add("rainy");
        }
        else if (dayZeroWeather[0].icon == "http://openweathermap.org/img/wn/09n.png") {
            header.classList.remove("auto", "snowy", "sunny", "night");
            header.classList.add("rainy");
        }
        else if (dayZeroWeather[0].icon == "http://openweathermap.org/img/wn/10d.png") {
            header.classList.remove("auto", "snowy", "sunny", "night");
            header.classList.add("rainy");
        }
        else if (dayZeroWeather[0].icon == "http://openweathermap.org/img/wn/10n.png") {
            header.classList.remove("auto", "snowy", "sunny", "night");
            header.classList.add("rainy");
        }
        else if (dayZeroWeather[0].icon == "http://openweathermap.org/img/wn/13d.png") {
            header.classList.remove("auto", "rainy", "sunny", "night");
            header.classList.add("snowy");
        }
        else if (dayZeroWeather[0].icon == "http://openweathermap.org/img/wn/13n.png") {
            header.classList.remove("auto", "rainy", "sunny", "night");
            header.classList.add("snowy");
        }
        else {
            header.classList.remove("rainy", "snowy", "sunny", "night");
            header.classList.add("auto");
        }
    }
    var btnChecker = function() {
        if (dayZeroWeather[0].icon == "http://openweathermap.org/img/wn/01d.png") {
            searchBtn.classList.remove("auto-btn", "snowy-btn", "rainy-btn", "night-btn");
            searchBtn.classList.add("sunny-btn");
        }
        else if (dayZeroWeather[0].icon == "http://openweathermap.org/img/wn/01n.png") {
            searchBtn.classList.remove("auto-btn", "snowy-btn", "rainy-btn", "sunny-btn");
            searchBtn.classList.add("night-btn");
        }
        else if (dayZeroWeather[0].icon == "http://openweathermap.org/img/wn/09d.png") {
            searchBtn.classList.remove("auto-btn", "snowy-btn", "sunny-btn", "night-btn");
            searchBtn.classList.add("rainy-btn");
        }
        else if (dayZeroWeather[0].icon == "http://openweathermap.org/img/wn/09n.png") {
            searchBtn.classList.remove("auto-btn", "snowy-btn", "sunny-btn", "night-btn");
            searchBtn.classList.add("rainy-btn");
        }
        else if (dayZeroWeather[0].icon == "http://openweathermap.org/img/wn/10d.png") {
            searchBtn.classList.remove("auto-btn", "snowy-btn", "sunny-btn", "night-btn");
            searchBtn.classList.add("rainy-btn");
        }
        else if (dayZeroWeather[0].icon == "http://openweathermap.org/img/wn/10n.png") {
            searchBtn.classList.remove("auto-btn", "snowy-btn", "sunny-btn", "night-btn");
            searchBtn.classList.add("rainy-btn");
        }
        else if (dayZeroWeather[0].icon == "http://openweathermap.org/img/wn/13d.png") {
            searchBtn.classList.remove("auto-btn", "rainy-btn", "sunny-btn", "night-btn");
            searchBtn.classList.add("snowy-btn");
        }
        else if (dayZeroWeather[0].icon == "http://openweathermap.org/img/wn/13n.png") {
            searchBtn.classList.remove("auto-btn", "rainy-btn", "sunny-btn", "night-btn");
            searchBtn.classList.add("snowy-btn");
        }
        else {
            searchBtn.classList.remove("rainy-btn", "snowy-btn", "sunny-btn", "night-btn");
            searchBtn.classList.add("auto-btn");
        }
    }
    imgChecker();
    btnChecker();
};


var call = function (city) {
    var url;

    if (location.protocol === 'http:') {
        url = 'http://api.openweathermap.org/data/2.5/forecast?appid=7d1a349a198a94638280b7397e353ad2&units=imperial&q=' + city;
     } else {
        url = 'https://api.openweathermap.org/data/2.5/forecast?appid=7d1a349a198a94638280b7397e353ad2&units=imperial&q=' + city;
     }

    fetch(url)
    .then(function(apiResponse) {
        return apiResponse.json();
    })
    .then(function (apiResponse) {
        if (apiResponse.cod != "200") {
            alert("OpenWeatherMap was unable to find " + city + ".");
            return;
        } else {
            dataObject(apiResponse.list, apiResponse.city.coord);
        }

        var url1;

        if (location.protocol === "http:") {
            url1 = 'http://api.openweathermap.org/data/2.5/uvi?appid=7d1a349a198a94638280b7397e353ad2&lat=' + dayZeroWeather[0].lat + '&lon=' + dayZeroWeather[0].lon;
        } else {
            url1 = 'https://api.openweathermap.org/data/2.5/uvi?appid=7d1a349a198a94638280b7397e353ad2&lat=' + dayZeroWeather[0].lat + '&lon=' + dayZeroWeather[0].lon;
        }

        fetch(url1)
        .then(function (uvResponse) {
            return uvResponse.json();
        })
        .then(function (uvResponse) {
            if (!uvResponse) {
                alert("OpenWeathermap.org could not find any results for your search.");
                return;
            } else {
                saved(city);
                dayZeroSearch(city, uvResponse.value);
            }
        })
    })
    .catch(function (error) {
        alert("Unable to reach OpenWeathermap.org");
        return;
    });
};

var find = function (event) {
    event.preventDefault();

    var input = document.querySelector("#city");
    var text = input.value.trim();

    if (input.value === "") {
        alert("Please enter the name of a city!");
        return;
    } else {
        call(text);
    }
};

var header = document.querySelector("#theme");
header.classList.add("auto");
searchBtn.classList.add("auto-btn");


search();
searchBtn.addEventListener("click", find);