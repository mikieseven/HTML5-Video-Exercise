// Verify avaialble HTML5 DOM File API
// https://developer.mozilla.org/en-US/docs/Extensions/Using_the_DOM_File_API_in_chrome_code
if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    alert('File APIs NOT supported');
  }
// Initialize global variables for video filepath
// Visible in JS functions. 8-Oct
var inputFilepath = "videos";
var localFolder = inputFilepath; // Used by handleFileSelect();
var selectFile = "";
var idispElem = "";
var fCtr = 0;

// Select Files container;
document.addEventListener('DOMContentLoaded', function () {
	selectFile = document.getElementById('filez');
	selectFile.addEventListener('change', handleFileSelect, false);
})

window.addEventListener('load', function(eld) {
	console.log("HTML5 Player-v3 -Browse input & set path");
	console.log(eld.type);
	console.log(eld);

	// Video Container
	video = document.getElementById('videoz');
	pauseScreen = document.getElementById('screen');
	//screenButton = document.getElementById('screen-button');

	// Progress Bar Container
	pbarContainer = document.getElementById('pbar-container');
	pbar = document.getElementById('pbar');

	// Buttons Container
	playButton = document.getElementById('play-button');
	timeField = document.getElementById('time-field');
	soundButton = document.getElementById('sound-button');
	sbarContainer = document.getElementById('sbar-container');
	sbar = document.getElementById('sbar');
	fullscreenButton = document.getElementById('fullscreen-button');

	// Select Files container;
	// addEventListener to the input type='file' to invoke browse-file selection
	/*selectFile = document.getElementById('select-file');
	selectFile.addEventListener('change', handleFileSelect, false); */

	video.load();  //load is a method of the video object
	console.log('load complete ' + video.src); // monitor file load

	video.addEventListener('canplay', function(cp) {
		// var localFolder = prompt("Enter Video folder: ", localFolder);
		console.log("Status: "+cp.type); // 'canplay' event object
		playButton.addEventListener('click', playOrPause, false);
		pbarContainer.addEventListener('click', skip, false);
		updatePlayer();
		soundButton.addEventListener('click', muteOrUnmute, false);
		sbarContainer.addEventListener('click', changeVolume, false);
		fullscreenButton.addEventListener('click', fullscreen, false);
		//screenButton.addEventListener('click', playOrPause, false);
    pauseScreen.addEventListener('change', playOrPause, false);

	}, false);

}, false);

function playOrPause() {
	if (video.paused) {
		video.play();
		playButton.src = 'images/pause.png';
		update = setInterval(updatePlayer, 30);

		pauseScreen.style.display = 'none';
		screenButton.src = 'images/play.png';
	} else {
		video.pause();
		playButton.src = 'images/play.png';
		window.clearInterval(update);

		pauseScreen.style.display = 'none';
    screenButton.src = 'images/play.png';
	}
}

function updatePlayer() {
	var percentage = (video.currentTime/video.duration)*100;
	pbar.style.width = percentage + '%';
	timeField.innerHTML = getFormattedTime();
	if (video.ended) {
		window.clearInterval(update);
		playButton.src = 'images/replay.png';

		pauseScreen.style.display = 'none';
		screenButton.src = 'images/replay.png';
	} else if (video.paused) {
		playButton.src = 'images/play.png';
    screenButton.src = 'images/play.png';
	}
}

function skip(ev) {
	console.log("skip "+ev); // view the event object
	var mouseX = ev.pageX - pbarContainer.offsetLeft;
	var width = window.getComputedStyle(pbarContainer).getPropertyValue('width');
	width = parseFloat(width.substr(0, width.length - 2));

	video.currentTime = (mouseX/width)*video.duration;
	updatePlayer();
}

function getFormattedTime() {
	var seconds = Math.round(video.currentTime);
	var minutes = Math.floor(seconds/60);
	if (minutes > 0) seconds -= minutes*60;
	if (seconds.toString().length === 1) seconds = '0' + seconds;

	var totalSeconds = Math.round(video.duration);
	var totalMinutes = Math.floor(totalSeconds/60);
	if (totalMinutes > 0) totalSeconds -= totalMinutes*60;
	if (totalSeconds.toString().length === 1) totalSeconds = '0' + totalSeconds;

	return minutes + ':' + seconds + ' / ' + totalMinutes + ':' + totalSeconds;
}

function muteOrUnmute(xv) {
	console.log("mute "+xv);
	// declare the arg param to reference the event object in the function
	if (!video.muted) {
		video.muted = true;
		soundButton.src = 'images/mute.png';
		sbar.style.display = 'none';
	} else {
		video.muted = false;
		soundButton.src = 'images/sound.png';
		sbar.style.display = 'block';
	}
}

function changeVolume(ev) {
	console.log("volume level: " + ev); // view the event object
	var mouseX = ev.pageX - sbarContainer.offsetLeft;
	var width = window.getComputedStyle(sbarContainer).getPropertyValue('width');
	width = parseFloat(width.substr(0, width.length - 2));

	video.volume = (mouseX/width);
	sbar.style.width = (mouseX/width)*100 + '%';
	video.muted = false;
	soundButton.src = 'images/sound.png';
	sbar.style.display = 'block';
}

function fullscreen() {
	if (video.requestFullscreen) {
		video.requestFullscreen();
	} else if (video.webkitRequestFullscreen) {
		video.webkitRequestFullscreen();
	} else if (video.mozRequestFullscreen) {
		video.mozRequestFullscreen();
	} else if (video.msRequestFullscreen) {
		video.msRequestFullscreen();
	}
}

function handleFileSelect(evt) {
	// 5-Sept-2016 AhHa! - the Event Object is passed from addEventListener
	// declaring 'evt' as a param makes the object accessable in the function
	console.log(evt); // view the event object 5-Oct
	localFolder = prompt("Video path: ", localFolder );  // 8-Oct
	// get the video filename from .name attribute 5-Sept
	var selectFileName = evt.target.files[0].name; // FileList in Event Object
	// append hardcode path to the file... 5-Oct
	var vname = localFolder + "\\" + selectFileName;
	// set the "src" attribute for the video object before video.load();
	// fully qualified local "file:\\\" string
	document.getElementsByTagName("video")[0].setAttribute("src", vname);
  // document.getElementsByTagName("video")[0].setAttribute("poster", vname);
	console.log(document.getElementsByTagName("video")[0].getAttribute("src")+ " specified.");

	} // end handleFileSelect
