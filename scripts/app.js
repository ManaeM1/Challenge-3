//Concent 2 - Slideshow
var myIndex = 0;

function slideshow() {
	var i;
  	var x = document.getElementsByClassName("responsive_photo");
  	for (i = 0; i < x.length; i++) {
    	x[i].style.display = "none";  
  	}

  	myIndex++;
  	if (myIndex > x.length) {myIndex = 1}    
  	x[myIndex-1].style.display = "block";  
  	setTimeout(slideshow, 6000);    
}
slideshow();


//Concent 3 - Map

// Mapbox - API
mapboxgl.accessToken = 'pk.eyJ1IjoibWFuYWVtYXRzdWRhIiwiYSI6ImNrbWtqaDJwODExaG8ybnF2azl1bmFqaTgifQ.yXgg_FQLf_97IM30wD7eJg';

// OpenWeatherMap - API
var openWeatherMapUrl = 'https://api.openweathermap.org/data/2.5/weather';
var openWeatherMapUrlApiKey = 'd91d834787eca468d8223b412439a564';

// Weather of each city's
var cities = [
  {
    name: 'Brevard County',
    coordinates: [-80.71011791811772, 28.644175961199952]
  },
];

//Location
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v11',
  center: [-80.69396772953425, 28.614043921023864],
  zoom: 10
});


// Combine weather data with map
map.on('load', function () {
  cities.forEach(function(city) {

    var request = openWeatherMapUrl + '?' + 'appid=' + openWeatherMapUrlApiKey + '&lon=' + city.coordinates[0] + '&lat=' + city.coordinates[1];

    fetch(request)
      .then(function(response) {
        if(!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then(function(response) {
        plotImageOnMap(response.weather[0].icon, city)
      })
      .catch(function (error) {
        console.log('ERROR:', error);
      });
  });
});

function plotImageOnMap(icon, city) {
  map.loadImage(
    'https://openweathermap.org/img/w/' + icon + '.png',
    function (error, image) {
      if (error) throw error;
      map.addImage("weatherIcon_" + city.name, image);
      map.addSource("point_" + city.name, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: city.coordinates
            }
          }]
        }
      });
      map.addLayer({
        id: "points_" + city.name,
        type: "symbol",
        source: "point_" + city.name,
        layout: {
          "icon-image": "weatherIcon_" + city.name,
          "icon-size": 1.3
        }
      });
    }
  );
}


var popup = new mapboxgl.Popup().setHTML('<h3>Shuttle Landing Facility</h3><p>NASA Shuttle Landing Facility</p>');

// Adding a marker based on lon lat coordinates
var marker = new mapboxgl.Marker()
  .setLngLat([-80.69396772953425, 28.614043921023864])
  .setPopup(popup)
  .addTo(map);


//Content 1 - weather forecast

function getAPIdata() {

  var url = 'https://api.openweathermap.org/data/2.5/weather';
  var apiKey ='d91d834787eca468d8223b412439a564';
  var city = 'orlando';

  // construct request
  var request = url + '?' + 'appid=' + apiKey + '&' + 'q=' + city;
  
  // get current weather
  fetch(request)

// parse to JSON format
  .then(function(response) {
    if(!response.ok) throw Error(response.statusText);
    return response.json();
  })
  
  // render weather per day
  .then(function(response) {
    // render weatherCondition
    onAPISucces(response);  
  })
  
  // catch error
  .catch(function (error) {
    onAPIError(error);
  });
}


function onAPISucces(response) {
  // get type of weather in string format
  var type = response.weather[0].description;

  // get temperature in Celcius
  var degC = Math.floor(response.main.temp - 273.15);

  // render weather in DOM
  var weatherBox = document.getElementById('weather');
  weatherBox.innerHTML = degC + '&#176;C <br>' + type;
}


function onAPIError(error) {
  console.error('Request failed', error);
  var weatherBox = document.getElementById('weather');
  weatherBox.className = 'hidden'; 
}

// init data stream
getAPIdata();

