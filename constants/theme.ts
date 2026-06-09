export const FLIPSIDE_THEME = {
  // Uygulamanın Genel Monokrom/Brutalist Paleti
  colors: {
    background: '#0a0a0a',      // Saf brutalist arka plan siyahı
    surface: '#121212',         // Kart arkaları, barlar ve paneller için mat antrasit
    surfaceVariant: '#171717',  // Açılmış kart içi, modal içi mat gri
    border: '#262626',          // Keskin brutalist ince çizgiler
    borderDark: '#1f1f1f',      // Daha koyu çizgiler
    textMuted: '#404040',       // Başlık etiketleri, placeholder alt metinleri
    textSecondary: '#737373',   // Skor metinleri, ikincil durumlar
    textPrimary: '#e5e5e5',     // Okunabilir ana metinler, oyuncu isimleri
    textContrast: '#ffffff',    // Saf beyaz (Önemli buton metinleri)
    actionButton: '#ffffff',    // Saf beyaz ana aksiyon butonu background'u
    actionButtonText: '#000000',// Beyaz butonun içindeki siyah yazı
  },
  
  // Oyuncuların Birbirini Ayırt Etmesi İçin Sadece Kart Kenarlarında/İsimlerinde Geçecek Renkler
  playerColors: [
    '#ef4444', // 1. Oyuncu (Kırmızı)
    '#22c55e', // 2. Oyuncu (Yeşil)
    '#3b82f6', // 3. Oyuncu (Mavi)
    '#eab308', // 4. Oyuncu (Sarı)
  ]
};