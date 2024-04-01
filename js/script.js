console.log("let's write javascript");
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds (seconds) {
if (isNaN(seconds) || seconds < 0) {
return "00:00";
}
const minutes = Math.floor(seconds / 60);
const remainingSeconds = Math.floor(seconds % 60);
const formattedSeconds=String (remainingSeconds). padStart(2, '0');
const formattedMinutes = String(minutes). padStart(2, '0'); 
return `${formattedMinutes}:${formattedSeconds}`;

}

async function getSongs(folder){
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3002/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML=response;
    let as = div.getElementsByTagName("a");
     songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    //play the first song in album


    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUl.innerHTML = "";
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li><img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20"," ")}</div>
                                <div>Harry </div>
                            </div>
                            <div class="playnow">
                                <span>Play Now </span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div></li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
        
    });

    return songs;
}  
const playMusic = (track,pause=false)=>{
    // let audio = new Audio("/songs/"+track);
    currentSong.src = `/${currFolder}/` + track;
    if(!pause){
        currentSong.play();
        play.src = "img/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML=decodeURI(track);
    document.querySelector(".songtime").innerHTML="00:00 / 00:00";
}    

async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:3002/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML=response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
        
        if(e.href.includes("/songs")){
           let folder = e.href.split("/").slice(-2)[0];
            //get the meta data of the folder
            let a = await fetch(`http://127.0.0.1:3002/songs/${folder}/info.json`);
            let response = await a.json();
            // console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML  + `<div data-folder="${folder}" class="card">
            <div  class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="58" height="50">
                    <!-- Green circular background -->
                    <circle cx="18" cy="18" r="16" fill="#1ed760"></circle>
                    <!-- Correctly centered play icon -->
                    <path transform="scale(0.75) translate(4,4)"
                        d="M16 25.3915V12.6085L26.2264 19L16 25.3915ZM14 10.8042V27.1958C14 27.9813 14.8639 28.46 15.53 28.0437L28.6432 19.848C29.2699 19.4563 29.2699 18.5437 28.6432 18.152L15.53 9.95621C14.8639 9.53993 14 10.0188 14 10.8042Z"
                        fill="#000000"></path>
                </svg>
            </div>
            <img src="/songs/${folder}/cover.jpeg" alt="card1">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`;
        }
    }
    //load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            // console.log(item,item.currentTarget.dataset);
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);  
            playMusic(songs[0])
           
        })
    })
}

async function main(){

    //get the list of all songs   
   await getSongs("songs/ncs");     

    playMusic(songs[0],true)

    //display all the  alums on the page
    displayAlbums();


    //Attach an event listener to play,next and previous
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "img/pause.svg";
        }
        else{
            currentSong.pause();
            play.src = "img/play.svg";
        }
    })

    //listen for timeupdate event
    currentSong.addEventListener("timeupdate",()=>{
        // console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration) }`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    })

    //add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration )* percent)/100;
    })

    //add an event listner for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0"
    })

    //add an event listner for close
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%"
    })

    //add eventlistner on previous
    previous.addEventListener("click",()=>{ 
        console.log('previous click');
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index-1) >= 0){

            playMusic(songs[index-1])
        }
    })

    //add eventlistner on next
    next.addEventListener("click",()=>{
        currentSong.pause();
        console.log('next click');
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index+1) < songs.length){

            playMusic(songs[index+1])
        }
    })


    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("setting volume to",e.target.value,"/ 100");
        currentSong.volume = parseInt(e.target.value)/100;
        
    })

    //Attach an event listener to mute and unmute
    document.querySelector(".volume>img").addEventListener("click",e=>{
        // console.log(e.target);
        if(e.target.src.includes("img/volume.svg")){
            e.target.src =  e.target.src.replace("img/volume.svg","img/mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("img/mute.svg","img/volume.svg");
            currentSong.volume = 0.7;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 50;
        }
    })
}
main();
 