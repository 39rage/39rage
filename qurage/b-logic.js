let audio = new Audio();
let currentQueue = [];
let currentIndex = 0;
let isShuffle = false;
let repeatMode = 0; // 0:None, 1:All, 2:One

function initApp() {
    renderAlbums();
    renderAllTracks();
    renderUnreleased();
    setupPlayer();
    setupExpansion();
}

// データ描画系
function renderAlbums() {
    const grid = document.getElementById('albumGrid');
    allAlbums.filter(a => a.category === 'discography').forEach(album => {
        const div = document.createElement('div');
        div.className = 'album-item-wrapper';
        div.innerHTML = `<div class="album-art-container"><img src="${album.img}" class="album-art"><div class="album-play-overlay">▶</div></div><div class="al-title">${album.title}</div><div class="al-sub">${album.subtitle}</div>`;
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
        return `<div class="song-item" onclick="playFromMainList(${idx})"><span class="s-num">${idx + 1}</span><img src="${album.img}" class="s-art"><div class="s-info"><div class="s-title">${track.title}</div><div style="font-size:0.7rem; color:#86868b">${album.title}</div></div></div>`;
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
        div.innerHTML = `<span class="s-num">👾</span><img src="${album.img}" class="s-art"><div class="s-info"><div class="s-title">${track.title}</div><div style="font-size:0.7rem; color:#86868b">${album.title}</div></div>`;
        div.onclick = () => { currentQueue = [track]; loadAndPlay(0); };
        list.appendChild(div);
    });
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
    document.getElementById('playerTitleInfo').textContent = `${track.title} / ${album.title}`;
    document.getElementById('playerDesc').textContent = album.desc.replace(/<br>/g, " ");
    
    document.getElementById('fullPlayerTitle').textContent = track.title;
    document.getElementById('fullPlayerSub').textContent = album.title;

    // 画像更新
    document.getElementById('playerArt').src = album.img;
    document.getElementById('playerArt').classList.add('show');
    document.getElementById('playerDefaultIcon').style.display = 'none';
    document.getElementById('fullPlayerArt').src = album.img;

    const booth = document.getElementById('boothLink');
    if (album.booth && album.booth !== '#') { booth.href = album.booth; booth.style.display = 'flex'; } 
    else { booth.style.display = 'none'; }

    renderQueue();
}

// プレイヤー基本設定
function setupPlayer() {
    const playBtns = [document.getElementById('playBtn'), document.getElementById('mobilePlayBtn'), document.getElementById('fullPlayBtn')];
    
    playBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation(); // スマホで全画面が開くのを防ぐ
            if (!audio.src) playAllTracks();
            else if (audio.paused) audio.play();
            else audio.pause();
        };
    });

    audio.ontimeupdate = () => {
        if (!isNaN(audio.duration)) {
            const prog = (audio.currentTime / audio.duration) * 100;
            document.getElementById('seekBar').value = prog;
            document.getElementById('fullSeekBar').value = prog;
            document.getElementById('currentTime').textContent = formatTime(audio.currentTime);
            document.getElementById('fullCurrentTime').textContent = formatTime(audio.currentTime);
        }
    };
    audio.onloadedmetadata = () => {
        const dur = formatTime(audio.duration);
        document.getElementById('duration').textContent = dur;
        document.getElementById('fullDuration').textContent = dur;
    };
    audio.onplay = () => playBtns.forEach(b => b.textContent = "⏸");
    audio.onpause = () => playBtns.forEach(b => b.textContent = "▶");
    audio.onended = () => { if (repeatMode === 2) audio.play(); else nextTrack(); };

    document.getElementById('seekBar').oninput = (e) => audio.currentTime = (e.target.value / 100) * audio.duration;
    document.getElementById('fullSeekBar').oninput = (e) => audio.currentTime = (e.target.value / 100) * audio.duration;
}

// スマホ拡大 ＆ キュー
function setupExpansion() {
    const full = document.getElementById('fullPlayer');
    document.getElementById('expandTrigger').onclick = () => {
        if(window.innerWidth <= 900) full.classList.add('show');
    };
    document.querySelector('.mobile-expand-btn').onclick = () => full.classList.add('show');
    document.getElementById('closeFullPlayer').onclick = () => {
        full.classList.remove('show');
        document.getElementById('fullQueue').classList.remove('show');
    };
    document.getElementById('openQueueBtn').onclick = () => {
        document.getElementById('fullQueue').classList.toggle('show');
    };
}

function nextTrack() { currentIndex = (currentIndex + 1) % currentQueue.length; loadAndPlay(currentIndex); }
function prevTrack() { currentIndex = (currentIndex - 1 + currentQueue.length) % currentQueue.length; loadAndPlay(currentIndex); }

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
