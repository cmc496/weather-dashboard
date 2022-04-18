var searchBtn = document.querySelector("#search");
var searchedCities = document.querySelector("#searched");
var cityHistory = JSON.parse(localStorage.getItem('city')) || [];

// current day weather
var dayZero = document.querySelector("#day-zero");
// five-day forecast
var forecast = document.querySelector("#weather-cards");

var dayZeroWeather = [];

function search() {
    searchWeather();
};

var searchedWeather = function() {
    resetCity(searchedCities);

    if (cityHistory) {
        var listCity = document.createElement("ul");

        for (var i = 0; i < cityHistory.length; i++) {
            var listCityEl = document.createElement("li");
            listCityEl.innerHTML = "<button type='button' class='list-group-item list-group-item-action' attr='"+ cityHistory[i] + "'>" + cityHistory[i] + "</button>";
            listCity.appendChild(listCityEl);
        }
        searchedCities.appendChild(listCity);
    }
};
$(document).on("click", ".list-group-item", function(event) {
    event.preventDefault();
    var cityInput = $(this).attr("attr");
    callApi(cityInput);
});
var resetCities = function(element) {
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





// var search = function (event) {
//     event.preventDefault();
//     var cityInput = document.querySelector("#city-form").value.trim();
//     if (cityInput === "") {
//         alert("You must enter the name of a city");
//         return;
//     } else {
//         //call api function
//     }
// }

//searchBtn.addEventListener("click", function);