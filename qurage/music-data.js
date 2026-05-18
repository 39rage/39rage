// 【全アルバムのリスト】
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
    },
    {
        id: "boogie-night", 
        title: "Boogie Night",
        subtitle: "4th Single",
        img: "https://fromtheasia.com/wp-content/uploads/NCG99-2.jpg",
        desc: "ロックが作りたかっただけなんや...",
        booth: "https://casbgcasbg.booth.pm/items/2692935",
        tracksCount: "3 Tracks"
    },
    {
        id: "true-love", 
        title: "True Love",
        subtitle: "5th Single",
        img: "https://fromtheasia.com/wp-content/uploads/NCG82.jpg",
        desc: "本当の愛ってなんだろう<br>安心してくださいただのしっとり曲です",
        booth: "https://casbgcasbg.booth.pm/items/2692943",
        tracksCount: "3 Tracks"
    },
    {
        id: "between", 
        title: "Between",
        subtitle: "6th Single",
        img: "https://fromtheasia.com/wp-content/uploads/NCG54.jpg",
        desc: "生と死の狭間みたいなちょっとダークな曲たち<br>病んでは、ないと思う",
        booth: "https://casbgcasbg.booth.pm/items/2758590",
        tracksCount: "4 Tracks"
    },
    {
        id: "innocent", 
        title: "Innocent",
        subtitle: "7th Single",
        img: "https://fromtheasia.com/wp-content/uploads/NCG105.jpg",
        desc: "ギター・ウクレレ中心の爽やかな曲たち",
        booth: "https://casbgcasbg.booth.pm/items/2758663",
        tracksCount: "3 Tracks"
    },
    {
        id: "ordinary", 
        title: "Ordinary",
        subtitle: "8th Single",
        img: "https://fromtheasia.com/wp-content/uploads/NCG64.jpg",
        desc: "日常使いできそうなほのぼの曲",
        booth: "https://casbgcasbg.booth.pm/items/2758775",
        tracksCount: "3 Tracks"
    },
    {
        id: "big-tight", 
        title: "Big Tight",
        subtitle: "9th Single",
        img: "https://fromtheasia.com/wp-content/uploads/NCG33.jpg",
        desc: "かっこよくておしゃんな曲",
        booth: "https://casbgcasbg.booth.pm/items/2758818",
        tracksCount: "3 Tracks"
    },
    {
        id: "organic", 
        title: "Organic",
        subtitle: "10th Single",
        img: "https://fromtheasia.com/wp-content/uploads/NCG61.jpg",
        desc: "３ヶ月ぶりの新曲<br>おしゃべり動画に使えそうなThe・ループ曲",
        booth: "https://casbgcasbg.booth.pm/items/3007933",
        tracksCount: "3 Tracks"
    }
];

