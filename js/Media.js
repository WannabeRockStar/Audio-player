// First click does not work on currentTimeUpdate
// Add mousemove event on currentTimeUpdate method

const Media = {
	
	songs: [
		{artist: "J.J.Cale", title: "Cocaine", src: "http://webjackal.000webhostapp.com/audio/J.J.%20Cale%20-%20Cocaine.mp3"},
		{artist: "Dire straits", title: "Sultans of Swing", src: "http://webjackal.000webhostapp.com/audio/Dire%20Straits%20-%20Sultans%20Of%20Swing.mp3"},
		{artist: "Creedence", title: "Proud Mary", src: "http://webjackal.000webhostapp.com/audio/Creedence%20Clearwater%20Revival%20Proud%20Mary.mp3"},
		{artist: "Cream", title: "Sunshine of Your Love", src: "https://webjackal.000webhostapp.com/audio/Cream%20-%20Sunshine%20Of%20Your%20Love%20(HD).mp3"}
	],
	html: "",
	currentIndex: 0,
	output: document.querySelector(".song-container"),
	nameField: document.getElementById("play-field"),
	volumeInput: document.getElementById("volume"),
	progressBar: document.getElementById("full-bar"),
	progressBarContainer: document.getElementsByClassName("prog-container")[0],
	audio: new Audio(),
	isStopped: false,

	initPlay() {
		this.nameField.value = "" + this.songs[this.currentIndex].artist + " - " + this.songs[this.currentIndex].title
		this.playedClass(true)
		
		this.audio.src = this.songs[this.currentIndex].src
		this.audio.play()
		this.songDuration()
		this.isStopped = false
	},
	
	playedClass(isPlaying) {
		let items = document.querySelectorAll(".song-item")
		for(let i = 0; i < items.length; i++) {
				items[i].style.color = ""
		}
		if(isPlaying)
			items[this.currentIndex].style.color = "#3071a9"
	},

	songDuration() {
		let self = this
		this.audio.addEventListener('loadedmetadata', function() {
		    self.audio.addEventListener("timeupdate", function() {
					self.progressBar.style.width = (self.audio.currentTime / self.audio.duration) * 100 + "%";
				});
		});

	},

	autoPlay() {
		let self = this;
		this.audio.addEventListener('loadedmetadata', function() {
			self.audio.addEventListener("timeupdate", function() {
				if(self.audio.currentTime === self.audio.duration) {
					self.currentIndex++
					self.initPlay()
				}
			});
			
		})		

	},

	currentTimeUpdate() {
		
		if(this.audio.src == "") {
			return
		}

		this.progressBarContainer.addEventListener("click", (event) => {
		  let x = event.clientX - this.progressBarContainer.offsetLeft
		  x = (x / 600) * 100
		  this.progressBar.style.width = x + "%"
		  this.audio.currentTime = (x / 100) * this.audio.duration
		})
	},
	
	playSong(index) {
		if(index)
			this.currentIndex = index

		if(this.audio.paused && this.audio.src !== "" && this.isStopped === false) {
			this.audio.play()
			return
		}

		this.initPlay()
	},

	pauseSong() {
		this.audio.pause()
	},

	volume(element) {
		this.audio.volume = element.value / 100
	},

	timeBackward() {
		this.audio.currentTime -= 10
	},

	timeForward() {
		this.audio.currentTime += 10
	},

	mute(element) {
		
		let muteButton = element.firstElementChild
		if(muteButton.classList.contains("fa-volume-up")) {
			muteButton.classList.remove("fa-volume-up")
			muteButton.classList.add("fa-volume-off")
			element.classList.add("mute-active")
			this.volumeInput.value = 0
			this.audio.volume = 0
		} else {
			muteButton.classList.remove("fa-volume-off")
			muteButton.classList.add("fa-volume-up")
			element.classList.remove("mute-active")
			this.volumeInput.value = 100
			this.audio.volume = 1
		}
	},

	stopSong() {
		this.nameField.value = ""
		this.playedClass()
		this.currentIndex = 0
		this.audio.pause()
		this.audio.currentTime = 0
		this.audio = new Audio()
		this.progressBar.style.width = "0"
		this.isStopped = true
	},

	previousSong() {
		if(this.audio.paused) this.audio.play()

		this.currentIndex--
		if(this.currentIndex < 0)
			this.currentIndex = (this.songs.length - 1)
		this.playSong()
	},

	nextSong() {
		if(this.audio.paused) this.audio.play()

		this.currentIndex++
		if(this.currentIndex === this.songs.length)
			this.currentIndex = 0
		this.playSong(this.currentIndex)
	},

	clickOnSong() {
		document.addEventListener("click", function(event) {
			if(event.target && event.target.className === "song-item") {
				Media.playSong(event.target.dataset.index)
			}
		})
	},

	writeHtml() {
		let html = ""
		html += "<ul class='playlist'>"
		for(let i = 0; i < this.songs.length; i++) {
			html += "<li class='song-item' data-index='" + i + "'>" + this.songs[i].artist + " - "
			html += this.songs[i].title + "</li>"
		}
		html += "</ul>"
		this.output.innerHTML = html
	}

}

Media.writeHtml()
Media.clickOnSong()
Media.autoPlay()