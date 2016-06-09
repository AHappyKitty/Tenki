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
		return afternoonGreet();
	} else if (currentHour >= 18 && currentHour <= 23) {
		return eveningGreet();
	} else if (currentHour > 0 && currentHour < 6) {
		return nightGreet();
	}
	
	function morningGreet() {
		var morningChoices = ["Good morning!", "Hello sleepy head!", "Another day, another morning! Ready yet?", "Well isn't it fun? The start of the new day!", "How was breakfast? Or are you up this early?", "Well it's a beatutiful morning, isn't it?", "Quick, drink some coffee before you fall back to sleep!", "Going out early today?"];
		return morningChoices[Math.floor(Math.random()*morningChoices.length)];
	}
	
	function afternoonGreet() {
		var afternoonChoices = ["Good afternoon!", "Eat a snack, helps you get through the day.", "Keep up the good work! And you'll be eating diner in no time.", "Don't snack too much now, otherwise you'll get chubby!", "I gotta work work work work work~", "Do you have free time? Yes? Good for you!", "It's time for you to eat something! I suggest a healthy snack?", "It's afternoon now, in case you can't read the clock."];
		return afternoonChoices[Math.floor(Math.random()*afternoonChoices.length)];
	}
	
	function eveningGreet() {
		var eveningChoices = ["Good evening!", "Well, how was diner? Or do you always eat before six?", "Look at the sunset! It only comes once a day.", "Relax and sit back, I think you'll need that!", "Go watch a movie, the evening is the perfect time for it.", "Watch out if you go out, I don't want you to get hurt!", "Do you like the evening? I do, because that's when you can see the sunset.", "Again, it's evening now. Aren't you supposed to be preparing to go to bed?"];
		return eveningChoices[Math.floor(Math.random()*eveningChoices.length)];
	}
	
	function nightGreet() {
		var nightChoices = ["Good night!", "You're still going out this late? Well, be safe!", "WHERE'S THE PARTY? OUT THERE IS THE PARTY!", "Zzzz, go sleep. But if you must go out, allow me to give you advice.", "Watch out for thieves at this hour, just be safe okay?", "Oh noes, at this hour vampires like to go out and suck your blood!", "Hmm, the night. It's so calm and beautiful, I can relate to why you want to go out now!", "Heeeeeeeey, be safe okay?"];
		return nightChoices[Math.floor(Math.random()*nightChoices.length)];
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
