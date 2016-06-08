//Using the OpenWeatherMap API to make this.
//The program can detect the users location with geolocation or with the zipcode provided.
//The API can recognize ISO 3166-1 alpha-2 codes. https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2

var APPID = "5d6a5f56f935e3664c0084469ebd625f";
var temp;
var loc;
var icon;
var humidity;
var wind;
var direction;

var upper;
var middle;
var lower;
var greet;
var clothesUpper;
var clothesMiddle;
var clothesLower;

var iconValue;
var tempValue;

var getDate = new Date();
var currentHour;
var currentMintues;
var displayHour;

window.onload = function () {
	temp = document.getElementById("temperature");
	loc = document.getElementById("location");
	icon = document.getElementById("icon");
	humidity = document.getElementById("humidity");
	wind = document.getElementById("wind");
	direction = document.getElementById("direction");
	
	currentHour = getDate.getHours();
	currentMinutes = getDate.getMinutes();
		if (currentMinutes < 10) {
			currentMinutes = "0" + currentMinutes;
		}
		console.log(currentHour + " " + currentMinutes);
	displayHour = document.getElementById("time");
	displayHour.innerHTML = currentHour + ":" + currentMinutes;
	
	
	greet = document.getElementById("greet");
	upper = document.getElementById("upper");
	middle = document.getElementById("middle");
	lower = document.getElementById("lower");
	
	if(navigator.geolocation) {
		var showPosition = function(position) {
			updateByGeo(position.coords.latitude, position.coords.longitude);
		}
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		var zip = window.prompt("Could not discover your location. What is your zip code?");
		updateByZip(zip);
	}
}

function updateByZip(zip) {
	var url = "http://api.openweathermap.org/data/2.5/weather?" +
		"zip=" + zip +
		"&APPID=" + APPID;
	sendRequest(url);
	
	console.log(url + " " + zip)
}

function updateByGeo(lat, lon) {
	var url = "http://api.openweathermap.org/data/2.5/weather?" +
		"lat=" + lat +
		"&lon=" + lon +
		"&APPID=" + APPID;
	sendRequest(url);
	
	console.log(url)
}

function sendRequest(url) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var data = JSON.parse(xmlhttp.responseText);
			var weather = {};
			weather.icon = data.weather[0].id;
			weather.humidity = data.main.humidity;
			weather.wind = mph2kmh(data.wind.speed);
			weather.direction = degreesToDirection(data.wind.deg);
			weather.loc = data.name;
			weather.temp = K2C(data.main.temp);
			update(weather);
			
			console.log(weather.temp + " " + weather.loc + " " + weather.humidity + " " + weather.wind + " " + weather.direction + " " + weather.icon);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function update(weather) {
	wind.innerHTML = weather.wind;
	direction.innerHTML = weather.direction;
	humidity.innerHTML = weather.humidity;
	loc.innerHTML = weather.loc;
	temp.innerHTML = weather.temp;
	icon.src = "imgs/codes/" + weather.icon + ".png";
	
	greet.innerHTML = chooseGreet(weather);
	clothesSystem(weather);
}

function degreesToDirection(degrees) {
	var range = 360/8;
	var low = 360 - range/2;
	var high = (low + range) % 360;
	var angles = ["N", "NE", "E", "SE", "S", "SW","W", "NW"];
		for (i in angles) {
			if (degrees >= low && degrees < high) {
				return angles[i];
			}
			
			low = (low + range) & 360;
			high = (high + range) % 360;
			
		}
	return "N";
}

function mph2kmh(mph){
	return (mph * 1.60935).toFixed(2);
}

function K2C(k){
	return Math.round(k - 273,15);
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Above: Weather Below: The Clothes system
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

function chooseGreet(weather) {
	if (currentHour >= 6 && currentHour < 12) {
		return morningGreet();
	} else if (currentHour >= 12 && currentHour < 18) {
		return afternoonGreet;
	} else if (currentHour >= 18 && currentHour <= 23) {
		return eveningGreet;
	} else if (currentHour > 0 && currentHour < 6) {
		return nightGreet;
	}
	
	function morningGreet() {
		var morningChoices = ["Goede morgen!", "Lekker geslapen?", "Een start van een nieuwe dag!"];
		return morningChoices[Math.floor(Math.random()*morningChoices.length)];
	}
	
	function afternoonGreet() {
		
	}
	
	function eveningGreet() {
		
	}
	
	function nightGreet() {
		
	}	
}

function clothesSystem(weather) {
	tempValue = weather.temp;
	iconValue = weather.icon;
	
	clothesUpper = "hello";
	clothesMiddle = "noooo";
	clothesLower = "heya!";
	
	updateC();
}

function updateC(clothes) {
	upper.innerHTML = clothesUpper;
	middle.innerHTML = clothesMiddle;
	lower.innerHTML = clothesLower;
}
