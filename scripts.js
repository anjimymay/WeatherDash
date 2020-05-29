//3b9e31f353a6d48d75e6d0b999d25f9c

//get the document loaded and on ready run the function - all the code
$(document).ready(function () {
    
    var apiKey = "3b9e31f353a6d48d75e6d0b999d25f9c";
    
    var createButton = function(userInput) {
        var btnHTML = $("<button>");
        btnHTML.addClass("city-button");
        btnHTML.text(userInput);
        $('#history').append(btnHTML);
    }
    //get local storage if it exist and restore buttons on intial load
    var btnHistory = JSON.parse(localStorage.getItem('btnhistory')) || [];
    for (let i = 0; i < btnHistory.length; i++) {
        createButton(btnHistory[i]);
    }

    var createCurrentWeatherDiv = function (userInput, key) {
        //construct api url
        var currentWeatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${key}&units=imperial`;
        //make ajax call and get data
        $.ajax({
            type: "GET",
            url: currentWeatherUrl,
            dataType: "json",
            //on succuss create the current weather div
            success: function (data) {
                console.log('*****data: ', data);
                // create html content for current weather
                var currentWeatherMarkup =
                    //use the data to crate current weather div
                    `   
                    <h3 class="card-title">${data.name} (${new Date().toLocaleDateString()})<img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png"/></h3>
                    <div class="card">
                        <p class="card-text">Wind Speed: ${data.wind.speed} MPH</p>
                        <p class="card-text">Humidity: ${data.main.humidity}%</p>
                        <p class="card-text">Temperature: ${data.main.temp} °F</p>
                        <p class="card-text">UV Index: ${data.main.temp} °F</p>
                    </div>
                `;
                $("#today").html(currentWeatherMarkup);

            },
            error: function (error) {
                return error;
            }
        });
    }

    var createFiveDayForcast = function (userInput, key) {
        //do another ajax call to get the 5 days forecast
        var fiveDayWeatherUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${userInput}&appid=${key}`;
        $.ajax({
            type: "GET",
            url: fiveDayWeatherUrl,
            dataType: "json",
            //on success create 5 day weather forecast
            success: function (data) {
                console.log('5 day data: ', data);
                var htmlArr = [];
                for(var i = 0; i < 5; i++){
                    var fiveDayHTML =
                        `
                            <div class="card bg-primary text-white">
                                <div class="card-body p-2">
                                    <h5 class="card-title">${new Date(data.list[i].dt_txt).toLocaleDateString()}</h5>
                                    <img src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png"/>
                                    <p class="card-text">Temp: ${data.list[i].main.temp_max} °F</p>
                                    <p class="card-text">Humidity: ${data.list[i].main.humidity} %</p>
                                </div>
                            </div>
                        `;
                    htmlArr.push(fiveDayHTML);
                }
                    $("#5Day").html(htmlArr.join(""));
            },
            error: function (error) {
                return error;
            }
        });
    }


    var storeBtnHistroy = function(userInput) {
        btnHistory.push(userInput);
        localStorage.setItem("btnhistory",JSON.stringify(btnHistory));
    }

    //search button click evenet listener
    $("#search-button").on("click", function () {
        var userVal = $('#search-value').val();
        createCurrentWeatherDiv(userVal, apiKey);
        createFiveDayForcast(userVal, apiKey);
        createButton(userVal);
        storeBtnHistroy(userVal);
    })
    
    //search button click evenet listener
    $("#history").on("click",".city-button",function () {
        var btnText = $(event.target).text();
        createCurrentWeatherDiv(btnText, apiKey);
        createFiveDayForcast(btnText, apiKey);
    })
})





