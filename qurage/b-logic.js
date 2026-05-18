let audio = new Audio();
let currentTracks = [];
let currentIndex = 0;

function initApp() {
    renderGrid();
    renderAllSongs();
    renderUnreleased();
    setupPlayer();
}

// アルバムグリッド
function renderGrid() {
    const grid = document.getElementById('albumGrid');
    const discoAlbums = allAlbums.filter(a => a.category === 'discography');
    
    grid.innerHTML = discoAlbums.map(album => `
        <a href="discography.html?id=${album.id}" class="album-item">
            <img src="${album.img}" alt="${album.title}">
            <span class="al-title">${album.title}</span>
            <span class="al-sub">${album.subtitle}</span>
        </a>
    `).join('');
}

// トップソング
function renderAllSongs() {
    const list = document.getElementById('songList');
    // discographyの全曲を取得して日付順に並び替え
    const discoTracks = allTracks.filter(t => {
        const alb = allAlbums.find(a => a.id === t.albumId);
        return alb && alb.category === 'discography';
    }).sort((a, b) => b.file.localeCompare(a.file)); // 新しい順

    currentTracks = discoTracks;

    list.innerHTML = discoTracks.map((track, idx) => {
        const album = allAlbums.find(a => a.id === track.albumId);
        return `
            <div class="song-item" onclick="playTrack(${idx})">
                <span class="s-num">${idx + 1}</span>
                <img src="${album.img}" class="s-art">
                <div class="s-info">
                    <span class="s-title">${track.title}</span>
                    <span class="s-album">${album.title}</span>
                </div>
            </div>
        `;
    }).join('');
}

// UNRELEASED
function renderUnreleased() {
    const list = document.getElementById('unreleasedList');
    const unTracks = allTracks.filter(t => {
        const alb = allAlbums.find(a => a.id === t.albumId);
        return alb && alb.category === 'unreleased';
    });

    list.innerHTML = unTracks.map((track) => {
        const album = allAlbums.find(a => a.id === track.albumId);
        return `
            <div class="song-item" onclick="playSpecificTrack('${track.file}')">
                <span class="s-num">👾</span>
                <img src="${album.img}" class="s-art">
                <div class="s-info">
                    <span class="s-title">${track.title}</span>
                    <span class="s-album">${album.title}</span>
                </div>
            </div>
        `;
    }).join('');
}

// プレイヤー
function setupPlayer() {
    const playBtn = document.getElementById('playBtn');
    const seekBar = document.getElementById('seekBar');

    playBtn.addEventListener('click', () => {
        if (!audio.src && currentTracks.length > 0) playTrack(0);
        else if (audio.paused) audio.play();
        else audio.pause();
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        playTrack((currentIndex + 1) % currentTracks.length);
    });

    document.getElementById('prevBtn').addEventListener('click', () => {
        playTrack((currentIndex - 1 + currentTracks.length) % currentTracks.length);
    });

    audio.addEventListener('timeupdate', () => {
        if (!isNaN(audio.duration)) {
            seekBar.value = (audio.currentTime / audio.duration) * 100;
        }
    });

    seekBar.addEventListener('input', () => {
        audio.currentTime = (seekBar.value / 100) * audio.duration;
    });

    audio.addEventListener('play', () => playBtn.textContent = "⏸");
    audio.addEventListener('pause', () => playBtn.textContent = "▶");
}

function playTrack(idx) {
    currentIndex = idx;
    const track = currentTracks[idx];
    const album = allAlbums.find(a => a.id === track.albumId);
    
    audio.src = 'audio/' + track.file;
    audio.play();

    document.getElementById('playerTitle').textContent = track.title;
    document.getElementById('playerAlbum').textContent = album.title;
    document.getElementById('playerArt').src = album.img;
}

function playSpecificTrack(file) {
    const track = allTracks.find(t => t.file === file);
    const album = allAlbums.find(a => a.id === track.albumId);
    audio.src = 'audio/' + file;
    audio.play();
    document.getElementById('playerTitle').textContent = track.title;
    document.getElementById('playerAlbum').textContent = album.title;
    document.getElementById('playerArt').src = album.img;
}
