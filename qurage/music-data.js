// 【全アルバムのリスト】
// 新しい順（または表示したい順）に並べておくと、サイドバーやアルバム一覧にその順で出ます。
const allAlbums = [
    {
        id: "first-step", 
        title: "First step",
        subtitle: "1st Mini Album",
        img: "https://fromtheasia.com/wp-content/uploads/NCG63.jpg",
        desc: "初めて作った5曲がまとまってます。<br>デモ曲のようなミニアルバム。",
        booth: "https://casbgcasbg.booth.pm/items/2691899",
        tracksCount: "5 Tracks"
    },
    {
        id: "deep-upbeat", 
        title: "Deep Upbeat",
        subtitle: "1st Single",
        img: "https://fromtheasia.com/wp-content/uploads/NCG93-1.jpg",
        desc: "ひたすらに眠たい曲を作りました。<br>おまけはちょっとオシャレにしたバージョンです。",
        booth: "https://casbgcasbg.booth.pm/items/2691947",
        tracksCount: "2 Tracks"
    },
    {
        id: "at-the-beach", 
        title: "At the beach",
        subtitle: "2nd Single",
        img: "https://fromtheasia.com/wp-content/uploads/NCG111.jpg",
        desc: "優しく切なく",
        booth: "https://casbgcasbg.booth.pm/items/2691982",
        tracksCount: "3 Tracks"
    },
    {
        id: "mystic-moon", 
        title: "Mystic Moon",
        subtitle: "3rd Single",
        img: "https://fromtheasia.com/wp-content/uploads/NCG210-scaled.jpg",
        desc: "最近やってるゲームの影響でチャイニーズミュージックにトライした結果",
        booth: "https://casbgcasbg.booth.pm/items/2692032",
        tracksCount: "3 Tracks"
    }
];

// 【全曲のリスト】
// ここに曲を足していくだけで、全ページに自動反映されます。
// ファイル名の先頭の数字を読み取って自動で並べ替える設定になっているので、追加する順番はバラバラでも大丈夫です。
const allTracks = [
    // --- First step 収録曲 ---
    { title: "British Brixton", file: "2020102923 British_Brixton-100_C.mp3", albumId: "first-step" },
    { title: "Accelerate Afghanistan", file: "2020103012 Accelerate_Afghanistan_TH-102_Cm.mp3", albumId: "first-step" },
    { title: "AABS 80s", file: "2020103014 AABS_80s-128_Cm.mp3", albumId: "first-step" },
    { title: "Altered Afterburner AYB", file: "2020103018 Altered_Afterburner_AYB-129_Csm.mp3", albumId: "first-step" },
    { title: "Alternating synth layers", file: "2020103111 Alternating_synth_layers-125_Dm.mp3", albumId: "first-step" },
    
    // --- Deep Upbeat 収録曲 ---
    { title: "Deep Upbeat EP", file: "2020110114 Deep_Upbeat_EP-60_D.mp3", albumId: "deep-upbeat" },
    { title: "Deep Upbeat Dense Alert", file: "2020110114_2 Deep_Upbeat_Dense_Alert-60_D.mp3", albumId: "deep-upbeat" },

    // --- At the beach 収録曲 ---
    { title: "Ambition Christy", file: "2020110912 Ambition_Christy-80_Csm.mp3", albumId: "at-the-beach" },
    { title: "Ocean Blue", file: "2020110913 Ocean_Blue-90_B.mp3", albumId: "at-the-beach" },
    { title: "Tropical Air", file: "2020111710 Tropical_Air-100_C.mp3", albumId: "at-the-beach" },

    // --- Mystic Moon 収録曲 ---
    { title: "Mystic Moon QGN", file: "2020111319 Mystic_Moon_QGN-110_B.mp3", albumId: "mystic-moon" },
    { title: "Celestial Ageless CDM Dizi", file: "2020112622 Celestial_Ageless_CDM_Dizi-130_B.mp3", albumId: "mystic-moon" },
    { title: "Mystic Moon Nines Technicolor", file: "2021011320 Mystic_Moon_Nines_Technicolor-150_B.mp3", albumId: "mystic-moon" }
];
