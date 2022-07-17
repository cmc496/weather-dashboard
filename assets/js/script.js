var searchBtn = document.querySelector("#search");
var searchedCities = document.querySelector("#searched");
var cityHistory = JSON.parse(localStorage.getItem('cities')) || [];

// current day weather
var dayZero = document.querySelector("#day-zero");
// five-day forecast
var forecast = document.querySelector("#weather-cards");

var dayZeroWeather = [];

function search() {
    searchWeather();
};

var searchWeather = function() {
    resetCity(searchedCities);

    if (cityHistory) {
        var listCity = document.createElement("ul");

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
    var cityInput = $(this).attr("attr");
    call(cityInput);
});
var resetCity = function(element) {
    element.innerHTML = "";
};
var uvColor = function(uv) {
    var uvI = parseFloat(uv);
    var uvBackground;

    if (uvI <= 4) {
        uvBackground = "bg-success";
    }
    else if (uvI <= 6) {
        uvBackground = "bg-warning";
    }
    else if (uvI >= 7) {
        uvBackground = "bg-danger";
    }
    return uvBackground;
};

var dayZeroSearch = function(cityInput, uv) {
    resetCity(dayZero);
    resetCity(forecast);

    var displayedCity = document.createElement("div");
    displayedCity.classList.add("col-6");

    var displayedImg = document.createElement("div");
    displayedImg.classList.add("col-6");

    var displayedCityText = document.createElement("h3");
    displayedCityText.textContent = cityInput + " (" + dayZeroWeather[0].dateT + ")";

    var img = document.createElement("img");
    img.setAttribute("src", dayZeroWeather[0].icon);
    img.classList.add("bg-info");

    displayedCity.appendChild(displayedCityText);
    displayedImg.appendChild(img);

    var weather = document.createElement("div");
    weather.classList.add("col-12");
    weather.innerHTML = "<p> Temp: " + dayZeroWeather[0].temp + "°F" + "</p>" +
                        "<p> Wind: " + dayZeroWeather[0].speed + " MPH </p>" +
                        "<p> Humidity: " + dayZeroWeather[0].humidity + "% </p>" +
                        "<p>UV Index: <span class='text-white "+ uvColor(uv) + "'>" + uv + "</span></p>";
    dayZero.appendChild(displayedCity);
    dayZero.appendChild(displayedImg);
    dayZero.appendChild(weather);

    var nextFive = document.createElement("div");
    nextFive.classList.add("row");
    nextFive.classList.add("col-12");

    var forecastTitle = document.createElement("div");
    forecastTitle.classList.add("col-12");
    forecastTitle.innerHTML = "<h3> 5 Day Forecast </h3>";

    nextFive.appendChild(forecastTitle);
    forecast.appendChild(nextFive);

    var nextFiveCards = document.createElement("div");
    nextFiveCards.classList.add("d-flex");

    for (var i = 1; i < dayZeroWeather.length; i++) {
        var card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("flex-fill");

        var cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");

        var cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        var forecastImg = document.createElement("img");
        cardTitle.textContent = dayZeroWeather[i].dateT;
        forecastImg.setAttribute("src", dayZeroWeather[i].icon);

        var tempText = document.createElement("p");
        tempText.textContent = "Temp: " + dayZeroWeather[i].temp + " °F";

        var humidityText = document.createElement("p");
        humidityText.textContent = "Humidity: " + dayZeroWeather[i].humidity + "%";

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(forecastImg);
        cardBody.appendChild(tempText);
        cardBody.appendChild(humidityText);
        card.appendChild(cardBody);
        nextFiveCards.appendChild(card);
    }
    forecast.appendChild(nextFiveCards);
};

var saved = function(cityInput) {
    var flag = false
    if (cityHistory) {
        for (var i = 0; i < cityHistory.length; i++) {
            if (cityHistory[i] === cityInput) {
                flag = true;
            }
        }
        if (flag) {
            alert("The city " + cityInput + " has already been searched!");
        }
    }
    if (!flag) {
        cityHistory.push(cityInput);
        localStorage.setItem("cities", JSON.stringify(cityHistory));
    }
    searchWeather();
};

