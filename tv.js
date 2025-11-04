// TV.JS
// Script untuk bagian TV

// 📺 Data Channel
const channels = [
  {
    name: "Indosiar",
    type: "https://statik.tempo.co/data/2023/07/06/id_1217478/1217478_720.jpg",
    url: "http://op-group1-swiftservehd-1.dens.tv/h/h235/index.m3u8",
    description: "Saluran hiburan dengan berbagai acara menarik",
    streamType: "m3u8", // Menambahkan tipe stream
  },
  {
    name: "ANTV",
    type: "https://lokerbumn.com/wp-content/uploads/2024/06/antv-02.jpg",
    url: "http://66.90.99.154:8278/Antv/playlist.m3u8?tid=MB2B6295959462959594&ct=20383&tsum=abcaf8307d29687da65d267b6203b5d8",
    description: "Saluran dengan berbagai sinetron dan acara hiburan",
    streamType: "m3u8",
  },
  {
    name: "SCTV",
    type: "https://images.seeklogo.com/logo-png/33/1/sctv-logo-png_seeklogo-338230.png",
    url: "http://op-group1-swiftservehd-1.dens.tv/h/h217/02.m3u8",
    description: "Saluran dengan program acara keluarga",
    streamType: "m3u8",
  },
  {
    name: "MNCTV",
    type: "https://cakapinterview.com/wp-content/uploads/2020/08/mnc-picture.jpg",
    url: "https://sindikasi.inews.id/embed/video/YWdlbnQ9ZGVza3RvcCZ1cmw9aHR0cHMlM0ElMkYlMkZlbWJlZC5yY3RpcGx1cy5jb20lMkZsaXZlJTJGbW5jdHYlMkZpbmV3c2lkJmhlaWdodD0xMDAlMjUmd2lkdGg9MTAwJTI1",
    description: "Saluran dengan program acara keluarga",
    streamType: "embed", // Tipe embed
  },
  {
    name: "RCTI",
    type: "https://blog.visionplus.id/wp-content/uploads/2022/08/Link-Streaming-RCTI-HD-2.jpg",
    url: "https://sindikasi.inews.id/embed/video/YWdlbnQ9ZGVza3RvcCZ1cmw9aHR0cHMlM0ElMkYlMkZlbWJlZC5yY3RpcGx1cy5jb20lMkZsaXZlJTJGcmN0aSUyRmluZXdzaWQmaGVpZ2h0PTEwMCUyNSZ3aWR0aD0xMDAlMjU=",
    description: "Saluran dengan program berita dan hiburan",
    streamType: "embed",
  },
  {
    name: "Trans TV",
    type: "https://i.pinimg.com/736x/bf/8f/3c/bf8f3cd07a56f716d5a550e27228ce05.jpg",
    url: "https://video.detik.com/transtv/smil:transtv.smil/playlist.m3u8",
    description: "Saluran hiburan dengan berbagai program menarik",
    streamType: "m3u8",
  },
  {
    name: "Trans 7",
    type: "https://images.seeklogo.com/logo-png/32/1/trans-7-logo-png_seeklogo-326342.png",
    url: "https://video.detik.com/trans7/smil:trans7.smil/playlist.m3u8",
    description: "Saluran dengan program berita dan hiburan",
    streamType: "m3u8",
  },
  {
    name: "Global TV",
    type: "https://www.wowkeren.com/images/news/medium/2017/00180810.jpg",
    url: "https://sindikasi.inews.id/embed/video/YWdlbnQ9ZGVza3RvcCZ1cmw9aHR0cHMlM0ElMkYlMkZlbWJlZC5yY3RpcGx1cy5jb20lMkZsaXZlJTJGZ3R2JTJGaW5ld3NpZCZoZWlnaHQ9MTAwJTI1JndpZHRoPTEwMCUyNQ==",
    description: "Saluran dengan program berita dan hiburan",
    streamType: "embed",
  },
  {
    name: "TV ONE",
    type: "https://blog.visionplus.id/wp-content/uploads/2023/06/Jadwal-Program-tvOne-1000x570.jpg",
    url: "https://op-group1-swiftservehd-1.dens.tv/h/h40/01.m3u8",
    description: "Saluran berita dan olahraga",
    streamType: "m3u8",
  },
  {
    name: "NET TV/MDTV",
    type: "https://jurnalekbis.com/wp-content/uploads/2024/12/logo-net-tv-md-entertainment-mdtv-2411956599.webp",
    url: "https://op-group1-swiftservehd-1.dens.tv/h/h223/02.m3u8",
    description: "Saluran hiburan untuk anak muda",
    streamType: "m3u8",
  },
  {
    name: "Metro TV",
    type: "https://thumbor.prod.vidiocdn.com/3f1SUZvUgp_5WlH1xqSYL6Mnz_E=/filters:quality(70)/vidio-web-prod-livestreaming/uploads/livestreaming/image/777/metro-tv-2eba56.jpg",
    url: "https://op-group1-swiftservehd-1.dens.tv/h/h12/01.m3u8",
    description: "Saluran berita 24 jam",
    streamType: "m3u8",
  },
  {
    name: "RTV",
    type: "https://blue.kumparan.com/image/upload/fl_progressive,fl_lossy,c_fill,f_auto,q_auto:best,w_640/v1634025439/01gjefa2e0h33tb6edhc1ycfw3.jpg",
    url: "https://op-group1-swiftservehd-1.dens.tv/h/h10/01.m3u8",
    description: "Saluran dengan berbagai program edukasi dan hiburan",
    streamType: "m3u8",
  },
  {
    name: "KOMPAS TV",
    type: "https://www.vidio.com/blog/wp-content/uploads/sites/2/elementor/thumbs/Kompas-Tv-qv79xqpttdl5r73ywsh17b09bojsp6oux50bxcwidq.jpg",
    url: "http://op-group1-swiftservehd-1.dens.tv/h/h234/01.m3u8",
    description: "Saluran berita dan informasi",
    streamType: "m3u8",
  },
  {
    name: "CNN INDONESIA",
    type: "https://parabolaku.com/wp-content/uploads/2014/03/cnn-indonesia-logo.jpg",
    url: "http://live.cnnindonesia.com/livecnn/smil:cnntv.smil/chunklist_w2069650134_b280000_sleng.m3u8",
    description: "Saluran berita internasional dan nasional",
    streamType: "m3u8",
  },
  {
    name: "TVRI Nasional",
    type: "https://www.vidio.com/blog/wp-content/uploads/sites/2/elementor/thumbs/TVRI-Landscape-qv7aihziqo0456yip9hfrkfpl08lok3grvncgc4iz2.jpg",
    url: "https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8",
    description: "Saluran televisi nasional Indonesia",
    streamType: "m3u8",
  },
];

