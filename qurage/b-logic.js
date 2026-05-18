let audio = new Audio();
let currentCategory = 'discography';
let activeAlbumId = null;
let activeTrackFile = null;

// 1. カテゴリー切り替え
function changeCategory(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeAlbumId = null; // カテゴリが変わったら選択リセット
    renderGameList();
}

// 2. リスト描画（アルバム単位）
function renderGameList() {
    const listWrapper = document.getElementById('musicList');
    const albums = allAlbums.filter(a => a.category === currentCategory);

    listWrapper.innerHTML = albums.map((album, aIdx) => {
        const num = (aIdx < 10) ? '0' + aIdx : aIdx;
        const tracks = allTracks.filter(t => t.albumId === album.id).sort((a, b) => a.file.localeCompare(b.file));
        
        return `
        <div class="album-group" id="group-${album.id}">
            <div class="album-banner" onclick="toggleAlbum('${album.id}')">
                <img src="${album.img}" class="ab-img">
                <div class="ab-info">
                    <div class="ab-title">${num}.${album.title}</div>
                    <div class="ab-meta">${album.subtitle} / ${album.tracksCount}</div>
                </div>
            </div>
            <div class="sub-track-list">
                ${tracks.map((track, tIdx) => `
                    <div class="track-card" onclick="selectTrack('${track.file}', '${album.id}', this)">
                        <span>${String(tIdx + 1).padStart(2, '0')}. ${track.title}</span>
                        <span style="opacity:0.5; font-size:0.7rem;">SELECT</span>
                    </div>
                `).join('')}
            </div>
        </div>`;
    }).join('');

    // 初期状態：最初のアルバムを開く
    if (albums.length > 0) {
        toggleAlbum(albums[0].id);
    }
}

// 3. アルバムの開閉
function toggleAlbum(albumId) {
    const groups = document.querySelectorAll('.album-group');
    const targetGroup = document.getElementById(`group-${albumId}`);
    
    // 他を閉じてターゲットを開く（アコーディオン形式）
    groups.forEach(g => g.classList.remove('active'));
    targetGroup.classList.add('active');
    activeAlbumId = albumId;

    // アルバムが選ばれたら、その1曲目を自動でプレビューにセット（再生はしない）
    const firstTrack = targetGroup.querySelector('.track-card');
    if (firstTrack) firstTrack.click();
}

// 4. 曲の選択（プレビュー更新）
function selectTrack(file, albumId, element) {
    // 見た目更新
    document.querySelectorAll('.track-card').forEach(c => c.classList.remove('selected'));
    element.classList.add('selected');

    const track = allTracks.find(t => t.file === file);
    const album = allAlbums.find(a => a.id === albumId);

    // 右側パネルの更新
    document.getElementById('targetJacket').src = album.img;
    document.getElementById('targetTitle').textContent = track.title;
    document.getElementById('targetSub').textContent = `${album.title} - ${album.subtitle}`;
    document.getElementById('targetDesc').textContent = album.desc;
    
    const boothBtn = document.getElementById('boothLink');
    if(album.booth && album.booth !== "#") {
        boothBtn.parentElement.style.display = "block";
        boothBtn.href = album.booth;
    } else {
        boothBtn.parentElement.style.display = "none";
    }

    // オーディオ準備
    if (activeTrackFile !== file) {
        audio.src = "audio/" + file;
        activeTrackFile = file;
        updatePlayIcon(false);
    }
}

// --- プレイヤー基本機能 ---
const playBtn = document.getElementById('playBtn');
const seekBar = document.getElementById('seekBar');
const currentTimeText = document.getElementById('currentTime');
const durationText = document.getElementById('duration');

function updatePlayIcon(isPlaying) {
    playBtn.textContent = isPlaying ? "PAUSE" : "PLAY";
    playBtn.style.background = isPlaying ? "#fff" : "var(--cyber-orange)";
    playBtn.style.color = isPlaying ? "#000" : "#fff";
}

playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play().catch(e => console.log(e));
        updatePlayIcon(true);
    } else {
        audio.pause();
        updatePlayIcon(false);
    }
});

// 前後の曲
document.getElementById('prevBtn').addEventListener('click', () => {
    const cards = Array.from(document.querySelectorAll('.track-card'));
    const currentCard = document.querySelector('.track-card.selected');
    let idx = cards.indexOf(currentCard);
    let nextIdx = (idx - 1 + cards.length) % cards.length;
    cards[nextIdx].click();
});

document.getElementById('nextBtn').addEventListener('click', () => {
    const cards = Array.from(document.querySelectorAll('.track-card'));
    const currentCard = document.querySelector('.track-card.selected');
    let idx = cards.indexOf(currentCard);
    let nextIdx = (idx + 1) % cards.length;
    cards[nextIdx].click();
});

audio.addEventListener('timeupdate', () => {
    if (!isNaN(audio.duration)) {
        seekBar.value = (audio.currentTime / audio.duration) * 100;
        let m = Math.floor(audio.currentTime / 60), s = Math.floor(audio.currentTime % 60);
        currentTimeText.textContent = `${m}:${(s < 10) ? '0'+s : s}`;
    }
});

audio.addEventListener('loadedmetadata', () => {
    let m = Math.floor(audio.duration / 60), s = Math.floor(audio.duration % 60);
    durationText.textContent = `${m}:${(s < 10) ? '0'+s : s}`;
});

seekBar.addEventListener('input', () => audio.currentTime = (seekBar.value / 100) * audio.duration);

// 初期起動
window.onload = () => { renderGameList(); };
