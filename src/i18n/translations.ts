export type Language = "en" | "zu" | "xh" | "af";

export const languageNames: Record<Language, string> = {
  en: "English",
  zu: "isiZulu",
  xh: "isiXhosa",
  af: "Afrikaans",
};

export const languageFlags: Record<Language, string> = {
  en: "🇬🇧",
  zu: "🇿🇦",
  xh: "🇿🇦",
  af: "🇿🇦",
};

type TranslationKeys = {
  // Nav
  nav_home: string;
  nav_sports: string;
  nav_live: string;
  nav_community: string;
  nav_wallet: string;
  nav_promos: string;
  nav_how: string;
  nav_responsible: string;
  nav_about: string;
  nav_signin: string;
  nav_join: string;
  nav_search_placeholder: string;

  // Hero
  hero_live_badge: string;
  hero_title_1: string;
  hero_title_2: string;
  hero_subtitle: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  hero_stat_winners: string;
  hero_stat_winners_label: string;
  hero_stat_paid: string;
  hero_stat_paid_label: string;
  hero_stat_payout: string;
  hero_stat_payout_label: string;
  hero_won: string;
  hero_instant: string;
  hero_live_from: string;

  // Trust Bar
  trust_licensed: string;
  trust_licensed_desc: string;
  trust_security: string;
  trust_security_desc: string;
  trust_withdrawals: string;
  trust_withdrawals_desc: string;
  trust_mobile: string;
  trust_mobile_desc: string;

  // Betting Options
  betting_label: string;
  betting_title: string;
  betting_local: string;
  betting_local_sub: string;
  betting_intl: string;
  betting_intl_sub: string;
  betting_esports: string;
  betting_esports_sub: string;
  betting_quick: string;
  betting_quick_sub: string;

  // Why Different
  why_label: string;
  why_title: string;
  why_subtitle: string;
  why_built: string;
  why_built_desc: string;
  why_fast: string;
  why_fast_desc: string;
  why_community: string;
  why_community_desc: string;
  why_active: string;
  why_paid: string;
  why_leagues: string;
  why_ready: string;
  why_join_cta: string;
  why_get_started: string;

  // Township Gallery
  township_label: string;
  township_title_1: string;
  township_title_2: string;
  township_title_3: string;
  township_subtitle: string;
  township_bettors: string;
  township_won: string;
  township_live: string;
  township_join: string;

  // Township scenes
  scene_shisa: string;
  scene_shisa_vibe: string;
  scene_legends: string;
  scene_legends_vibe: string;
  scene_tavern: string;
  scene_tavern_vibe: string;
  scene_street: string;
  scene_street_vibe: string;
  scene_matchday: string;
  scene_matchday_vibe: string;
  scene_victory: string;
  scene_victory_vibe: string;

  // How It Works
  how_label: string;
  how_title: string;
  how_subtitle: string;
  how_step1: string;
  how_step1_desc: string;
  how_step2: string;
  how_step2_desc: string;
  how_step3: string;
  how_step3_desc: string;
  how_cta: string;

  // Promotions
  promo_label: string;
  promo_title: string;
  promo_welcome: string;
  promo_welcome_desc: string;
  promo_derby: string;
  promo_derby_desc: string;
  promo_cashback: string;
  promo_cashback_desc: string;
  promo_claim: string;
  promo_view: string;
  promo_learn: string;

  // Testimonials
  test_label: string;
  test_title: string;

  // Stadium
  stadium_label: string;
  stadium_title_1: string;
  stadium_title_2: string;
  stadium_subtitle: string;

  // Responsible
  resp_badge: string;
  resp_title: string;
  resp_subtitle: string;
  resp_limits: string;
  resp_breaks: string;
  resp_support: string;
  resp_learn: string;

  // Footer
  footer_cta_title: string;
  footer_cta_sub: string;
  footer_cta_btn: string;
  footer_brand_desc: string;
  footer_product: string;
  footer_company: string;
  footer_support: string;
  footer_legal: string;
  footer_copyright: string;
  footer_made: string;

  // New pages
  community_title: string;
  community_subtitle: string;
  wallet_title: string;
  wallet_subtitle: string;
  about_title: string;
  about_subtitle: string;
};

