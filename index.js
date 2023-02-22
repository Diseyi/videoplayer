const openInputButton = document.getElementById('openInput');
const closeInputButton = document.getElementById('closeInput');
const filename = document.getElementById('filename');
const videoplayer = document.getElementById('videoplayer');
const canvas = document.getElementById('dropbox');
const input = document.getElementById('input');
const video = document.getElementById('video');
const play = document.getElementById('play');
const stop = document.getElementById('stop');
const rewind = document.getElementById('rwd');
const forward = document.getElementById('fwd');
const timer = document.getElementById('timer');
const videotime = document.getElementById('videotime');
const div = document.getElementById('notes');
const playspan = document.getElementById('playspan');
const pausespan = document.getElementById('pausespan');
const timestampspan = document.querySelectorAll('li');

let commentlist;
let videoname;
let savedNotes = {}

const secondsToMinute = (time) => {
    const seconds = time;
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = (seconds % 60).toFixed()
    const secondsString = secondsRemainder.toString().padStart(2, "0")
    return `${minutes}:${secondsString}`
}

const getVideo = () => {
    const videofile = video.files[0]
    filename.innerText = videofile.name
    videoname = videofile.name
    const videoURL = URL.createObjectURL(videofile);
    videoplayer.style.display = "block"
    videoplayer.removeAttribute('controls')
    videoplayer.src = videoURL

    getFromLocalStorage()
}

const playVideo = () => {
    if (videoplayer.paused) {
        videoplayer.play()
        playspan.style.display = "none"
        pausespan.style.display = "block"
    } else {
        videoplayer.pause();
        pausespan.style.display = "none"
        playspan.style.display = "block"
    }
}

const stopVideo = () => {
    videoplayer.pause();
    videoplayer.currentTime = 0;
    pausespan.style.display = "none";
    playspan.style.display = "block";
}

const videoTime = () => {
    const time = secondsToMinute(videoplayer.duration)
    videotime.innerText = time;
}

const timestamp = () => {
    const minutes = Math.floor(videoplayer.currentTime / 60);
    const seconds = Math.floor(videoplayer.currentTime - minutes * 60);

    const minuteValue = minutes.toString().padStart(2, '0');
    const secondValue = seconds.toString().padStart(2, '0');

    const videoplayerTime = `${minuteValue}:${secondValue}`;
    timer.innerText = videoplayerTime;
}

const rewindVideo = () => {
    videoplayer.currentTime -= 5;
}

const forwardVideo = () => {
    videoplayer.currentTime += 5;
}

const showInputBox = () => {
    input.style.display = "block";
    closeInputButton.style.display = "block";
    openInputButton.style.display = "none";
}

const gotoTimestamp = (e) => {
    console.log(e)
}

const saveToLocalStorage = (title, value) => {
    localStorage.setItem(title, value)
}

const getFromLocalStorage = () => {
    const local = { ...localStorage }
    for (const key in local) {
        if (key === videoname) {
            savedNotes = JSON.parse(localStorage.getItem(key))
            break;
        }
    }

    for (const key in savedNotes) {
        const p = document.createElement('li')
        const timestamp = document.createElement('span')
        const comment = document.createElement('span')

        timestamp.setAttribute('class', 'timestamp')
        timestamp.innerText = `${key}`
        comment.innerText = `: ${savedNotes[key]}`

        p.appendChild(timestamp)
        p.appendChild(comment)
        div.appendChild(p)
    }
    commentlist = document.querySelectorAll('.timestamp');

    if (commentlist && commentlist.length > 0) {
        for (let i = 0; i < commentlist.length; i++) {
            commentlist[i].addEventListener('click', (e) => {
                const text = commentlist[i].textContent;
                const timeArray = text.split(":")
                let totalSeconds = 0;

                for (let i = 0; i < timeArray.length; i++) {
                    let value = parseInt(timeArray[i], 10);
                    if (!isNaN(value)) return;
                    if (i === 0) {
                        totalSeconds += value;
                    }
                    if (i === 1) {
                        totalSeconds += value;
                    }
                    if (i === 2) {
                        totalSeconds += value * 60;
                    }
                }
                videoplayer.currentTime = totalSeconds
            })
        }
    }

}

const closeEvents = () => {
    input.style.display = "none";
    closeInputButton.style.display = "none";
    openInputButton.style.display = "block";
}

const closeInputBox = () => {
    if (input.value === '') {
        alert('no comment was added')
        closeEvents()
        return;
    }
    const value = input.value
    const p = document.createElement('li')
    const timestamp = document.createElement('span')
    const comment = document.createElement('span')

    timestamp.setAttribute('class', 'timestamp')

    const time = secondsToMinute(videoplayer.currentTime)


    timestamp.innerText = `${time}`
    comment.innerText = `: ${value}`

    savedNotes[time] = value

    p.appendChild(timestamp)
    p.appendChild(comment)

    div.appendChild(p)
    input.value = ""
    saveToLocalStorage(videoname, JSON.stringify(savedNotes))
    closeEvents()
}


video.addEventListener('change', getVideo)
play.addEventListener('click', playVideo)
rewind.addEventListener('click', rewindVideo)
stop.addEventListener('click', stopVideo)
video.addEventListener('ended', stopVideo)
videoplayer.addEventListener('loadedmetadata', videoTime);
videoplayer.addEventListener('timeupdate', timestamp)
forward.addEventListener('click', forwardVideo)
openInputButton.addEventListener('click', showInputBox)
closeInputButton.addEventListener('click', closeInputBox)