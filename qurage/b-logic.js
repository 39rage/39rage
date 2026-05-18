let currentCategory = 'discography';
let activeAlbumId = null;

// カテゴリー切り替え
function changeCategory(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCarousel();
}

// 1. 中央のジャケ写ぐるぐるを生成
function renderCarousel() {
    const carousel = document.getElementById('albumCarousel');
    const albums = allAlbums.filter(a => a.category === currentCategory);

    carousel.innerHTML = albums.map((album, idx) => `
        <div class="carousel-item" onclick="selectAlbum('${album.id}', this)" id="item-${album.id}">
            <img src="${album.img}" alt="${album.title}">
        </div>
    `).join('');

    if (albums.length > 0) {
        selectAlbum(albums[0].id, carousel.querySelector('.carousel-item'));
    }
}

// 2. アルバム選択
function selectAlbum(albumId, element) {
    // 見た目更新
    document.querySelectorAll('.carousel-item').forEach(i => i.classList.remove('active'));
    element.classList.add('active');
    
    // スムーズスクロール
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

    const album = allAlbums.find(a => a.id === albumId);
    if (!album) return;

    // 中央の情報表示を更新
    const detail = document.getElementById('albumDetail');
    const boothBtn = (album.category === 'discography' && album.booth !== '#') 
        ? `<a href="${album.booth}" target="_blank" class="booth-btn-b">Download at BOOTH</a>` 
        : '';

    detail.innerHTML = `
        <h2 class="b-title-main">${album.title}</h2>
        <p class="b-subtitle">${album.subtitle}</p>
        <p class="b-desc">${album.desc}</p>
        ${boothBtn}
    `;

    // 右側のプレイヤー部分をそのアルバムの曲に更新
    const albumTracks = allTracks.filter(t => t.albumId === albumId).sort((a, b) => a.file.localeCompare(b.file));
    initAudioPlayer(albumTracks);
}

// パターンBの全体起動
function initGamePage() {
    renderHeader();
    renderSidebar(); // 共通のサイドバーは裏側で描画（スマホメニュー用）
    renderPlayerPart('album'); // パターンAと同じプレイヤー枠を右側に
    renderCarousel(); // 中央のぐるぐるを開始
}