// 🎬 Element DOM
const tvList = document.getElementById("tv-list");
const tvLoading = document.getElementById("tv-loading");
const tvSearchInput = document.getElementById("tv-search-input");
const tvSearchBtn = document.getElementById("tv-search-btn");
const tvPlayerModal = document.getElementById("tvPlayerModal");
const tvPlayerTitle = document.getElementById("tvPlayerTitle");
const tvPlayerFrame = document.getElementById("tvPlayerFrame");
const channelInfo = document.getElementById("channelInfo");
const closeTvModal = document.getElementById("closeTvModal");

// Store current player instance to properly clean it up
let currentTvPlayer = null;

// 🧩 Render channel list
function renderChannels(list) {
  if (!tvList) return;

  tvList.innerHTML = "";
  if (list.length === 0) {
    tvList.innerHTML = "<p>😔 Tidak ada channel ditemukan.</p>";
    return;
  }

  list.forEach((ch, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = `${(index % 12) * 0.03}s`;

    // Tambahkan indikator tipe stream
    const streamTypeIcon =
      ch.streamType === "embed"
        ? '<i class="fas fa-window-maximize" style="color: var(--secondary-color);"></i>'
        : '<i class="fas fa-broadcast-tower" style="color: var(--primary-color);"></i>';

    card.innerHTML = `
      <div class="card-header">
        <img src="${ch.type}" alt="${
      ch.name
    }" onerror="this.src='https://picsum.photos/seed/${ch.name}/300/400.jpg'">
        <div class="stream-type-indicator">${streamTypeIcon}</div>
      </div>
      <div class="card-content">
        <h3>${ch.name}</h3>
        <p>${ch.description || "Saluran TV Indonesia"}</p>
      </div>
    `;
    card.addEventListener("click", () => openTvPlayer(ch));
    tvList.appendChild(card);
  });
}

