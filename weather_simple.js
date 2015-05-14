
$(document).ready(function() {
	
	//loadWeather('Taipei','');
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(function(position) {
		//console.log(position);
		loadWeather(position.coords.latitude+','+position.coords.longitude);
		setInterval(loadWeather,600000,position.coords.latitude+','+position.coords.longitude)
		});
	}
});

function loadWeather(location, woeid) {
  $.simpleWeather({
    location: location,
    woeid: woeid,
    unit: 'c',
    success: function(weather) {
		console.log("get weather code",weather.code);
		html = '<h2><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
		html += '<ul><li>'+weather.city+', '+weather.country+'</li>';
		html += '<li class="currently">'+weather.currently+'</li></ul>';
		//html += '<li>'+weather.alt.temp+'&deg;F</li></ul>';  
      
		$("#weather").html(html);
		getCode(weather.code);
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });
}