export const translations: Record<Language, TranslationKeys> = {
  en: {
    // Nav
    nav_home: "Home",
    nav_sports: "Sports",
    nav_live: "Live",
    nav_community: "Community",
    nav_wallet: "Wallet",
    nav_promos: "Promos",
    nav_how: "How It Works",
    nav_responsible: "Responsible Gaming",
    nav_about: "About Us",
    nav_signin: "Sign In",
    nav_join: "Join Now",
    nav_search_placeholder: "Search matches, teams, events...",

    // Hero
    hero_live_badge: "Live Matches Now!",
    hero_title_1: "Bet Local.",
    hero_title_2: "Win Big.",
    hero_subtitle: "South Africa's township-first betting platform — fast payouts, local games, community pride. Built for eKasi! 🇿🇦",
    hero_cta_primary: "Start Winning Now",
    hero_cta_secondary: "Live Matches",
    hero_stat_winners: "50K+",
    hero_stat_winners_label: "Winners",
    hero_stat_paid: "R2M+",
    hero_stat_paid_label: "Paid Out",
    hero_stat_payout: "~2min",
    hero_stat_payout_label: "Payout",
    hero_won: "+R750 Won!",
    hero_instant: "Instant Bets",
    hero_live_from: "Live From",

    // Trust
    trust_licensed: "Licensed & Regulated",
    trust_licensed_desc: "SA Gaming Board Approved",
    trust_security: "Bank-Grade Security",
    trust_security_desc: "256-bit SSL Encryption",
    trust_withdrawals: "Instant Withdrawals",
    trust_withdrawals_desc: "Get Paid in Minutes",
    trust_mobile: "Mobile Optimized",
    trust_mobile_desc: "Bet Anywhere, Anytime",

    // Betting
    betting_label: "Sports & Games",
    betting_title: "Choose Your Game",
    betting_local: "Local Football",
    betting_local_sub: "PSL & Kasi Tournaments",
    betting_intl: "International",
    betting_intl_sub: "Premier League, La Liga",
    betting_esports: "eSports",
    betting_esports_sub: "FIFA, PUBG, LoL",
    betting_quick: "Quick Games",
    betting_quick_sub: "Spin & Win Instantly",

    // Why
    why_label: "Why eKasibets",
    why_title: "The Platform Built for You",
    why_subtitle: "We're not another generic betting app. We're your neighbors, your community, your winning partner — built from the ground up for South African bettors.",
    why_built: "Built for eKasi",
    why_built_desc: "We understand township life. Bet on local derbies, support your community teams, feel the pride.",
    why_fast: "Lightning Fast Payouts",
    why_fast_desc: "No waiting days. Get paid straight to your account within minutes, not hours.",
    why_community: "Community Driven",
    why_community_desc: "We give back. Part of every bet supports local grassroots football development.",
    why_active: "Active Bettors",
    why_paid: "Paid Out Monthly",
    why_leagues: "Local Leagues Covered",
    why_ready: "Ready to start?",
    why_join_cta: "Join 50,000+ winners today",
    why_get_started: "Get Started",

    // Township Gallery
    township_label: "STRAIGHT FROM THE KASI",
    township_title_1: "THIS IS",
    township_title_2: "WHERE",
    township_title_3: "LEGENDS ARE MADE",
    township_subtitle: "From the dusty streets to the big stadiums, we know where the real game is played",
    township_bettors: "KASI BETTORS",
    township_won: "WON THIS YEAR",
    township_live: "LIVE ACTION",
    township_join: "JOIN THE MOVEMENT 🔥",

    scene_shisa: "Shisa Nyama Saturdays",
    scene_shisa_vibe: "Where bets meet braai",
    scene_legends: "Kasi Football Legends",
    scene_legends_vibe: "Street football dreams",
    scene_tavern: "The Local Tavern",
    scene_tavern_vibe: "Community spirit lives here",
    scene_street: "Street Corner Vibes",
    scene_street_vibe: "Where winners gather",
    scene_matchday: "Match Day Energy",
    scene_matchday_vibe: "The roar of the crowd",
    scene_victory: "Victory Celebrations",
    scene_victory_vibe: "We celebrate together",

    // How
    how_label: "How It Works",
    how_title: "Start Winning in 3 Steps",
    how_subtitle: "No complicated signup. No hidden fees. Just straightforward betting with instant payouts.",
    how_step1: "Create Account",
    how_step1_desc: "Sign up in under 60 seconds. Just your phone number and you're in — no complicated forms.",
    how_step2: "Place Your Bet",
    how_step2_desc: "Choose from local kasi games or international matches. Simple interface, tap and bet.",
    how_step3: "Get Paid Instantly",
    how_step3_desc: "Won? Your money hits your account in minutes. No waiting days, no excuses.",
    how_cta: "Start Betting Now",

    // Promos
    promo_label: "Promotions",
    promo_title: "Exclusive Bonuses",
    promo_welcome: "Welcome Bonus",
    promo_welcome_desc: "100% match on your first deposit up to R1,000",
    promo_derby: "Derby Day Specials",
    promo_derby_desc: "Enhanced odds on all Chiefs vs Pirates matches",
    promo_cashback: "Weekly Cashback",
    promo_cashback_desc: "10% cashback on losses every Monday",
    promo_claim: "Claim Now",
    promo_view: "View Odds",
    promo_learn: "Learn More",

    // Testimonials
    test_label: "Testimonials",
    test_title: "Winning Stories",

    // Stadium
    stadium_label: "MZANSI'S FINEST",
    stadium_title_1: "WHERE THE MAGIC",
    stadium_title_2: "HAPPENS",
    stadium_subtitle: "Bet on matches from South Africa's greatest stadiums",

    // Responsible
    resp_badge: "18+ Only • Play Responsibly",
    resp_title: "Responsible Betting",
    resp_subtitle: "Betting should be fun. We're committed to helping you stay in control and enjoy responsibly.",
    resp_limits: "Set deposit limits",
    resp_breaks: "Take breaks anytime",
    resp_support: "Get support 24/7",
    resp_learn: "Learn about responsible betting",

    // Footer
    footer_cta_title: "Ready to start winning?",
    footer_cta_sub: "Join 50,000+ South Africans betting smarter with eKasibets",
    footer_cta_btn: "Get Started Free",
    footer_brand_desc: "South Africa's premium township-first betting platform. Bet local, win local.",
    footer_product: "Product",
    footer_company: "Company",
    footer_support: "Support",
    footer_legal: "Legal",
    footer_copyright: "eKasibets. All rights reserved. Licensed by the SA Gaming Board.",
    footer_made: "Made with pride in South Africa",

    // New pages
    community_title: "Community Hub",
    community_subtitle: "Connect with fellow bettors, share wins, and join the kasi movement",
    wallet_title: "Wallet & Payments",
    wallet_subtitle: "Manage your money with ease — EFT, e-wallets, airtime, and more",
    about_title: "About eKasibets",
    about_subtitle: "Born in the township, built for the people",
  },

  zu: {
    // Nav
    nav_home: "Ikhaya",
    nav_sports: "Ezemidlalo",
    nav_live: "Bukhoma",
    nav_community: "Umphakathi",
    nav_wallet: "Isikhwama",
    nav_promos: "Ama-Promo",
    nav_how: "Isebenza Kanjani",
    nav_responsible: "Ukubheja Ngokuphephile",
    nav_about: "Ngathi",
    nav_signin: "Ngena",
    nav_join: "Joyina Manje",
    nav_search_placeholder: "Sesha imidlalo, amaqembu...",

    // Hero
    hero_live_badge: "Imidlalo Ebukhoma Manje!",
    hero_title_1: "Bheja eKasi.",
    hero_title_2: "Wina Kakhulu.",
    hero_subtitle: "I-platform yokuqala yase-township eNingizimu Afrika — ukukhokhwa okusheshayo, imidlalo yendawo, ukuziqhenya komphakathi. Yakhelwe eKasi! 🇿🇦",
    hero_cta_primary: "Qala Ukuwina Manje",
    hero_cta_secondary: "Imidlalo Ebukhoma",
    hero_stat_winners: "50K+",
    hero_stat_winners_label: "Abawini",
    hero_stat_paid: "R2M+",
    hero_stat_paid_label: "Okukhokhelwe",
    hero_stat_payout: "~2min",
    hero_stat_payout_label: "Ukukhokha",
    hero_won: "+R750 Uwine!",
    hero_instant: "Ibheja Ngokushesha",
    hero_live_from: "Bukhoma Kwa",

    // Trust
    trust_licensed: "Ilayisensi & Ilawulwa",
    trust_licensed_desc: "Igunyazwe yi-SA Gaming Board",
    trust_security: "Ukuphepha Kwebhange",
    trust_security_desc: "256-bit SSL Encryption",
    trust_withdrawals: "Ukukhipha Ngokushesha",
    trust_withdrawals_desc: "Khokhwa Ngeminithi",
    trust_mobile: "Ilungiselelwe Iselula",
    trust_mobile_desc: "Bheja Noma Kuphi",

    // Betting
    betting_label: "Ezemidlalo & Imidlalo",
    betting_title: "Khetha Umdlalo Wakho",
    betting_local: "Ibhola Lendawo",
    betting_local_sub: "PSL & Ama-Tournament aseKasi",
    betting_intl: "Amazwe Ngamazwe",
    betting_intl_sub: "Premier League, La Liga",
    betting_esports: "eSports",
    betting_esports_sub: "FIFA, PUBG, LoL",
    betting_quick: "Imidlalo Esheshayo",
    betting_quick_sub: "Jikeleza & Uwine",

    // Why
    why_label: "Kungani eKasibets",
    why_title: "I-Platform Eyakhelwe Wena",
    why_subtitle: "Asiyona enye i-app yokubheja. Singomakhelwane bakho, umphakathi wakho, umlingani wakho wokunqoba — yakhelwe kusuka ekuqaleni kubabheja baseNingizimu Afrika.",
    why_built: "Yakhelwe eKasi",
    why_built_desc: "Siyakuqonda ukuphila kwaselokishini. Bheja kumadabi endawo, sekela amaqembu akho, uzizwe ngokuziqhenya.",
    why_fast: "Ukukhokhwa Okusheshayo",
    why_fast_desc: "Ungalindi izinsuku. Khokhwa ngqo ku-akhawunti yakho ngeminithi, hhayi amahora.",
    why_community: "Ukuqhutshwa Umphakathi",
    why_community_desc: "Sibuyisela emuva. Ingxenye yayo yonke ibheja isekela ukuthuthukiswa kwebhola lasekuqaleni.",
    why_active: "Ababheji Abasebenzayo",
    why_paid: "Okukhokhelwe Nyanga Zonke",
    why_leagues: "Amaleague Endawo",
    why_ready: "Ukulungele ukuqala?",
    why_join_cta: "Joyina abawini abangu-50,000+ namuhla",
    why_get_started: "Qala",

    // Township
    township_label: "NGQO KUSUKA EKASI",
    township_title_1: "YILAPHA",
    township_title_2: "LAPHO",
    township_title_3: "AMA-LEGEND ENZIWA KHONA",
    township_subtitle: "Kusukela emigwaqeni yothuli kuya ezinkundleni ezinkulu, siyazi lapho umdlalo wangempela udlalwa khona",
    township_bettors: "ABABHEJI BASEKASI",
    township_won: "OKUWINIWE LONYAKA",
    township_live: "IMIDLALO EBUKHOMA",
    township_join: "JOYINA UMNYAKAZO 🔥",

    scene_shisa: "AmaShisa Nyama AngeSonto",
    scene_shisa_vibe: "Lapho ibheja ihlangana nebraai",
    scene_legends: "Ama-Legend eBhola laseKasi",
    scene_legends_vibe: "Amaphupho ebhola lasemgwaqeni",
    scene_tavern: "ITavern Yendawo",
    scene_tavern_vibe: "Umoya womphakathi uhlala lapha",
    scene_street: "Izindawo Zasekhoneni",
    scene_street_vibe: "Lapho abawini behlangana khona",
    scene_matchday: "Amandla Osuku Lomdlalo",
    scene_matchday_vibe: "Ukubhonga kwabantu",
    scene_victory: "Imigubho Yokunqoba",
    scene_victory_vibe: "Sigubha ndawonye",

    // How
    how_label: "Isebenza Kanjani",
    how_title: "Qala Ukuwina Ngezinyathelo Ezi-3",
    how_subtitle: "Akukho ukubhalisa okuyinkimbinkimbi. Akukho izimali ezifihliwe. Ukubheja okuqondile nokukhokha okusheshayo.",
    how_step1: "Dala I-Akhawunti",
    how_step1_desc: "Bhalisa ngaphansi kwemizuzwana engu-60. Inombolo yakho yefoni kuphela futhi usengenile.",
    how_step2: "Beka Ibheja Yakho",
    how_step2_desc: "Khetha kumadlalo asekasi noma kumadlalo amazwe ngamazwe. Cindezela ubheje.",
    how_step3: "Khokhwa Ngokushesha",
    how_step3_desc: "Uwine? Imali yakho ifika ku-akhawunti yakho ngeminithi. Akulindwa izinsuku.",
    how_cta: "Qala Ukubheja Manje",

    // Promos
    promo_label: "Ama-Promo",
    promo_title: "Amabhonasi Akhethekile",
    promo_welcome: "Ibhonasi Yokwamukela",
    promo_welcome_desc: "100% ifanisa kudipozithi yakho yokuqala kuya ku-R1,000",
    promo_derby: "Okukhethekile Kwedabi",
    promo_derby_desc: "Ama-odds angcono kumadabi wonke kaChiefs vs Pirates",
    promo_cashback: "Cashback Yamasonto",
    promo_cashback_desc: "10% cashback ekulahlekelweni njalo ngoMsombuluko",
    promo_claim: "Thatha Manje",
    promo_view: "Buka Ama-Odds",
    promo_learn: "Funda Kabanzi",

    // Testimonials
    test_label: "Ubufakazi",
    test_title: "Izindaba Zokuwina",

    // Stadium
    stadium_label: "OKUHLE KWEMZANSI",
    stadium_title_1: "LAPHO UMLINGO",
    stadium_title_2: "WENZEKA KHONA",
    stadium_subtitle: "Bheja emidlalweni yezinkundla ezinkulu zaseNingizimu Afrika",

    // Responsible
    resp_badge: "18+ Kuphela • Dlala Ngokuphephile",
    resp_title: "Ukubheja Ngokuphephile",
    resp_subtitle: "Ukubheja kufanele kujabulise. Sizibophezele ukukusiza ulawule futhi ujabulele ngokuphephile.",
    resp_limits: "Beka imikhawulo yokufaka",
    resp_breaks: "Thatha ikhefu nganoma yisiphi isikhathi",
    resp_support: "Thola usizo 24/7",
    resp_learn: "Funda ngokubheja ngokuphephile",

    // Footer
    footer_cta_title: "Ukulungele ukuqala ukuwina?",
    footer_cta_sub: "Joyina abaseNingizimu Afrika abangu-50,000+ ababheji ngokuhlakanipha ne-eKasibets",
    footer_cta_btn: "Qala Mahhala",
    footer_brand_desc: "I-platform yokuqala yase-township eNingizimu Afrika. Bheja endaweni, wina endaweni.",
    footer_product: "Umkhiqizo",
    footer_company: "Inkampani",
    footer_support: "Usizo",
    footer_legal: "Ezomthetho",
    footer_copyright: "eKasibets. Wonke amalungelo agodliwe. Ilayisensi ye-SA Gaming Board.",
    footer_made: "Yenziwe ngokuziqhenya eNingizimu Afrika",

    // New pages
    community_title: "Indawo Yomphakathi",
    community_subtitle: "Xhumana nababheji abanye, yabelana ngokuwina, ujoyine umnyakazo wasekasi",
    wallet_title: "Isikhwama & Izinkokhelo",
    wallet_subtitle: "Phatha imali yakho kalula — EFT, e-wallets, airtime, nokunye",
    about_title: "Ngo eKasibets",
    about_subtitle: "Uzalwe elokishini, wakhelwe abantu",
  },

  xh: {
    // Nav
    nav_home: "Ikhaya",
    nav_sports: "Ezemidlalo",
    nav_live: "Ngoku",
    nav_community: "Uluntu",
    nav_wallet: "Ingxowa",
    nav_promos: "Iipromo",
    nav_how: "Isebenza Njani",
    nav_responsible: "Ukubheja Ngokukhuselekileyo",
    nav_about: "Ngathi",
    nav_signin: "Ngena",
    nav_join: "Joyina Ngoku",
    nav_search_placeholder: "Khangela imidlalo, amaqela...",

    // Hero
    hero_live_badge: "Imidlalo Ephilayo Ngoku!",
    hero_title_1: "Bheja eKasi.",
    hero_title_2: "Wina Kakhulu.",
    hero_subtitle: "Iqonga lokuqala lasetawunishipi eMzantsi Afrika — iintlawulo ezikhawulezayo, imidlalo yendawo, ukuzingca koluntu. Yakhelwe eKasi! 🇿🇦",
    hero_cta_primary: "Qala Ukuwina Ngoku",
    hero_cta_secondary: "Imidlalo Ephilayo",
    hero_stat_winners: "50K+",
    hero_stat_winners_label: "Abaphumeleleyo",
    hero_stat_paid: "R2M+",
    hero_stat_paid_label: "Ekuhlawulweyo",
    hero_stat_payout: "~2min",
    hero_stat_payout_label: "Intlawulo",
    hero_won: "+R750 Uwine!",
    hero_instant: "Ibheja Ngokukhawuleza",
    hero_live_from: "Iphilayo Kwa",

    // Trust
    trust_licensed: "Inelayisensi & Ilawulwa",
    trust_licensed_desc: "Igunyaziswe yi-SA Gaming Board",
    trust_security: "Ukhuseleko Lwebhanki",
    trust_security_desc: "256-bit SSL Encryption",
    trust_withdrawals: "Ukutsala Ngokukhawuleza",
    trust_withdrawals_desc: "Hlawulwa Ngemizuzu",
    trust_mobile: "Ilungiselelwe Iselula",
    trust_mobile_desc: "Bheja Naphi na",

    // Betting
    betting_label: "Ezemidlalo & Imidlalo",
    betting_title: "Khetha Umdlalo Wakho",
    betting_local: "Ibhola Yendawo",
    betting_local_sub: "PSL & Iitumente zaseKasi",
    betting_intl: "Amazwe Ngamazwe",
    betting_intl_sub: "Premier League, La Liga",
    betting_esports: "eSports",
    betting_esports_sub: "FIFA, PUBG, LoL",
    betting_quick: "Imidlalo Ekhawulezayo",
    betting_quick_sub: "Jikeleza & Uwine",

    // Why
    why_label: "Kutheni eKasibets",
    why_title: "Iqonga Elakhelwe Wena",
    why_subtitle: "Asiyiyo enye i-app yokubheja. Singabamelwane bakho, uluntu lwakho, iqabane lakho lokuphumelela.",
    why_built: "Yakhelwe eKasi",
    why_built_desc: "Siyakuqonda ubomi baselokishini. Bheja kumadabi endawo, xhasa amaqela akho.",
    why_fast: "Iintlawulo Ezikhawulezayo",
    why_fast_desc: "Ungalindi iintsuku. Hlawulwa ngqo kwi-akhawunti yakho ngemizuzu.",
    why_community: "Iqhutywa Luluntu",
    why_community_desc: "Sibuyisela emva. Inxalenye yayo yonke ibheja ixhasa uphuhliso lwebhola lwasekuqaleni.",
    why_active: "Ababheji Abasebenzayo",
    why_paid: "Ekuhlawulweyo Nyanga Zonke",
    why_leagues: "Iileague Zendawo",
    why_ready: "Ukulungele ukuqala?",
    why_join_cta: "Joyina abaphumeleli abangu-50,000+ namhlanje",
    why_get_started: "Qala",

    // Township
    township_label: "NGQO UKUSUKA EKASI",
    township_title_1: "APHA",
    township_title_2: "APHO",
    township_title_3: "IINTSHATSHELI ZENZIWA KHONA",
    township_subtitle: "Ukusuka kwiindlela zothuli ukuya kwiindawo zemidlalo ezinkulu",
    township_bettors: "ABABHEJI BASEKASI",
    township_won: "OKUWONWE KULO NYAKA",
    township_live: "IMIDLALO EPHILAYO",
    township_join: "JOYINA INTSHUKUMO 🔥",

    scene_shisa: "IiShisa Nyama ZeeCawa",
    scene_shisa_vibe: "Apho ibheja ihlangana nebraai",
    scene_legends: "Iintshatsheli zeBhola yaseKasi",
    scene_legends_vibe: "Amaphupha ebhola yasesitratweni",
    scene_tavern: "ITavern Yendawo",
    scene_tavern_vibe: "Umoya woluntu uhlala apha",
    scene_street: "Iindawo Zasekoneni",
    scene_street_vibe: "Apho abaphumeleli bahlanganayo",
    scene_matchday: "Amandla Osuku Lomdlalo",
    scene_matchday_vibe: "Ukugquma kwabantu",
    scene_victory: "Imibhiyozo Yokuphumelela",
    scene_victory_vibe: "Sibhiyozela kunye",

    // How
    how_label: "Isebenza Njani",
    how_title: "Qala Ukuwina Ngamanyathelo A-3",
    how_subtitle: "Akukho kubhalisa kuyinkimbinkimbi. Akukho mivuzo efihliweyo. Ukubheja okuthe ngqo.",
    how_step1: "Dala I-Akhawunti",
    how_step1_desc: "Bhalisa ngaphantsi kwemizuzwana engama-60. Inombolo yakho yefoni kuphela.",
    how_step2: "Beka Ibheja Yakho",
    how_step2_desc: "Khetha kwimidlalo yasekasi okanye imidlalo yamazwe ngamazwe.",
    how_step3: "Hlawulwa Ngokukhawuleza",
    how_step3_desc: "Uwine? Imali yakho ifika kwi-akhawunti yakho ngemizuzu.",
    how_cta: "Qala Ukubheja Ngoku",

    // Promos
    promo_label: "Iipromo",
    promo_title: "Iibhonasi Ezikhethekileyo",
    promo_welcome: "Ibhonasi Yokwamkelwa",
    promo_welcome_desc: "100% ifanisa kwidipozithi yakho yokuqala ukuya ku-R1,000",
    promo_derby: "Iintengiso Zedabi",
    promo_derby_desc: "Ama-odds angcono kumadabi onke kaChiefs vs Pirates",
    promo_cashback: "Cashback Yeveki",
    promo_cashback_desc: "10% cashback ekulahlekelweni rhoqo ngoMvulo",
    promo_claim: "Thatha Ngoku",
    promo_view: "Jonga Ama-Odds",
    promo_learn: "Funda Ngaphezulu",

    // Testimonials
    test_label: "Ubungqina",
    test_title: "Amabali Okuwina",

    // Stadium
    stadium_label: "OKUHLE KOMZANTSI",
    stadium_title_1: "APHO UMLINGO",
    stadium_title_2: "WENZEKA KHONA",
    stadium_subtitle: "Bheja kwimidlalo yeendawo zemidlalo ezinkulu zoMzantsi Afrika",

    // Responsible
    resp_badge: "18+ Kuphela • Dlala Ngokukhuselekileyo",
    resp_title: "Ukubheja Ngokukhuselekileyo",
    resp_subtitle: "Ukubheja kufanele kube mnandi. Sizibophelele ukukunceda ulawule.",
    resp_limits: "Beka imida yokufaka",
    resp_breaks: "Thatha ikhefu nanini na",
    resp_support: "Fumana inkxaso 24/7",
    resp_learn: "Funda ngokubheja ngokukhuselekileyo",

    // Footer
    footer_cta_title: "Ukulungele ukuqala ukuwina?",
    footer_cta_sub: "Joyina aboMzantsi Afrika abangu-50,000+ ababheji ne-eKasibets",
    footer_cta_btn: "Qala Simahla",
    footer_brand_desc: "Iqonga lokuqala lasetawunishipi loMzantsi Afrika. Bheja endaweni, wina endaweni.",
    footer_product: "Imveliso",
    footer_company: "Inkampani",
    footer_support: "Inkxaso",
    footer_legal: "Ezomthetho",
    footer_copyright: "eKasibets. Onke amalungelo agciniwe. Ilayisensi ye-SA Gaming Board.",
    footer_made: "Yenziwe ngokuzingca eMzantsi Afrika",

    community_title: "Indawo Yoluntu",
    community_subtitle: "Dibanisa nababheji abanye, yabelana ngokuwina",
    wallet_title: "Ingxowa & Iintlawulo",
    wallet_subtitle: "Lawula imali yakho ngokulula — EFT, e-wallets, airtime, nokunye",
    about_title: "Ngo eKasibets",
    about_subtitle: "Uzalwe elokishini, wakhelwe abantu",
  },

  af: {
    // Nav
    nav_home: "Tuis",
    nav_sports: "Sport",
    nav_live: "Lewendig",
    nav_community: "Gemeenskap",
    nav_wallet: "Beursie",
    nav_promos: "Promos",
    nav_how: "Hoe Werk Dit",
    nav_responsible: "Verantwoordelike Dobbel",
    nav_about: "Oor Ons",
    nav_signin: "Meld Aan",
    nav_join: "Sluit Nou Aan",
    nav_search_placeholder: "Soek wedstryde, spanne...",

    // Hero
    hero_live_badge: "Lewendige Wedstryde Nou!",
    hero_title_1: "Wed Plaaslik.",
    hero_title_2: "Wen Groot.",
    hero_subtitle: "Suid-Afrika se township-eerste wedplatform — vinnige uitbetalings, plaaslike speletjies, gemeenskapstrots. Gebou vir eKasi! 🇿🇦",
    hero_cta_primary: "Begin Nou Wen",
    hero_cta_secondary: "Lewendige Wedstryde",
    hero_stat_winners: "50K+",
    hero_stat_winners_label: "Wenners",
    hero_stat_paid: "R2M+",
    hero_stat_paid_label: "Uitbetaal",
    hero_stat_payout: "~2min",
    hero_stat_payout_label: "Uitbetaling",
    hero_won: "+R750 Gewen!",
    hero_instant: "Kitsweddenskappe",
    hero_live_from: "Lewendig Vanaf",

    // Trust
    trust_licensed: "Gelisensieer & Gereguleer",
    trust_licensed_desc: "SA Dobbelraad Goedgekeur",
    trust_security: "Bankgraad Sekuriteit",
    trust_security_desc: "256-bis SSL Enkripsie",
    trust_withdrawals: "Kits Onttrekkings",
    trust_withdrawals_desc: "Word Binne Minute Betaal",
    trust_mobile: "Selfoon Geoptimeer",
    trust_mobile_desc: "Wed Oral, Enige Tyd",

    // Betting
    betting_label: "Sport & Speletjies",
    betting_title: "Kies Jou Spel",
    betting_local: "Plaaslike Sokker",
    betting_local_sub: "PSL & Kasi Toernooie",
    betting_intl: "Internasionaal",
    betting_intl_sub: "Premier League, La Liga",
    betting_esports: "eSports",
    betting_esports_sub: "FIFA, PUBG, LoL",
    betting_quick: "Vinnige Speletjies",
    betting_quick_sub: "Draai & Wen Kits",

    // Why
    why_label: "Hoekom eKasibets",
    why_title: "Die Platform Gebou vir Jou",
    why_subtitle: "Ons is nie nog 'n generiese wedapp nie. Ons is jou bure, jou gemeenskap, jou wenvennoot.",
    why_built: "Gebou vir eKasi",
    why_built_desc: "Ons verstaan township-lewe. Wed op plaaslike derbies, ondersteun jou gemeenskapspanne.",
    why_fast: "Blitsvinnige Uitbetalings",
    why_fast_desc: "Moenie dae wag nie. Word direk in jou rekening betaal binne minute.",
    why_community: "Gemeenskapsgedrewe",
    why_community_desc: "Ons gee terug. 'n Deel van elke weddenskap ondersteun plaaslike voetbalontwikkeling.",
    why_active: "Aktiewe Wedders",
    why_paid: "Maandeliks Uitbetaal",
    why_leagues: "Plaaslike Ligas Gedek",
    why_ready: "Gereed om te begin?",
    why_join_cta: "Sluit by 50,000+ wenners aan vandag",
    why_get_started: "Begin",

    // Township
    township_label: "REGUIT VANAF DIE KASI",
    township_title_1: "DIS HIER",
    township_title_2: "WAAR",
    township_title_3: "LEGENDES GEMAAK WORD",
    township_subtitle: "Van die stofstrate tot die groot stadions, ons weet waar die regte spel gespeel word",
    township_bettors: "KASI WEDDERS",
    township_won: "GEWEN HIERDIE JAAR",
    township_live: "LEWENDIGE AKSIE",
    township_join: "SLUIT AAN BY DIE BEWEGING 🔥",

    scene_shisa: "Shisa Nyama Saterdae",
    scene_shisa_vibe: "Waar weddenskappe en braai ontmoet",
    scene_legends: "Kasi Sokkerlange",
    scene_legends_vibe: "Straatsokker drome",
    scene_tavern: "Die Plaaslike Tavern",
    scene_tavern_vibe: "Gemeenskapsgees leef hier",
    scene_street: "Straathoek Vibes",
    scene_street_vibe: "Waar wenners bymekaarkom",
    scene_matchday: "Wedstryddag Energie",
    scene_matchday_vibe: "Die gebrul van die skare",
    scene_victory: "Oorwinningsvieringe",
    scene_victory_vibe: "Ons vier saam",

    // How
    how_label: "Hoe Werk Dit",
    how_title: "Begin Wen in 3 Stappe",
    how_subtitle: "Geen ingewikkelde registrasie. Geen versteekte fooie. Net eenvoudige weddenskappe.",
    how_step1: "Skep 'n Rekening",
    how_step1_desc: "Registreer in minder as 60 sekondes. Net jou foonnommer en jy's binne.",
    how_step2: "Plaas Jou Weddenskap",
    how_step2_desc: "Kies uit plaaslike kasi-speletjies of internasionale wedstryde. Eenvoudige koppelvlak.",
    how_step3: "Word Kits Betaal",
    how_step3_desc: "Gewen? Jou geld tref jou rekening binne minute. Geen dae wag nie.",
    how_cta: "Begin Nou Wed",

    // Promos
    promo_label: "Promos",
    promo_title: "Eksklusiewe Bonusse",
    promo_welcome: "Verwelkomingsbonus",
    promo_welcome_desc: "100% pas op jou eerste deposito tot R1,000",
    promo_derby: "Derbidag Spesiale",
    promo_derby_desc: "Verbeterde odds op alle Chiefs vs Pirates wedstryde",
    promo_cashback: "Weeklikse Terugbetaling",
    promo_cashback_desc: "10% terugbetaling op verliese elke Maandag",
    promo_claim: "Eis Nou",
    promo_view: "Sien Odds",
    promo_learn: "Leer Meer",

    // Testimonials
    test_label: "Getuienisse",
    test_title: "Wenstories",

    // Stadium
    stadium_label: "MZANSI SE BESTE",
    stadium_title_1: "WAAR DIE MAGIE",
    stadium_title_2: "GEBEUR",
    stadium_subtitle: "Wed op wedstryde van Suid-Afrika se grootste stadions",

    // Responsible
    resp_badge: "18+ Slegs • Speel Verantwoordelik",
    resp_title: "Verantwoordelike Dobbel",
    resp_subtitle: "Wed moet pret wees. Ons is verbind om jou te help om in beheer te bly.",
    resp_limits: "Stel depositolimiete",
    resp_breaks: "Neem enige tyd pouses",
    resp_support: "Kry ondersteuning 24/7",
    resp_learn: "Leer oor verantwoordelike wed",

    // Footer
    footer_cta_title: "Gereed om te begin wen?",
    footer_cta_sub: "Sluit by 50,000+ Suid-Afrikaners aan wat slimmer wed met eKasibets",
    footer_cta_btn: "Begin Gratis",
    footer_brand_desc: "Suid-Afrika se premier township-eerste wedplatform. Wed plaaslik, wen plaaslik.",
    footer_product: "Produk",
    footer_company: "Maatskappy",
    footer_support: "Ondersteuning",
    footer_legal: "Wetlik",
    footer_copyright: "eKasibets. Alle regte voorbehou. Gelisensieer deur die SA Dobbelraad.",
    footer_made: "Met trots in Suid-Afrika gemaak",

    community_title: "Gemeenskapsentrum",
    community_subtitle: "Koppel met mede-wedders, deel oorwinnings",
    wallet_title: "Beursie & Betalings",
    wallet_subtitle: "Bestuur jou geld maklik — EFT, e-beursies, lugtyd, en meer",
    about_title: "Oor eKasibets",
    about_subtitle: "Gebore in die township, gebou vir die mense",
  },
};