// 🔍 Search functionality
function searchChannels() {
  const searchTerm = tvSearchInput.value.toLowerCase().trim();

  if (!searchTerm) {
    renderChannels(channels);
    return;
  }

  const filteredChannels = channels.filter(
    (channel) =>
      channel.name.toLowerCase().includes(searchTerm) ||
      (channel.description &&
        channel.description.toLowerCase().includes(searchTerm))
  );

  renderChannels(filteredChannels);
}

// ▶️ Open player (menangani M3U8 dan embed secara terpisah)
function openTvPlayer(channel) {
  // Clean up any existing player
  if (currentTvPlayer) {
    if (currentTvPlayer.hls) {
      currentTvPlayer.hls.destroy();
    }
    currentTvPlayer = null;
  }

  tvPlayerTitle.textContent = channel.name;
  channelInfo.textContent = channel.description || "Sedang memutar channel...";
  tvPlayerModal.classList.add("show");

  // Kosongkan frame sebelumnya
  tvPlayerFrame.innerHTML = "";

  // Handle berdasarkan tipe stream
  if (channel.streamType === "embed") {
    // Untuk tipe embed, gunakan iframe
    const iframe = document.createElement("iframe");
    iframe.src = channel.url;
    iframe.frameBorder = "0";
    iframe.allowFullscreen = true;
    iframe.style.width = "100%";
    iframe.style.height = "400px";
    iframe.style.borderRadius = "10px";
    iframe.style.background = "#000";

    tvPlayerFrame.appendChild(iframe);

    // Simpan referensi ke iframe
    currentTvPlayer = {
      element: iframe,
      type: "embed",
    };
  } else {
    // Untuk tipe M3U8, gunakan HLS.js
    const video = document.createElement("video");
    video.controls = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.style.width = "100%";
    video.style.borderRadius = "10px";
    video.style.background = "#000";

    tvPlayerFrame.appendChild(video);

    // Store the player instance
    currentTvPlayer = {
      element: video,
      hls: null,
      type: "m3u8",
    };

    // Cek apakah HLS.js tersedia
    if (typeof Hls !== "undefined" && Hls.isSupported()) {
      const hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      currentTvPlayer.hls = hls;
      hls.loadSource(channel.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        // Use a promise to handle play() properly
        const playPromise = video.play();

        if (playPromise !== undefined) {
          playPromise
            .then((_) => {
              // Autoplay started
              console.log("Playback started successfully");
            })
            .catch((error) => {
              // Autoplay was prevented
              console.log("Autoplay was prevented:", error);
              // Show a play button overlay
              const playOverlay = document.createElement("div");
              playOverlay.className = "play-overlay";
              playOverlay.innerHTML = `<i class="fas fa-play-circle"></i>`;
              playOverlay.style.cssText = `
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(0,0,0,0.5);
              cursor: pointer;
              z-index: 10;
            `;

              playOverlay.addEventListener("click", function () {
                video.play();
                playOverlay.remove();
              });

              tvPlayerFrame.style.position = "relative";
              tvPlayerFrame.appendChild(playOverlay);
            });
        }
      });

      hls.on(Hls.Events.ERROR, function (event, data) {
        console.error("HLS Error:", data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Try to recover network error
              console.log("Fatal network error, trying to recover...");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("Fatal media error, trying to recover...");
              hls.recoverMediaError();
              break;
            default:
              // Cannot recover
              console.error("Fatal error, cannot recover");
              showErrorContainer();
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = channel.url;

      video.addEventListener("loadedmetadata", function () {
        const playPromise = video.play();

        if (playPromise !== undefined) {
          playPromise
            .then((_) => {
              console.log("Playback started successfully");
            })
            .catch((error) => {
              console.log("Autoplay was prevented:", error);
              // Show a play button overlay
              const playOverlay = document.createElement("div");
              playOverlay.className = "play-overlay";
              playOverlay.innerHTML = `<i class="fas fa-play-circle"></i>`;
              playOverlay.style.cssText = `
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(0,0,0,0.5);
              cursor: pointer;
              z-index: 10;
            `;

              playOverlay.addEventListener("click", function () {
                video.play();
                playOverlay.remove();
              });

              tvPlayerFrame.style.position = "relative";
              tvPlayerFrame.appendChild(playOverlay);
            });
        }
      });
    } else {
      // Fallback ke iframe jika HLS tidak didukung
      showErrorContainer(
        "Browser Anda tidak mendukung streaming M3U8. Silakan coba browser lain."
      );
    }
  }
}

function showErrorContainer(
  message = "Terjadi kesalahan saat memutar channel"
) {
  tvPlayerFrame.innerHTML = `
    <div class="error-container">
      <i class="fas fa-exclamation-triangle"></i>
      <p>${message}</p>
      <p>Coba lagi nanti atau pilih channel lain</p>
    </div>
  `;
}

// ❌ Close player
function closeTvPlayer() {
  // Clean up any existing player
  if (currentTvPlayer) {
    if (currentTvPlayer.hls) {
      currentTvPlayer.hls.destroy();
    }
    currentTvPlayer = null;
  }

  tvPlayerModal.classList.remove("show");
  tvPlayerFrame.innerHTML = "";
}

// Event listeners
function setupTvEventListeners() {
  if (closeTvModal) {
    closeTvModal.addEventListener("click", closeTvPlayer);
  }

  if (tvSearchBtn) {
    tvSearchBtn.addEventListener("click", searchChannels);
  }

  if (tvSearchInput) {
    tvSearchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") searchChannels();
    });
  }

  // Close modal when clicking outside
  if (tvPlayerModal) {
    tvPlayerModal.addEventListener("click", (e) => {
      if (e.target === tvPlayerModal) {
        closeTvPlayer();
      }
    });
  }
}

