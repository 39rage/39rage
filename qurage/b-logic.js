let audio = new Audio();
let currentQueue = [];
let currentIndex = 0;
let isShuffle = false;
let repeatMode = 0; // 0:なし, 1:全リピ, 2:1曲リピ

function initApp() {
    renderAlbums();
    renderAllTracks();
    renderUnreleased();
    setupPlayer();
}

// アルバムグリッド生成
function renderAlbums() {
    const grid = document.getElementById('albumGrid');
    const discoAlbums = allAlbums.filter(a => a.category === 'discography');
    
    grid.innerHTML = discoAlbums.map(album => `
        <div class="album-item-wrapper">
            <div class="album-art-container" onclick="playAlbum('${album.id}')">
                <img src="${album.img}" class="album-art" alt="${album.title}">
                <div class="album-play-overlay">▶</div>
            </div>
            <a href="discography.html?id=${album.id}" class="album-info-link" style="text-decoration:none; color:inherit;">
                <span class="al-title">${album.title}</span>
                <span class="al-sub">${album.subtitle}</span>
            </a>
        </div>
    `).join('');
}

// 全曲リスト生成（アルバム古い順）
function renderAllTracks() {
    const list = document.getElementById('songList');
    const tracks = getSortedDiscoTracks();
    
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
    const discoAlbumIds = allAlbums.filter(a => a.category === 'discography').map(a => a.id);
    return allTracks.filter(t => discoAlbumIds.includes(t.albumId)).sort((a, b) => {
        const indexA = allAlbums.findIndex(alb => alb.id === a.albumId);
        const indexB = allAlbums.findIndex(alb => alb.id === b.albumId);
        if (indexA !== indexB) return indexA - indexB;
        return a.file.localeCompare(b.file);
    });
}

// UNRELEASED生成
function renderUnreleased() {
    const list = document.getElementById('unreleasedList');
    const unTracks = allTracks.filter(t => {
        const alb = allAlbums.find(a => a.id === t.albumId);
        return alb && alb.category === 'unreleased';
    });
    list.innerHTML = unTracks.map(track => {
        const album = allAlbums.find(a => a.id === track.albumId);
        return `
            <div class="song-item" onclick="playSingleTrack('${track.file}')">
                <span class="s-num">👾</span>
                <img src="${album.img}" class="s-art">
                <div class="s-title">${track.title}</div>
                <div class="s-album">${album.title}</div>
            </div>`;
    }).join('');
}

// 再生ロジック
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
    playFromMainList(Math.floor(Math.random() * getSortedDiscoTracks().length));
}

function loadAndPlay(idx) {
    currentIndex = idx;
    const track = currentQueue[currentIndex];
    const album = allAlbums.find(a => a.id === track.albumId);

    audio.src = 'audio/' + track.file;
    audio.play();

    // UI更新
    document.getElementById('playerTitle').textContent = track.title;
    document.getElementById('playerSub').textContent = album.title;
    const art = document.getElementById('playerArt');
    art.src = album.img;
    art.classList.add('show');
    
    const booth = document.getElementById('boothLink');
    if (album.booth && album.booth !== '#') {
        booth.href = album.booth;
        booth.style.display = 'block';
    } else {
        booth.style.display = 'none';
    }

    renderQueue();
}

// プレイヤー基本操作
function setupPlayer() {
    const playBtn = document.getElementById('playBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const queueBtn = document.getElementById('queueBtn');

    playBtn.addEventListener('click', () => {
        if (!audio.src) playAllTracks();
        else if (audio.paused) audio.play();
        else audio.pause();
    });

    document.getElementById('nextBtn').addEventListener('click', nextTrack);
    document.getElementById('prevBtn').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + currentQueue.length) % currentQueue.length;
        loadAndPlay(currentIndex);
    });

    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
    });

    repeatBtn.addEventListener('click', () => {
        repeatMode = (repeatMode + 1) % 3;
        repeatBtn.classList.toggle('active', repeatMode > 0);
        repeatBtn.classList.toggle('repeat-one', repeatMode === 2);
        repeatBtn.textContent = repeatMode === 2 ? '🔂' : '🔁';
    });

    queueBtn.addEventListener('click', () => {
        document.getElementById('queueDrawer').classList.toggle('show');
    });

    audio.addEventListener('timeupdate', () => {
        if (!isNaN(audio.duration)) {
            document.getElementById('seekBar').value = (audio.currentTime / audio.duration) * 100;
            document.getElementById('currentTime').textContent = formatTime(audio.currentTime);
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        document.getElementById('duration').textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', () => {
        if (repeatMode === 2) audio.play();
        else nextTrack();
    });

    document.getElementById('seekBar').addEventListener('input', (e) => {
        audio.currentTime = (e.target.value / 100) * audio.duration;
    });

    document.getElementById('volumeBar').addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });
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
        return `
            <div class="q-item ${idx === currentIndex ? 'active' : ''}" onclick="loadAndPlay(${idx})">
                <img src="${album.img}" class="q-art">
                <div class="q-info">
                    <div>${track.title}</div>
                    <div style="font-size:0.6rem; opacity:0.6;">${album.title}</div>
                </div>
            </div>`;
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