var searchDate9AM = function (str) {
    var hour = str.split(" ")[1].split(":")[0];
    var flag = false;

    if (hour === "09") {
        flag = true;
    }

    return flag;
};

var dateFormat = function(date) {
    var newDate = date.split(" ")[0].split("-");
    return (newDate[i] + "/" + newDate[2] + "/" + newDate[0]);
};

var dataObject = function (list, position) {
    if (dayZeroWeather.length) {
        dayZeroWeather = [];
    }
    var object = {
        dateT: dateFormat(list[0].dt_txt),
        temp: list[0].main.temp,
        humidity: list[0].main.humidity,
        speed: list[0].wind.speed,
        icon: "http://openweathermap.org/img/wn/" + list[0].dayZeroSearch[0].icon + ".png",
        lat: position.lat,
        lon: position.lon
    };
    dayZeroWeather.push(object);

    for (var i = 1; i < list.length; i++) {
        if (searchDate9AM(list[i].dt_txt)) {
            object = {
                dateT: dateFormat(list[i].dt_txt),
                temp: list[i].main.temp,
                humidity: list[i].main.humidity,
                speed: list[i].wind.speed,
                icon: "http://openweathermap.org/img/wn/" + list[i].dayZeroSearch[0].icon + ".png",
                lat: position.lat,
                lon: position.lon
            };
            dayZeroWeather.push(object);
        }
    }
};

var call = function(cityInput) {
    var url;

    if (location.protocol === 'http:') {
        url = 'http://api.openweathermap.org/data/2.5/onecall?appid=7d1a349a198a94638280b7397e353ad2&units=imperial&q=' + cityInput;
        // url = 'http://api.openweathermap.org/data/2.5/onecall?appid=7d1a349a198a94638280b7397e353ad2&lat=40.556870&lon=-74.527000';
    } else {
        url = 'https://api.openweathermap.org/data/2.5/onecall?appid=7d1a349a198a94638280b7397e353ad2&units=imperial&q=' + cityInput;
        // url = 'https://api.openweathermap.org/data/2.5/onecall?appid=7d1a349a198a94638280b7397e353ad2&lat=40.556870&lon=-74.527000';
    }
    fetch(url)
    .then(function(apiResponse) {
        return apiResponse.json();
    })
    .then(function(apiResponse) {
        if (apiResponse.cod != "200") {
            alert("Unable to find " + cityInput + " using Openweathermap");
            return;
        } else {
            dataObject(apiResponse.list, apiResponse.cityInput.coord);
        }

        var url1;

        if (location.protocol === "http:") {
            url1 = 'http://api.openweathermap.org/data/2.5/onecall?appid=7d1a349a198a94638280b7397e353ad2&lat=' + dayZeroWeather[0].lat + '&lon=' + dayZeroWeather[0].lon;
            // url1 = 'http://api.openweathermap.org/data/2.5/onecall?appid=7d1a349a198a94638280b7397e353ad2&lat=40.556870&lon=-74.527000';
        } else {
            url1 = 'https://api.openweathermap.org/data/2.5/onecall?appid=7d1a349a198a94638280b7397e353ad2&lat=' + dayZeroWeather[0].lat + '&lon=' + dayZeroWeather[0].lon;
            // ur1 = 'https://api.openweathermap.org/data/2.5/onecall?appid=7d1a349a198a94638280b7397e353ad2&lat=40.556870&lon=-74.527000';
        }
        fetch(url1)
        .then(function(uvResponse) {
            return uvResponse.json();
        })
        .then(function(uvResponse) {
            if (!uvResponse) {
                alert("Openweathermap couldn't find this location.");
                return;
            } else {
                saved(cityInput);
                dayZeroSearch(cityInput, uvResponse.value);
            }
        })
    })
    .catch(function(error) {
        alert("Cannot connect to Openweathermap.");
        return;
    });
};

var find = function(event) {
    event.preventDefault();

    var input = document.querySelector("#city");
    var text = input.value.trim();

    if (input.value === "") {
        alert("Please enter a city!");
        return;
    } else {
        call(text);
    }
};

search();

searchBtn.addEventListener("click", find);