// 🚀 Init TV saat tab aktif
document.addEventListener("DOMContentLoaded", () => {
  setupTvEventListeners();

  // Cek apakah tab TV aktif
  const tvTab = document.getElementById("tvTab");
  if (tvTab && tvTab.classList.contains("active")) {
    initTvTab();
  }

  // Tambahkan event listener untuk tab switching
  const tvTabLink = document.querySelector('[data-tab="tvTab"]');
  if (tvTabLink) {
    tvTabLink.addEventListener("click", () => {
      setTimeout(initTvTab, 100);
    });
  }
});

function initTvTab() {
  // Sembunyikan loading setelah sedikit delay untuk efek loading
  setTimeout(() => {
    if (tvLoading) tvLoading.style.display = "none";
    renderChannels(channels);
  }, 500);
}

// Tambahkan style untuk error container, play overlay, dan stream type indicator
const tvStyle = document.createElement("style");
tvStyle.textContent = `
  .tv-player-container {
    padding: 1.5rem;
  }
  
  .player-title {
    margin-bottom: 1rem;
    text-align: center;
    font-size: 1.5rem;
  }
  
  .player-frame {
    margin-bottom: 1rem;
    position: relative;
  }
  
  .player-info {
    text-align: center;
    color: var(--text-secondary);
  }
  
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    color: var(--error-color);
    text-align: center;
  }
  
  .error-container i {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .error-container p {
    margin-bottom: 0.5rem;
  }
  
  .play-overlay i {
    font-size: 4rem;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .card-header {
    position: relative;
  }
  
  .stream-type-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .stream-type-indicator i {
    font-size: 14px;
  }
`;
document.head.appendChild(tvStyle);

// Load HLS.js jika belum ada
if (typeof Hls === "undefined") {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
  script.onload = function () {
    console.log("HLS.js loaded");
  };
  document.head.appendChild(script);
}
