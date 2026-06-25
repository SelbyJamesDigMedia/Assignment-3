//creates new variables for each audio file
const padOriginal = new Audio("Assets/Music/PadOriginal.wav")
const padReverb = new Audio("Assets/Music/PadReverb.wav");
const bassOriginal = new Audio("Assets/Music/ReeseOriginal.wav")
const bassDistorted = new Audio("Assets/Music/ReeseDistorted.wav")
const drumsOriginal = new Audio("Assets/Music/DrumsOriginal.wav")
const drumsDelay = new Audio("Assets/Music/DrumsDelay.wav")

//I decided to use an array for managing all of the audio files at once instead of writing code for each track individually
const allAudio = [padOriginal,padReverb,bassOriginal,bassDistorted,drumsOriginal,drumsDelay]

//I created a command that loops all of the audio through the array
allAudio.forEach(audioFile =>{
    audioFile.loop = true
})

//Initialise all of the values
let masterVolume = 1
let playbackSpeed = 1
let padVolume = 0.5
let bassVolume = 0.5
let drumsVolume = 0.5
let padEffect = 0
let bassEffect = 0
let drumsEffect = 0

//this variable stores what planet is actively being dragged
let draggedPlanet = null;

//this code makes it so that when the user clicks anywhere on the window, the music starts playing.
//the function plays all of the audio files at the same time and removes the event listiner so that the audio doesn't replay
window.addEventListener("mousedown", function startAudio() {
    allAudio.forEach(audioFile => {
        audioFile.currentTime = 0;
        audioFile.play();
    });
    window.removeEventListener("mousedown", startAudio);
});

//all planets from the array are given an event listener where when they are selected, the planets that's being dragged replaces the dragged planet variable
document.querySelectorAll(".planet").forEach(planet => {
    planet.addEventListener("mousedown", () => {
        draggedPlanet = planet
    })
})

//I added this so that when the user stops dragging, the variable returns to null so the object doesn't continue to follow the mouse
window.addEventListener("mouseup", () => {
    draggedPlanet = null
})

//this event listener waits until the dragged planet variable is not null and moves the selected planet to the mouse position on the screen
//I used the following website to gain insight on how to retrieve the x and y values of elements when dragged: https://www.tutorialspoint.com/article/retrieve-the-position-x-y-of-an-html-element
window.addEventListener("mousemove", (event) => {
    if (!draggedPlanet) return
    //the -60 allows for the cursor to be centered on the planets when dragging
    draggedPlanet.style.left = event.clientX - 60 + "px"
    draggedPlanet.style.top = event.clientY - 60 + "px"
    updatePlanet(draggedPlanet)
})

//to be able to use the planets coordinates on the screen as a way of altering the effects, volume and speed of the different instruments I added this function which converts the x and y positions into a number between 0 and 1
function xPercentageConversion(x) {
    return x / window.innerWidth
}

function yPercentageConversion(y) {
    return 1-(y / window.innerHeight)
}

// here is the audio control function. All of the audio plays at the same time however, the volume of each file plays depending on the instrument volume, effect amount and master volume
//since all of the values are in percentage form, I can multiply them all together to get the final volume value
function updateAudio(){
    //"1-padEffect" returns the opposite effect percentage to make sure that the original end effect audio don't collide
    padOriginal.volume = padVolume * (1-padEffect) * masterVolume
    padReverb.volume = padVolume * padEffect * masterVolume
    bassOriginal.volume = bassVolume * (1-bassEffect) * masterVolume
    bassDistorted.volume = bassVolume * bassEffect * masterVolume
    drumsOriginal.volume = drumsVolume * (1-drumsEffect) * masterVolume
    drumsDelay.volume = drumsVolume * drumsEffect * masterVolume

    //I used the array to manipulate all of the audio file playback speeds together.
    //I can't control the master volume through the array as it overwrites the instrument and effect volumes
    allAudio.forEach(audioFile => {
        audioFile.playbackRate = playbackSpeed
    })
}

//returns the mouse x and y positions to alter the volume and effects of the planets or volume and playback speed of the master
function updatePlanet(planet){
    const x = planet.offsetLeft
    const y = planet.offsetTop
//depending on what tag the planet being dragged has, the corresponding values are altered accordingly
    if(planet.id === "pad"){
        padVolume = yPercentageConversion(y)
        padEffect = xPercentageConversion(x)
    }
    if(planet.id === "bass"){
        bassVolume = yPercentageConversion(y)
        bassEffect = xPercentageConversion(x)
    }
    if(planet.id === "drums"){
        drumsVolume = yPercentageConversion(y)
        drumsEffect = xPercentageConversion(x)
    }
    if(planet.id === "sun"){
        masterVolume = yPercentageConversion(y)
        //I wanted the user to be able to alter the playback speed from 0.5 to 1.5 speed which is why I use addition instead of multiplication here
        playbackSpeed = 0.5 + xPercentageConversion(x)
    }
    updateAudio()
}

updateAudio()