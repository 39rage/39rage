let audio = new Audio();
let currentTracks = [];
let currentIndex = 0;

function initAppPage() {
    renderAlbums();
    renderSongs();
    renderUnreleased();
    setupPlayer();
}

// アルバムグリッド生成
function renderAlbums() {
    const grid = document.getElementById('albumGrid');
    grid.innerHTML = allAlbums
        .filter(a => a.category === 'discography')
        .map(album => `
            <a href="discography.html?id=${album.id}" class="album-item">
                <img src="${album.img}" class="album-art">
                <span class="album-title">${album.title}</span>
                <span class="album-meta">${album.subtitle}</span>
            </a>
        `).join('');
}

// トップソング（全曲）生成
function renderSongs() {
    const list = document.getElementById('songList');
    const discoTracks = allTracks.filter(t => {
        const alb = allAlbums.find(a => a.id === t.albumId);
        return alb && alb.category === 'discography';
    });
    
    currentTracks = discoTracks;

    list.innerHTML = discoTracks.map((track, idx) => {
        const album = allAlbums.find(a => a.id === track.albumId);
        return `
            <div class="song-item" onclick="playTrack(${idx})">
                <span class="s-num">${idx + 1}</span>
                <img src="${album.img}" class="s-art">
                <span class="s-title">${track.title}</span>
                <span class="s-album">${album.title}</span>
            </div>
        `;
    }).join('');
}

// UNRELEASED生成
function renderUnreleased() {
    const list = document.getElementById('unreleasedList');
    const unreleasedTracks = allTracks.filter(t => {
        const alb = allAlbums.find(a => a.id === t.albumId);
        return alb && alb.category === 'unreleased';
    });

    list.innerHTML = unreleasedTracks.map((track, idx) => {
        const album = allAlbums.find(a => a.id === track.albumId);
        return `
            <div class="song-item" onclick="playTrackByFile('${track.file}')">
                <span class="s-num">👾</span>
                <img src="${album.img}" class="s-art">
                <span class="s-title">${track.title}</span>
                <span class="s-album">${album.title}</span>
            </div>
        `;
    }).join('');
}

// プレイヤー制御
function setupPlayer() {
    const playBtn = document.getElementById('playBtn');
    const seekBar = document.getElementById('seekBar');
    const currentTimeText = document.getElementById('currentTime');
    const durationText = document.getElementById('duration');

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            if (!audio.src) playTrack(0);
            else audio.play();
        } else {
            audio.pause();
        }
        updatePlayIcon();
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        let nextIdx = (currentIndex + 1) % currentTracks.length;
        playTrack(nextIdx);
    });

    document.getElementById('prevBtn').addEventListener('click', () => {
        let nextIdx = (currentIndex - 1 + currentTracks.length) % currentTracks.length;
        playTrack(nextIdx);
    });

    audio.addEventListener('timeupdate', () => {
        if (!isNaN(audio.duration)) {
            seekBar.value = (audio.currentTime / audio.duration) * 100;
            currentTimeText.textContent = formatTime(audio.currentTime);
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        durationText.textContent = formatTime(audio.duration);
    });

    seekBar.addEventListener('input', () => {
        audio.currentTime = (seekBar.value / 100) * audio.duration;
    });

    audio.addEventListener('play', () => updatePlayIcon());
    audio.addEventListener('pause', () => updatePlayIcon());
}

function playTrack(idx) {
    currentIndex = idx;
    const track = currentTracks[idx];
    const album = allAlbums.find(a => a.id === track.albumId);
    
    audio.src = 'audio/' + track.file;
    audio.play();

    document.getElementById('playerTitle').textContent = track.title;
    document.getElementById('playerArtist').textContent = album.title;
    document.getElementById('miniJacket').src = album.img;
}

function playTrackByFile(file) {
    const track = allTracks.find(t => t.file === file);
    const album = allAlbums.find(a => a.id === track.albumId);
    audio.src = 'audio/' + file;
    audio.play();
    document.getElementById('playerTitle').textContent = track.title;
    document.getElementById('playerArtist').textContent = album.title;
    document.getElementById('miniJacket').src = album.img;
}

function updatePlayIcon() {
    const playBtn = document.getElementById('playBtn');
    playBtn.textContent = audio.paused ? "▶" : "⏸";
}

function formatTime(seconds) {
    let m = Math.floor(seconds / 60);
    let s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0'+s : s}`;
}
