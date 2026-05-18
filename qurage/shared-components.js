// 共通のHTMLパーツを書き出す魔法
function renderHeader() {
    document.getElementById('header-part').innerHTML = `
        <header class="site-header">
            <button class="burger-btn" id="burgerBtn"><span class="burger-line"></span><span class="burger-line"></span><span class="burger-line"></span></button>
            <a href="index.html" class="header-logo">Qurage Music</a>
        </header>`;
}

function renderSidebar() {
    document.getElementById('sidebar-part').innerHTML = `
        <div class="hero-img-wrapper"><img src="https://fromtheasia.com/wp-content/uploads/NCG292.jpg" alt="Qurage" class="hero-img-left"></div>
        <div class="profile-text-area">
            <div class="profile-header">
                <h1>Qurage</h1>
                <a href="https://x.com/_caSBg" target="_blank" class="x-circle-btn" title="X (Twitter)">
                    <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 7.719L22.875 21H16.22l-5.216-6.817L4.99 21H1.68l7.73-8.235L1.25 2.25h6.822l4.713 6.231l5.459-6.231zm-1.161 16.77h1.833L7.084 4.126H5.117L17.083 19.02z"/></svg>
                </a>
            </div>
            <p>Free BGM & Track Maker</p>
            <div class="illust-credit">Illustration : ノーコピーライトガール</div>
        </div>
        <div class="terms-wrapper"><a href="https://casbgcasbg.booth.pm/" target="_blank" class="terms-btn">利用規約</a></div>
        <div class="recent-tracks-section"><h3>DISCOGRAPHY</h3><div class="recent-grid" id="sidebarNav"></div></div>`;
    
    // サイドバーのナビを自動生成
    const sidebarNav = document.getElementById('sidebarNav');
    sidebarNav.innerHTML = allAlbums.map(album => `<a href="${album.id}.html" class="recent-link">${album.title}</a>`).join('');
}

function renderPlayerPart(pageType, albumId = null) {
    document.getElementById('player-part').innerHTML = `
        <h2 class="section-title">${pageType === 'index' ? 'ALL TRACKS' : 'TRACK LIST'}</h2>
        <ul class="track-list" id="trackList"></ul>
        <div class="player-footer">
            <div class="player-ui">
                <div class="now-playing-title" id="nowPlaying">...</div>
                <div class="controls-main">
                    <button class="btn-svg" id="prevBtn" title="Previous"><svg class="icon-svg" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg></button>
                    <button class="play-main" id="playBtn" title="Play/Pause"><svg id="playIconSVG" class="icon-svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
                    <button class="btn-svg" id="nextBtn" title="Next"><svg class="icon-svg" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg></button>
                </div>
                <div class="volume-repeat-row">
                    <button class="btn-svg" id="muteBtn" style="width:24px; height:24px;"><svg id="volumeIcon" class="icon-svg" style="width:16px; height:18px;" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg></button>
                    <input type="range" id="volumeBar" value="80" max="100">
                    <button class="btn-svg" id="shuffleBtn" title="Shuffle"><svg class="icon-svg" viewBox="0 0 24 24"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.45 20 9.5V4h-5.5zm.59 10.83l-1.41 1.41 3.13 3.13L14.5 22H20v-5.5l-2.04 2.04-3.37-3.37z"/></svg></button>
                    <button class="btn-svg" id="repeatBtn" title="Repeat"><svg class="icon-svg" viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg></button>
                </div>
                <div class="timeline-box"><span id="currentTime">0:00</span><input type="range" class="seek-bar" id="seekBar" value="0" max="100"><span id="duration">0:00</span></div>
            </div>
            <div class="download-btn-wrapper" id="downloadArea"></div>
        </div>`;
}

