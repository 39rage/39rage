let audio = new Audio();
let currentQueue = [];
let currentIndex = 0;
let isShuffle = false;
let repeatMode = 0; 

function initApp() {
    renderAlbums();
    renderAllTracks();
    renderUnreleased();
    setupPlayer();
    setupMobilePlayer();
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
        div.onclick = () => playAlbum(album.id);
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
                <div class="s-info">
                    <div class="s-title">${track.title}</div>
                    <div class="s-album-name" style="font-size:0.7rem; color:#86868b">${album.title}</div>
                </div>
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
    const originalTracks = getSortedDiscoTracks();
    currentQueue = [...originalTracks];
    if (isShuffle) shuffleQueue();
    loadAndPlay(idx);
}

function playAlbum(albumId) {
    currentQueue = allTracks.filter(t => t.albumId === albumId).sort((a, b) => a.file.localeCompare(b.file));
    loadAndPlay(0);
}

function playAllTracks() { loadAndPlay(0); }
function shuffleAllTracks() { isShuffle = true; playFromMainList(Math.floor(Math.random() * currentQueue.length)); }

function loadAndPlay(idx) {
    currentIndex = idx;
    const track = currentQueue[currentIndex];
    if(!track) return;
    const album = allAlbums.find(a => a.id === track.albumId);

    audio.src = 'audio/' + track.file;
    audio.play();

    // UI更新 (Mini & Full)
    const titleText = `${track.title} / ${album.title}`;
    document.getElementById('playerTitleInfo').textContent = titleText;
    document.getElementById('fullPlayerTitle').textContent = track.title;
    document.getElementById('fullPlayerSub').textContent = album.title;

    // マーキー判定 (20文字以上)
    const desc = album.desc.replace(/<br>/g, " ");
    const marquee = document.getElementById('playerDescMarquee');
    marquee.textContent = desc;
    if (desc.length > 20) marquee.classList.add('active');
    else marquee.classList.remove('active');

    // ジャケ写更新（👾を隠して画像を表示）
    const miniArt = document.getElementById('playerArt');
    const defaultIcon = document.getElementById('playerDefaultIcon');
    miniArt.src = album.img;
    miniArt.classList.add('show');
    defaultIcon.style.display = 'none';
    document.getElementById('fullPlayerArt').src = album.img;

    const booth = document.getElementById('boothLink');
    if (album.booth && album.booth !== '#') { booth.href = album.booth; booth.style.display = 'flex'; } 
    else { booth.style.display = 'none'; }

    renderQueue();
}

function setupPlayer() {
    const playBtn = document.getElementById('playBtn');
    const fullPlayBtn = document.getElementById('fullPlayBtn');
    const volumeBtn = document.getElementById('volumeBtn');

    const togglePlay = () => {
        if (!audio.src) playAllTracks();
        else if (audio.paused) audio.play();
        else audio.pause();
    };

    playBtn.onclick = togglePlay;
    fullPlayBtn.onclick = togglePlay;

    audio.ontimeupdate = () => {
        if (!isNaN(audio.duration)) {
            const progress = (audio.currentTime / audio.duration) * 100;
            document.getElementById('seekBar').value = progress;
            document.getElementById('fullSeekBar').value = progress;
            const time = formatTime(audio.currentTime);
            document.getElementById('currentTime').textContent = time;
            document.getElementById('fullCurrentTime').textContent = time;
        }
    };
    audio.onloadedmetadata = () => {
        const duration = formatTime(audio.duration);
        document.getElementById('duration').textContent = duration;
        document.getElementById('fullDuration').textContent = duration;
    };
    audio.onended = () => { if (repeatMode === 2) audio.play(); else nextTrack(); };
    audio.onplay = () => { playBtn.textContent = "⏸"; fullPlayBtn.textContent = "⏸"; };
    audio.onpause = () => { playBtn.textContent = "▶"; fullPlayBtn.textContent = "▶"; };

    document.getElementById('seekBar').oninput = (e) => audio.currentTime = (e.target.value / 100) * audio.duration;
    document.getElementById('fullSeekBar').oninput = (e) => audio.currentTime = (e.target.value / 100) * audio.duration;
    document.getElementById('volumeBar').oninput = (e) => audio.volume = e.target.value / 100;
    volumeBtn.onclick = () => document.getElementById('volumePopup').classList.toggle('show');
}

function setupMobilePlayer() {
    const mini = document.getElementById('expandTrigger');
    const full = document.getElementById('fullPlayer');
    const close = document.getElementById('closeFullPlayer');
    const openQueue = document.getElementById('openQueueBtn');
    const fullQueue = document.getElementById('fullQueue');

    mini.onclick = () => full.classList.add('show');
    close.onclick = () => {
        full.classList.remove('show');
        fullQueue.classList.remove('show');
    };
    openQueue.onclick = () => fullQueue.classList.toggle('show');
}

function nextTrack() {
    currentIndex = (currentIndex + 1) % currentQueue.length;
    loadAndPlay(currentIndex);
}

function prevTrack() {
    currentIndex = (currentIndex - 1 + currentQueue.length) % currentQueue.length;
    loadAndPlay(currentIndex);
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    if (isShuffle) shuffleQueue();
    else currentQueue = getSortedDiscoTracks();
    renderQueue();
}

function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3;
}

function renderQueue() {
    const listHtml = currentQueue.map((track, idx) => {
        const album = allAlbums.find(a => a.id === track.albumId);
        return `<div class="q-item ${idx === currentIndex ? 'active' : ''}" onclick="loadAndPlay(${idx})">
                <img src="${album.img}" class="q-art"><div>${track.title}</div></div>`;
    }).join('');
    document.getElementById('fullQueueList').innerHTML = listHtml;
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
