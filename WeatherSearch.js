
var spotifyApi = new SpotifyWebApi();
var img = $('#songImg');
var imgTarget = document.getElementById('songImg');
var songName = $('#songName');
var singer = $('#singer');
var Url = "";
var preview = "";
var clickCount = 0;
var prev = null;
var code ='';
var weather_type =0;
var key = '';

function getCode(c){
	if(c === ''){
		console.log("firstTime code");
	}else{
		code = c;
		getWeather();
		if(weather_type === 0){
			console.log("error weather_type!");
		}
		chooseKey();
		onUserInput(key);
	}
}
function chooseKey(){
	if(weather_type !== 0){
		var tar = 0;
		switch(weather_type){
			case 1:
			case 3:
			case 4:
				tar = random(clouldy.length);
				key = clouldy[tar];
				break;
			case 2:						
			case 5:
				tar = random(littleRainy.length);
				key = littleRainy[tar];
				break;
			case 7:
				tar = random(sun.length);
				key = sun[tar];
				break;
			case 6:			
			case 8:
			case 9:
			case 10:
				tar = random(badDay.length);
				key = badDay[tar];
				break;
		}
		console.log("key: ",key);

	}
}

function random(max){
	return Math.floor(Math.random()*(max-1)+0);
}
function onUserInput(queryTerm) {

  // abort previous request, if any
  if (prev !== null) {
    prev.abort();
  }

  // store the current promise in case we need to abort it
  prev = spotifyApi.searchTracks(queryTerm, {limit: 20})
    .then(function(data) {
		var let = data.tracks.items.length;
		var itemNum = random(let);
		console.log(data);
		img.css("background-image","url("+data.tracks.items[itemNum].album.images[0].url+")");
		songName.text(data.tracks.items[itemNum].name);
		singer.text(data.tracks.items[itemNum].artists[0].name);
		Url = data.tracks.items[itemNum].external_urls.spotify;
		preview = data.tracks.items[itemNum].preview_url;
      // clean the promise so it doesn't call abort
      prev = null;
	  if(imgTarget.classList.contains(playingCssClass)){
		  audioObject.pause()
	  }else{
		  if(audioObject){
			  audioObject.pause();
		  }
		  autoPlay();
		  imgTarget.classList.add(playingCssClass);
		  audioObject.addEventListener('ended', function(){
			  imgTarget.classList.remove(playingCssClass);
			  getCode(code);
		  });
		  audioObject.addEventListener('pause', function(){
			  imgTarget.classList.remove(playingCssClass);
		  });
	  }
      // ...render list of search results...
    }, function(err) {
		console.error(err);
    });
}


songImg.addEventListener('click', function (e) {
    clickCount++;
    if (clickCount === 1) {
        singleClickTimer = setTimeout(function() {
            clickCount = 0;
			console.log("SingleClick");
            SingleClick(e);
        }, 250);
    } else if (clickCount === 2) {
        clearTimeout(singleClickTimer);
        clickCount = 0;
		console.log("DoubleClick");
        DoubleClick(e);
    }
});
function SingleClick(e){
	var target = e.target;
    if (target !== null && target.classList.contains('cover')){
        if (target.classList.contains(playingCssClass)) {
            audioObject.pause();
        } else {
            if (audioObject) {
                audioObject.pause();
            }
            autoPlay();
			target.classList.add(playingCssClass);
			audioObject.addEventListener('ended', function () {
                target.classList.remove(playingCssClass);
				getCode(code);
			});
			audioObject.addEventListener('pause', function () {
                target.classList.remove(playingCssClass);
			});
        }
    }
}

function DoubleClick(e){
	var target = e.target;
	if(target != null && target.classList.contains('cover')){
		audioObject.pause();
	}else{
		if(audioObject){
			audioObject.pause();
		}
		audioObject.addEventListener('ended', function () {
			target.classList.remove(playingCssClass);
		});
		audioObject.addEventListener('pause', function () {
            target.classList.remove(playingCssClass);
		});
	}
	getCode(code);
}


function autoPlay(){
		console.log("play music");
		audioObject = new Audio(preview);
		audioObject.play();
}

function openUrl(){
	window.open(Url);
}

function getWeather(){
	console.log("getWeather_code: ",code);
	switch(code){ 
		case '26':
		case '27': 
			weather_type = 1;//"陰";
			console.log("can't see sun");
			break;
		case '35':
		case '39':
		case '45':
		case '46': 
			weather_type = 2;//"小雨";
			console.log("little rain");
			break;
		case '19':
		case '20':
		case '21':
		case '22': 
			weather_type = 3;//"霧";
			console.log("fosty");
			break;
		case '29':
		case '28':
		case '30':
		case '33': 
			weather_type = 4;//"多雲";
			console.log("clouldy");
			break;
		case '5':
		case '13':
		case '14':
		case '15':
		case '16':
		case '18':
		case '25':
		case '41':
		case '42': 
			weather_type = 5;//"雪";
			console.log("snowy");
			break;
		case '1':
		case '2':
		case '3':
		case '4':
		case '37':
		case '38':
		case '47': 
			weather_type = 6;//"雷雨";
			console.log("thundy snowy");
			break;
		case '31':
		case '32':
		case '34':
		case '36':
		case '44': 
			weather_type = 7;//"晴";
			console.log("sun");
			break;			
		case '23':
		case '24': 
			weather_type = 8;//"中到大風";
			console.log("big winy");
			break;
		case '9':
		case '10':
		case '11':
		case '12':
		case '40': 
			weather_type = 9;//"中到大雨";
			console.log("heavy rain");
			break;
		case '6':
		case '7':
		case '8':
		case '17': 
			weather_type = 10;//"冰雹";
			console.log("ice attack");
			break;
		default:
			weather_type = 7;//"晴";
			console.log("sun");
			break;
	}
}