// 【全曲のリスト】
const allTracks = [
    // --- First step ---
    { title: "British Brixton", file: "2020102923 British_Brixton-100_C.mp3", albumId: "first-step" },
    { title: "Accelerate Afghanistan", file: "2020103012 Accelerate_Afghanistan_TH-102_Cm.mp3", albumId: "first-step" },
    { title: "AABS 80s", file: "2020103014 AABS_80s-128_Cm.mp3", albumId: "first-step" },
    { title: "Altered Afterburner AYB", file: "2020103018 Altered_Afterburner_AYB-129_Csm.mp3", albumId: "first-step" },
    { title: "Altered Afterburner AYB", file: "2020103018 Altered_Afterburner_AYB-129_Csm.mp3", albumId: "first-step" },
    { title: "Alternating synth layers", file: "2020103111 Alternating_synth_layers-125_Dm.mp3", albumId: "first-step" },
    
    // --- Deep Upbeat ---
    { title: "Deep Upbeat EP", file: "2020110114 Deep_Upbeat_EP-60_D.mp3", albumId: "deep-upbeat" },
    { title: "Deep Upbeat Dense Alert", file: "2020110114_2 Deep_Upbeat_Dense_Alert-60_D.mp3", albumId: "deep-upbeat" },

    // --- At the beach ---
    { title: "Ambition Christy", file: "2020110912 Ambition_Christy-80_Csm.mp3", albumId: "at-the-beach" },
    { title: "Ocean Blue", file: "2020110913 Ocean_Blue-90_B.mp3", albumId: "at-the-beach" },
    { title: "Tropical Air", file: "2020111710 Tropical_Air-100_C.mp3", albumId: "at-the-beach" },

    // --- Mystic Moon ---
    { title: "Mystic Moon QGN", file: "2020111319 Mystic_Moon_QGN-110_B.mp3", albumId: "mystic-moon" },
    { title: "Celestial Ageless CDM Dizi", file: "2020112622 Celestial_Ageless_CDM_Dizi-130_B.mp3", albumId: "mystic-moon" },
    { title: "Mystic Moon Nines Technicolor", file: "2021011320 Mystic_Moon_Nines_Technicolor-150_B.mp3", albumId: "mystic-moon" },

    // --- Boogie Night ---
    { title: "Boogie Right Wah Power", file: "2020120819 Boogie_Right_Wah_Power-115_E.mp3", albumId: "boogie-night" },
    { title: "Disco Jesse", file: "2021011318 Disco_Jesse-120_D.mp3", albumId: "boogie-night" },
    { title: "Riff Right Ready Zak", file: "2021011419 Riff_Right_Ready_Zak-125_C.mp3", albumId: "boogie-night" },

    // --- True Love ---
    { title: "Twilight True Love", file: "2021011421 Twilight_True_Love-98_Em.mp3", albumId: "true-love" },
    { title: "Missing You", file: "2021011620 Missing_You-102_Ebm.mp3", albumId: "true-love" },
    { title: "Hand in Hand", file: "2021011910 Hand_in_Hand-78_D.mp3", albumId: "true-love" },

    // --- Between ---
    { title: "Daylight", file: "2021012021 Daylight_100_D.mp3", albumId: "between" },
    { title: "Recollection", file: "2021012821 Recollection-130_Dm.mp3", albumId: "between" },
    { title: "Metaphysical", file: "2021020615 Metaphysical-100_Cm.mp3", albumId: "between" },
    { title: "Break Against", file: "2021020718 Break_Against-70_Dm.mp3", albumId: "between" },

    // --- Innocent ---
    { title: "HGB Ukulele Perc", file: "2021012021 HGB_Ukulele_Perc-101_C.mp3", albumId: "innocent" },
    { title: "NISS Gavin", file: "2021020319 NISS_Gavin-124_Dm.mp3", albumId: "innocent" },
    { title: "Diamond CCD", file: "2021021315 Diamond_CCD-100_Bm.mp3", albumId: "innocent" },

    // --- Ordinary ---
    { title: "Microchip", file: "2021020912 Microchip_170_Cm.mp3", albumId: "ordinary" },
    { title: "Chinese Traditional", file: "2021020914 Chinese_Traditional-109_D.mp3", albumId: "ordinary" },
    { title: "Southern 70s", file: "2021021713 Southern_70s-90_C.mp3", albumId: "ordinary" },

    // --- Big Tight ---
    { title: "Cathode Euro CC", file: "2021020311 Cathode_Euro_CC-128_Dm.mp3", albumId: "big-tight" },
    { title: "Big 8BS", file: "2021021716 Big_8BS-128_Cm.mp3", albumId: "big-tight" },
    { title: "Tight Fashion MM", file: "2021021800 Tight_Fashion_MM-120_Cm.mp3", albumId: "big-tight" },

    // --- Organic ---
    { title: "Organic TBC", file: "2021022511 Organic_TBC-125_C.mp3", albumId: "organic" },
    { title: "Full 3FC", file: "2021022512 Full_3FC-125_C.mp3", albumId: "organic" },
    { title: "Backroads", file: "2021033017 Backroads-90_C.mp3", albumId: "organic" }
];
