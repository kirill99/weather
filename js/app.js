/*
{
    "location": {
        "name": "London",
        "region": "City of London, Greater London",
        "country": "United Kingdom",
        "lat": 51.52,
        "lon": -0.11,
        "tz_id": "Europe/London",
        "localtime_epoch": 1636129086,
        "localtime": "2021-11-05 16:18"
    },
    "current": {
        "last_updated_epoch": 1636128900,
        "last_updated": "2021-11-05 16:15",
        "temp_c": 9,
        "temp_f": 48.2,
        "is_day": 1,
        "condition": {
            "text": "Partly cloudy",
            "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
            "code": 1003
        },
        "wind_mph": 8.1,
        "wind_kph": 13,
        "wind_degree": 270,
        "wind_dir": "W",
        "pressure_mb": 1027,
        "pressure_in": 30.33,
        "precip_mm": 0,
        "precip_in": 0,
        "humidity": 81,
        "cloud": 75,
        "feelslike_c": 7.6,
        "feelslike_f": 45.6,
        "vis_km": 10,
        "vis_miles": 6,
        "uv": 3,
        "gust_mph": 7.2,
        "gust_kph": 11.5
    }
}


*/


(function(){
    const httpService = (()=>{
        const apiKey = '6e3093c055ed4a70a71154512210511';

        function generateResponse(response){
            if (Math.floor(response.status) / 100 == 2){
                return {status: true, data: JSON.parse(response.responseText)};
            }

            return {status: false, data: response};
        }

        function getHttp(url, cb){
            const xhr = new XMLHttpRequest();

            xhr.open("GET", url);

            xhr.addEventListener('load', ()=>{
                const response = generateResponse(xhr);
                cb(response);
            })

            xhr.addEventListener('error', ()=>{
                const response = generateResponse(xhr);
                cb(response);
            })

            xhr.send();
        }


        function getCurrentWeather(q = 'London', cb){
            // добавить автоопределение ip
            const url = 'https://api.weatherapi.com/v1/current.json';
            getHttp(`${url}?key=${apiKey}&q=${q}&aqi=no`, cb);
        }


        return {
            getCurrentWeather,
        }
    })();


    function initBackgroud(weatcherCase, iconUrl){
        const variableWeather = ['sunny', 'cloudy', 'rain', 'snow', 'overcast', 'mist', 'fog','clear'];
        let currentWeather = '';

        console.log(weatcherCase);

        weatcherCase.split('').map(function(char){
            return char = char.toLowerCase();
        }).join('').split(' ').forEach(function(str){
            if (variableWeather.indexOf(str) != -1){
                currentWeather = str;
            }
        })

        if(!weatcherCase) weatcherCase = 'sunny';

        console.log(currentWeather);

        const imageBg = document.querySelector('.weather-box .image');
        imageBg.style.backgroundImage = `url(../img/${currentWeather}.jpg)`;


        const weatherTitleItem = document.querySelector('.weather-status .text');
        weatherTitleItem.childNodes[0].textContent = currentWeather;

        const weatherIconItem = document.querySelector('.weather-status .icon');
        weatherIconItem.style.background = `url(${iconUrl})`;


        const mainWeatherBox = document.querySelector('.weather');
        mainWeatherBox.style.background = `var(--bg-${currentWeather})`;
    }


    function initDetail(objDetail){
        const cloudyItem = document.querySelector('#cloudy .value');
        cloudyItem.childNodes[0].textContent = `${objDetail?.cloudy}%`;

        const humidityItem = document.querySelector('#humidity .value');
        humidityItem.childNodes[0].textContent = `${objDetail?.humidity}%`;

        const windItem = document.querySelector('#wind .value');
        windItem.childNodes[0].textContent = `${objDetail?.wind}km/h`;
    }


    function setWeather(obj){
        if (!obj.status) return false;

        const currentWeather = obj.data;

        const cityItem = document.querySelector('.city-date .city');
        cityItem.childNodes[0].textContent = currentWeather.location.name;

        const temperatureItem = document.querySelector('.temperature');
        temperatureItem.childNodes[0].textContent = `${currentWeather.current.temp_c}°`;


        const dateItem = document.querySelector('.city-date .date');
        dateItem.childNodes[0].textContent = currentWeather.location.localtime; // 10:36 - Tuesday, 22 Oct 21


        initBackgroud(currentWeather.current.condition.text, currentWeather.current.condition.icon);
        initDetail({
            cloudy:currentWeather.current.cloud,
            humidity:currentWeather.current.humidity,
            wind:currentWeather.current.wind_mph,
        });
    }



    httpService.getCurrentWeather(undefined, setWeather);



    document.querySelector('.info .search .icon').addEventListener('click', ()=>{
        const cityTitle = document.querySelector('.info .search .control input').value;
        httpService.getCurrentWeather(cityTitle, setWeather);
    })

})();