// 音楽プレイヤーの動き（ロジック）を起動
function initAudioPlayer(tracks) {
    const trackListContainer = document.getElementById('trackList');
    trackListContainer.innerHTML = tracks.map((track, idx) => `
        <li class="track-item" data-src="audio/${track.file}">
            <span class="track-number">${String(idx + 1).padStart(2, '0')}.</span>
            <span class="track-name">${track.title}</span>
            <span class="track-meta">Preview</span>
        </li>`).join('');

    const audio = new Audio();
    const playBtn = document.getElementById('playBtn'), playIconSVG = document.getElementById('playIconSVG'), nowPlaying = document.getElementById('nowPlaying'), seekBar = document.getElementById('seekBar'), currentTimeText = document.getElementById('currentTime'), durationText = document.getElementById('duration'), volumeBar = document.getElementById('volumeBar'), muteBtn = document.getElementById('muteBtn'), volumeIcon = document.getElementById('volumeIcon');
    let trackItems; let currentIndex = 0; let isShuffle = false; let repeatMode = 0; let lastVolume = 0.8;
    const playPath = "M8 5v14l11-7z", pausePath = "M6 19h4V5H6v14zm8-14v14h4V5h-4z";

    function updatePlayIcon(isPlaying) { playIconSVG.querySelector('path').setAttribute('d', isPlaying ? pausePath : playPath); }
    function loadTrack(index) {
        trackItems = Array.from(document.querySelectorAll('.track-item'));
        if(!trackItems[index]) return;
        trackItems.forEach(i => i.classList.remove('active'));
        trackItems[index].classList.add('active');
        currentIndex = index;
        nowPlaying.textContent = trackItems[index].querySelector('.track-name').textContent;
        audio.src = trackItems[index].getAttribute('data-src');
    }

    loadTrack(0);
    playBtn.addEventListener('click', () => { if (audio.paused) { audio.play().catch(e => console.log(e)); updatePlayIcon(true); } else { audio.pause(); updatePlayIcon(false); } });
    document.getElementById('prevBtn').addEventListener('click', () => { let idx = (currentIndex - 1 + trackItems.length) % trackItems.length; loadTrack(idx); audio.play(); updatePlayIcon(true); });
    const playNext = () => {
        let idx;
        if (isShuffle) { idx = Math.floor(Math.random() * trackItems.length); } else {
            idx = currentIndex + 1;
            if (idx >= trackItems.length) { if (repeatMode === 0) { audio.pause(); audio.currentTime = 0; updatePlayIcon(false); return; } else { idx = 0; } }
        }
        loadTrack(idx); audio.play(); updatePlayIcon(true);
    };
    document.getElementById('nextBtn').addEventListener('click', playNext);
    document.getElementById('shuffleBtn').addEventListener('click', function() { isShuffle = !isShuffle; this.classList.toggle('active', isShuffle); });
    document.getElementById('repeatBtn').addEventListener('click', function() {
        repeatMode = (repeatMode + 1) % 3;
        this.classList.remove('active', 'repeat-one');
        if (repeatMode === 1) this.classList.add('active', 'repeat-one'); else if (repeatMode === 2) this.classList.add('active');
    });
    trackListContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.track-item');
        if (item) { const idx = trackItems.indexOf(item); loadTrack(idx); audio.play(); updatePlayIcon(true); }
    });
    audio.addEventListener('timeupdate', () => { if (!isNaN(audio.duration)) { seekBar.value = (audio.currentTime / audio.duration) * 100; let m = Math.floor(audio.currentTime / 60), s = Math.floor(audio.currentTime % 60); currentTimeText.textContent = `${m}:${s < 10 ? '0'+s : s}`; } });
    audio.addEventListener('loadedmetadata', () => { let m = Math.floor(audio.duration / 60), s = Math.floor(audio.duration % 60); durationText.textContent = `${m}:${s < 10 ? '0'+s : s}`; });
    seekBar.addEventListener('input', () => audio.currentTime = (seekBar.value / 100) * audio.duration);
    audio.addEventListener('ended', () => { if (repeatMode === 1) audio.play(); else playNext(); });
    volumeBar.addEventListener('input', () => { const val = volumeBar.value / 100; audio.volume = val; if (val > 0) lastVolume = val; updateVolumeIcon(val); });
    muteBtn.addEventListener('click', () => { if (audio.volume > 0) { lastVolume = audio.volume; audio.volume = 0; volumeBar.value = 0; } else { audio.volume = lastVolume; volumeBar.value = lastVolume * 100; } updateVolumeIcon(audio.volume); });
    function updateVolumeIcon(vol) { const path = volumeIcon.querySelector('path'); if (vol === 0) path.setAttribute('d', 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'); else if (vol < 0.5) path.setAttribute('d', 'M7 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z'); else path.setAttribute('d', 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'); }

    // ハンバーガーメニュー
    const burgerBtn = document.getElementById('burgerBtn');
    const sidebar = document.getElementById('sidebar-part');
    burgerBtn.addEventListener('click', () => { 
        burgerBtn.classList.toggle('open'); 
        sidebar.classList.toggle('open'); 
    });
}

// ページ起動の呪文
function initIndexPage() {
    renderHeader();
    renderSidebar();
    renderPlayerPart('index');
    
    // アルバム一覧生成
    const albumGrid = document.getElementById('albumGrid');
    albumGrid.innerHTML = allAlbums.map(album => `
        <a href="${album.id}.html" class="album-card">
            <div class="album-img-box"><img src="${album.img}" class="album-img" alt="${album.title}"></div>
            <div class="album-title">${album.title}</div>
            <div class="album-meta">${album.subtitle} / ${album.tracksCount}</div>
        </a>`).join('');

    // 全曲ソート（アルバム順 -> ファイル名昇順）
    const albumOrder = allAlbums.map(a => a.id);
    const sortedTracks = [...allTracks].sort((a, b) => {
        const indexA = albumOrder.indexOf(a.albumId);
        const indexB = albumOrder.indexOf(b.albumId);
        if (indexA !== indexB) return indexA - indexB;
        return a.file.localeCompare(b.file);
    });

    initAudioPlayer(sortedTracks);
}

function initAlbumPage(currentAlbumId) {
    renderHeader();
    renderSidebar();
    renderPlayerPart('album');

    const album = allAlbums.find(a => a.id === currentAlbumId);
    if(album) {
        document.title = `${album.title} - Qurage Music`;
        document.getElementById('albumDetail').innerHTML = `
            <img src="${album.img}" alt="${album.title}" class="album-art-large">
            <div class="album-info-text">
                <h2 class="album-title-main">${album.title}</h2>
                <p class="album-subtitle">${album.subtitle}</p>
                <p class="album-description">${album.desc}</p>
            </div>`;
        document.getElementById('downloadArea').innerHTML = `<a href="${album.booth}" target="_blank" class="booth-btn">Download at BOOTH</a>`;
    }

    const albumTracks = allTracks.filter(t => t.albumId === currentAlbumId).sort((a, b) => a.file.localeCompare(b.file));
    initAudioPlayer(albumTracks);
}
