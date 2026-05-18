let audio = new Audio();
let currentQueue = [];
let currentIndex = 0;
let isShuffle = false;
let repeatMode = 0; // 0:None, 1:All, 2:One

const playPath = "M8 5v14l11-7z";
const pausePath = "M6 19h4V5H6v14zm8-14v14h4V5h-4z";

function initApp() {
    renderAlbums();
    renderAllTracks();
    renderUnreleased();
    setupPlayer();
}

function renderAlbums() {
    const grid = document.getElementById('albumGrid');
    allAlbums.filter(a => a.category === 'discography').forEach(album => {
        const div = document.createElement('div');
        div.className = 'album-item-wrapper';
        div.innerHTML = `
            <div class="album-art-container">
                <img src="${album.img}" class="album-art" alt="${album.title}">
                <div class="album-play-overlay">▶</div>
            </div>
            <div class="al-title">${album.title}</div>
            <div class="al-sub">${album.subtitle}</div>`;
        div.querySelector('.album-art-container').onclick = () => playAlbum(album.id);
        grid.appendChild(div);
    });
}

function renderAllTracks() {
    const list = document.getElementById('songList');
    const tracks = getSortedDiscoTracks();
    currentQueue = tracks; 
    list.innerHTML = tracks.map((track, idx) => {
        const album = allAlbums.find(a => a.id === track.albumId);
        return `
            <div class="song-item" onclick="playFromMainList(${idx})">
                <span class="s-num">${idx + 1}</span>
                <img src="${album.img}" class="s-art">
                <div class="s-title">${track.title}</div>
                <div class="s-album">${album.title}</div>
            </div>`;
    }).join('');
}

function getSortedDiscoTracks() {
    return allTracks.filter(t => {
        const alb = allAlbums.find(a => a.id === t.albumId);
        return alb && alb.category === 'discography';
    }).sort((a, b) => {
        const indexA = allAlbums.findIndex(alb => alb.id === a.albumId);
        const indexB = allAlbums.findIndex(alb => alb.id === b.albumId);
        if (indexA !== indexB) return indexA - indexB;
        return a.file.localeCompare(b.file);
    });
}

function renderUnreleased() {
    const list = document.getElementById('unreleasedList');
    allTracks.filter(t => {
        const alb = allAlbums.find(a => a.id === t.albumId);
        return alb && alb.category === 'unreleased';
    }).forEach(track => {
        const album = allAlbums.find(a => a.id === track.albumId);
        const div = document.createElement('div');
        div.className = 'song-item';
        div.innerHTML = `
            <span class="s-num">👾</span>
            <img src="${album.img}" class="s-art">
            <div class="s-title">${track.title}</div>
            <div class="s-album">${album.title}</div>`;
        div.onclick = () => { currentQueue = [track]; loadAndPlay(0); };
        list.appendChild(div);
    });
}

function playFromMainList(idx) {
    currentQueue = getSortedDiscoTracks();
    if (isShuffle) shuffleQueue();
    loadAndPlay(idx);
}

function playAlbum(albumId) {
    currentQueue = allTracks.filter(t => t.albumId === albumId).sort((a, b) => a.file.localeCompare(b.file));
    loadAndPlay(0);
}

function playAllTracks() {
    isShuffle = false;
    document.getElementById('shuffleBtn').classList.remove('active');
    playFromMainList(0);
}

function shuffleAllTracks() {
    isShuffle = true;
    document.getElementById('shuffleBtn').classList.add('active');
    const tracks = getSortedDiscoTracks();
    currentQueue = [...tracks];
    shuffleQueue();
    loadAndPlay(0);
}

function loadAndPlay(idx) {
    currentIndex = idx;
    const track = currentQueue[currentIndex];
    if(!track) return;
    const album = allAlbums.find(a => a.id === track.albumId);

    audio.src = 'audio/' + track.file;
    audio.play();

    document.getElementById('playerTitleInfo').textContent = `${track.title} / ${album.title}`;
    
    // 曲紹介の更新（マーキー）
    const marquee = document.getElementById('playerDescMarquee');
    marquee.textContent = album.desc.replace(/<br>/g, " ");
    
    const art = document.getElementById('playerArt');
    art.src = album.img;
    art.classList.add('show');
    
    const booth = document.getElementById('boothLink');
    if (album.booth && album.booth !== '#') {
        booth.href = album.booth;
        booth.style.display = 'flex';
    } else { booth.style.display = 'none'; }

    renderQueue();
}

function setupPlayer() {
    const playBtn = document.getElementById('playBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const volumeBtn = document.getElementById('volumeBtn');

    playBtn.onclick = () => {
        if (!audio.src) playAllTracks();
        else if (audio.paused) audio.play();
        else audio.pause();
    };

    document.getElementById('nextBtn').onclick = nextTrack;
    document.getElementById('prevBtn').onclick = () => {
        currentIndex = (currentIndex - 1 + currentQueue.length) % currentQueue.length;
        loadAndPlay(currentIndex);
    };

    shuffleBtn.onclick = () => { 
        isShuffle = !isShuffle; 
        shuffleBtn.classList.toggle('active', isShuffle); 
    };

    repeatBtn.onclick = () => {
        repeatMode = (repeatMode + 1) % 3;
        repeatBtn.classList.toggle('active', repeatMode > 0);
        repeatBtn.classList.toggle('repeat-one', repeatMode === 2);
    };

    volumeBtn.onclick = () => document.getElementById('volumePopup').classList.toggle('show');
    document.getElementById('queueBtn').onclick = () => document.getElementById('queueDrawer').classList.toggle('show');

    audio.ontimeupdate = () => {
        if (!isNaN(audio.duration)) {
            document.getElementById('seekBar').value = (audio.currentTime / audio.duration) * 100;
            document.getElementById('currentTime').textContent = formatTime(audio.currentTime);
        }
    };
    audio.onloadedmetadata = () => document.getElementById('duration').textContent = formatTime(audio.duration);
    audio.onended = () => { if (repeatMode === 2) audio.play(); else nextTrack(); };
    audio.onplay = () => playBtn.querySelector('path').setAttribute('d', pausePath);
    audio.onpause = () => playBtn.querySelector('path').setAttribute('d', playPath);

    document.getElementById('seekBar').oninput = (e) => audio.currentTime = (e.target.value / 100) * audio.duration;
    document.getElementById('volumeBar').oninput = (e) => audio.volume = e.target.value / 100;
}

function nextTrack() {
    if (currentIndex >= currentQueue.length - 1 && repeatMode === 0) return;
    currentIndex = (currentIndex + 1) % currentQueue.length;
    loadAndPlay(currentIndex);
}

function renderQueue() {
    const qList = document.getElementById('queueList');
    qList.innerHTML = currentQueue.map((track, idx) => {
        const album = allAlbums.find(a => a.id === track.albumId);
        return `<div class="q-item ${idx === currentIndex ? 'active' : ''}" onclick="loadAndPlay(${idx})">
                <img src="${album.img}" class="q-art"><div>${track.title}</div></div>`;
    }).join('');
}

function formatTime(s) {
    const m = Math.floor(s / 60);
    const rs = Math.floor(s % 60);
    return `${m}:${rs < 10 ? '0' + rs : rs}`;
}

function shuffleQueue() {
    for (let i = currentQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentQueue[i], currentQueue[j]] = [currentQueue[j], currentQueue[i]];
    }
}
