// DONGHUA.JS
// 🐉 API URL
const baseDonghuaOngoingUrl =
  "https://www.sankavollerei.com/anime/donghua/ongoing/";
const baseDonghuaCompletedUrl =
  "https://www.sankavollerei.com/anime/donghua/completed/";
const donghuaSearchUrl = "https://www.sankavollerei.com/anime/donghua/search/";
const donghuaDetailUrl = "https://www.sankavollerei.com/anime/donghua/detail/";
const donghuaEpisodeUrl =
  "https://www.sankavollerei.com/anime/donghua/episode/";

// 🌟 ELEMENT DOM
const donghuaList = document.getElementById("donghua-list");
const donghuaLoading = document.getElementById("donghua-loading");
const donghuaSearchInput = document.getElementById("donghua-search-input");
const donghuaSearchBtn = document.getElementById("donghua-search-btn");
const donghuaPagination = document.getElementById("donghua-pagination");
const donghuaSectionTitleText = document.getElementById("section-title-text");
const viewOngoingBtn = document.getElementById("view-ongoing");
const viewCompletedBtn = document.getElementById("view-completed");

// 📊 STATE
let currentDonghuaPage = 1;
let currentDonghuaView = "ongoing"; // ongoing atau completed

// 🚀 INIT
document.addEventListener("DOMContentLoaded", () => {
  // Cek apakah tab Donghua aktif
  const donghuaTab = document.getElementById("donghuaTab");
  if (donghuaTab && donghuaTab.classList.contains("active")) {
    initDonghuaTab();
  }

  // Tambahkan event listener untuk tab switching
  const donghuaTabLink = document.querySelector('[data-tab="donghuaTab"]');
  if (donghuaTabLink) {
    donghuaTabLink.addEventListener("click", () => {
      setTimeout(initDonghuaTab, 100);
    });
  }
});

function initDonghuaTab() {
  // Setup event listeners
  setupDonghuaEventListeners();

  // Load data
  loadDonghua(currentDonghuaPage);
}

function setupDonghuaEventListeners() {
  const searchBtn = document.getElementById("donghua-search-btn");
  const searchInput = document.getElementById("donghua-search-input");
  const ongoingBtn = document.getElementById("view-ongoing");
  const completedBtn = document.getElementById("view-completed");

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const query = searchInput.value.trim();
      searchDonghua(query);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim();
        searchDonghua(query);
      }
    });
  }

  if (ongoingBtn) {
    ongoingBtn.addEventListener("click", () => {
      currentDonghuaView = "ongoing";
      ongoingBtn.classList.add("active");
      completedBtn.classList.remove("active");
      donghuaSectionTitleText.textContent = "Donghua Ongoing";
      currentDonghuaPage = 1;
      loadDonghua(currentDonghuaPage);
    });
  }

  if (completedBtn) {
    completedBtn.addEventListener("click", () => {
      currentDonghuaView = "completed";
      completedBtn.classList.add("active");
      ongoingBtn.classList.remove("active");
      donghuaSectionTitleText.textContent = "Donghua Completed";
      currentDonghuaPage = 1;
      loadDonghua(currentDonghuaPage);
    });
  }
}

// 🌠 FETCH DATA
async function loadDonghua(page = 1) {
  showDonghuaLoading();

  try {
    const apiUrl =
      currentDonghuaView === "ongoing"
        ? baseDonghuaOngoingUrl + page
        : baseDonghuaCompletedUrl + page;

    const res = await fetch(apiUrl);
    const data = await res.json();

    if (data.status !== "success") throw new Error("Gagal memuat data");

    const donghuaList =
      currentDonghuaView === "ongoing"
        ? data.ongoing_donghua
        : data.completed_donghua;

    renderDonghua(donghuaList);
    renderDonghuaPagination(page);
    observeCards();
  } catch (err) {
    console.error(err);
    showDonghuaError("Gagal memuat data. Coba lagi nanti.");
  }
}

// 🔍 SEARCH FUNCTION
async function searchDonghua(query) {
  if (!query) return loadDonghua(currentDonghuaPage);

  showDonghuaLoading();

  try {
    const res = await fetch(donghuaSearchUrl + encodeURIComponent(query));
    const data = await res.json();

    // Debug: Tampilkan respons dari API
    console.log("Search API Response:", data);

    // Periksa apakah data valid
    if (!data || !data.data || data.data.length === 0) {
      throw new Error("Tidak ada hasil pencarian");
    }

    renderDonghua(data.data);

    // Sembunyikan pagination untuk hasil pencarian
    const pagination = document.getElementById("donghua-pagination");
    if (pagination) pagination.innerHTML = "";

    observeCards();
  } catch (err) {
    console.error(err);
    showDonghuaError("Donghua tidak ditemukan.");
  }
}

// 🌌 RENDER DATA
function renderDonghua(donghuas) {
  const donghuaList = document.getElementById("donghua-list");
  if (!donghuaList) return;

  donghuaList.innerHTML = "";

  if (!donghuas || donghuas.length === 0) {
    showDonghuaError("Donghua tidak ditemukan.");
    return;
  }

  donghuas.forEach((donghua, index) => {
    const card = document.createElement("div");
    card.className = "card donghua-card";
    card.style.animationDelay = `${index * 0.1}s`;

    // Determine status class
    const statusClass =
      donghua.status === "Completed" ? "status-completed" : "status-ongoing";

    // Extract slug from URL or use slug directly
    let slug = "";
    if (donghua.slug) {
      // Jika slug ada, gunakan langsung
      slug = donghua.slug;
    } else if (donghua.url) {
      // Jika tidak ada slug, ekstrak dari URL
      const urlParts = donghua.url.split("/").filter((part) => part);
      slug = urlParts[urlParts.length - 1];
    }

    // Debug: Tampilkan slug yang diekstrak
    console.log(`Donghua: ${donghua.title}, Slug: ${slug}`);

    // Simpan slug di atribut data untuk digunakan nanti
    card.setAttribute("data-slug", slug);

    card.innerHTML = `
      <div class="status-badge ${statusClass}">${donghua.status}</div>
      <img src="${donghua.poster}" alt="${donghua.title}" />
      <div class="card-content">
        <h3>${donghua.title}</h3>
        <p>${donghua.status}</p>
      </div>
    `;

    card.addEventListener("click", () => {
      const slug = card.getAttribute("data-slug");
      // Pastikan slug tidak ada slash di akhirnya
      const cleanSlug = slug.endsWith("/") ? slug.slice(0, -1) : slug;
      console.log(`Clicked on donghua with slug: ${cleanSlug}`);
      openDonghuaDetail(cleanSlug);
    });

    donghuaList.appendChild(card);
  });

  hideDonghuaLoading();
}

// 🔢 PAGINATION
function renderDonghuaPagination(page) {
  const pagination = document.getElementById("donghua-pagination");
  if (!pagination) return;

  pagination.innerHTML = `
    <button id="prev-donghua-page" ${
      page <= 1 ? "disabled" : ""
    }>⬅️ Prev</button>
    <span>Halaman ${page}</span>
    <button id="next-donghua-page">Next ➡️</button>
  `;

  document.getElementById("prev-donghua-page").addEventListener("click", () => {
    if (page > 1) {
      currentDonghuaPage--;
      loadDonghua(currentDonghuaPage);
    }
  });

  document.getElementById("next-donghua-page").addEventListener("click", () => {
    currentDonghuaPage++;
    loadDonghua(currentDonghuaPage);
  });
}

// 🌠 POPUP DETAIL
async function openDonghuaDetail(donghuaId) {
  const popupOverlay = document.getElementById("donghuaPopup");
  const popupContent = document.getElementById("donghuaPopupContent");

  if (!popupOverlay || !popupContent) {
    // Buat popup jika belum ada
    createDonghuaPopup();
    return openDonghuaDetail(donghuaId);
  }

  popupOverlay.classList.add("show");
  popupContent.innerHTML = `<p style="color:#fff;text-align:center;">🔄 Memuat detail donghua...</p>`;

  try {
    // Debug: Tampilkan URL yang akan dipanggil
    console.log("Fetching detail from:", donghuaDetailUrl + donghuaId);

    const res = await fetch(donghuaDetailUrl + donghuaId);

    // Periksa status respons
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    // Debug: Tampilkan respons dari API
    console.log("API Response:", data);

    // Periksa apakah data valid
    if (!data || Object.keys(data).length === 0) {
      throw new Error("Data kosong dari API");
    }

    // Periksa status respons - Ubah pengecekan ini
    // API donghua mengembalikan status "Ongoing" atau "Completed" bukan "success"
    if (!data.title) {
      throw new Error("Data donghua tidak valid");
    }

    const donghua = data;
    const synopsis = donghua.synopsis || "Tidak ada deskripsi.";
    const genres =
      donghua.genres?.map((g) => `<span>${g.name}</span>`).join("") || "";

    popupContent.innerHTML = `
      <div class="popup-anime">
        <img src="${donghua.poster}" alt="${donghua.title}" />
        <div class="popup-info">
          <h2>${donghua.title}</h2>
          ${
            donghua.alter_title
              ? `<p><strong>Alter Title:</strong> ${donghua.alter_title}</p>`
              : ""
          }
          <div class="genre-list">${genres}</div>
          <p><strong>Status:</strong> ${donghua.status}</p>
          <p><strong>Studio:</strong> ${donghua.studio || "-"}</p>
          <p><strong>Network:</strong> ${donghua.network || "-"}</p>
          <p><strong>Released:</strong> ${donghua.released || "-"}</p>
          <p><strong>Duration:</strong> ${donghua.duration || "-"}</p>
          <p><strong>Episodes:</strong> ${donghua.episodes_count || "-"}</p>
          <p><strong>Country:</strong> ${donghua.country || "-"}</p>
          <p><strong>Season:</strong> ${donghua.season || "-"}</p>
          <p><strong>Released On:</strong> ${donghua.released_on || "-"}</p>
          <p><strong>Updated On:</strong> ${donghua.updated_on || "-"}</p>
          <p>${synopsis}</p>
          <div class="popup-buttons">
            <button class="stream-btn" id="donghuaStreamBtn">🎬 STREAM</button>
            <button class="download-btn" id="donghuaDownloadBtn">⬇️ DOWNLOAD</button>
          </div>
          <div id="donghuaEpisodeContainer" class="episode-list"></div>
        </div>
      </div>
    `;

    document
      .getElementById("donghuaStreamBtn")
      .addEventListener("click", () => {
        renderDonghuaEpisodeList(donghua.episodes_list, "stream");
      });

    document
      .getElementById("donghuaDownloadBtn")
      .addEventListener("click", () => {
        renderDonghuaEpisodeList(donghua.episodes_list, "download");
      });

    // Setup close button
    document
      .getElementById("closeDonghuaPopup")
      .addEventListener("click", () => {
        popupOverlay.classList.remove("show");
        popupContent.innerHTML = "";
      });
  } catch (err) {
    console.error(err);

    // Tampilkan pesan error yang lebih informatif
    let errorMessage = "Gagal memuat data donghua!";

    if (err.message.includes("Data kosong")) {
      errorMessage = "Detail donghua tidak tersedia. Silakan coba lagi nanti.";
    } else if (err.message.includes("HTTP error")) {
      errorMessage =
        "Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda.";
    } else if (err.message.includes("Data donghua tidak valid")) {
      errorMessage = "Data donghua tidak valid. Silakan coba lagi nanti.";
    }

    // Tampilkan opsi untuk mencoba lagi
    popupContent.innerHTML = `
      <div class="error-container">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>${errorMessage}</h3>
        <p>Error: ${err.message}</p>
        <button class="retry-btn" onclick="openDonghuaDetail('${donghuaId}')">Coba Lagi</button>
        <button class="close-btn" onclick="document.getElementById('donghuaPopup').classList.remove('show')">Tutup</button>
      </div>
    `;
  }
}

// 🌌 RENDER EPISODE LIST
function renderDonghuaEpisodeList(episodes, mode) {
  const container = document.getElementById("donghuaEpisodeContainer");
  if (!container) return;

  if (!episodes || episodes.length === 0) {
    container.innerHTML = "<p>Tidak ada episode tersedia.</p>";
    return;
  }

  container.innerHTML = `
    <h3>${
      mode === "stream"
        ? "Pilih Episode untuk Stream"
        : "Pilih Episode untuk Download"
    }</h3>
    <div class="episode-buttons">
      ${episodes
        .map(
          (ep) =>
            `<button class="episode-btn" onclick="handleDonghuaEpisode('${ep.slug}', '${mode}')">${ep.episode}</button>`
        )
        .join("")}
    </div>
  `;
}

// 🌌 HANDLE STREAM / DOWNLOAD
async function handleDonghuaEpisode(episodeId, mode) {
  const container = document.getElementById("donghuaEpisodeContainer");
  if (!container) return;

  container.innerHTML = `<p style="text-align:center;color:#fff;">🔄 Memuat...</p>`;

  try {
    // Debug: Tampilkan URL yang akan dipanggil
    console.log("Fetching episode from:", donghuaEpisodeUrl + episodeId);

    const res = await fetch(donghuaEpisodeUrl + episodeId);

    // Periksa status respons
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    // Debug: Tampilkan respons dari API
    console.log("Episode API Response:", data);

    // Periksa apakah data valid
    if (!data || Object.keys(data).length === 0) {
      throw new Error("Data kosong dari API");
    }

    // Periksa status respons - Ubah pengecekan ini
    // API episode mungkin juga tidak mengembalikan status "success"
    if (!data.episode) {
      throw new Error("Data episode tidak valid");
    }

    if (mode === "stream") {
      renderDonghuaStreamList(data);
    } else {
      renderDonghuaDownloadList(data.download_url);
    }
  } catch (err) {
    console.error(err);
    container.innerHTML = `
      <div class="error-container">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Gagal memuat episode!</h3>
        <p>Error: ${err.message}</p>
        <button class="retry-btn" onclick="handleDonghuaEpisode('${episodeId}', '${mode}')">Coba Lagi</button>
      </div>
    `;
  }
}

// 🌌 RENDER STREAM
function renderDonghuaStreamList(episode) {
  const container = document.getElementById("donghuaEpisodeContainer");
  if (!container) return;

  if (!episode.streaming || !episode.streaming.servers) {
    container.innerHTML = `<p>Tidak ada sumber streaming tersedia.</p>`;
    return;
  }

  let html = `
    <h3>🎥 Pilih Server Streaming</h3>
    <div id="donghuaVideoContainer">
      <iframe src="${episode.streaming.main_url.url}" width="100%" height="400" allowfullscreen></iframe>
    </div>
  `;

  html += `
    <div class="download-section">
      <h3>Pilih Server</h3>
      <div class="server-selection">
        ${episode.streaming.servers
          .map(
            (server) =>
              `<button class="server-btn" onclick="changeDonghuaStreamServer('${server.url}')">${server.name}</button>`
          )
          .join("")}
      </div>
    </div>
  `;

  // Add episode navigation
  if (episode.navigation) {
    html += `
      <div class="episode-navigation">
        ${
          episode.navigation.previous_episode
            ? `<button onclick="handleDonghuaEpisode('${episode.navigation.previous_episode.slug}', 'stream')">⬅️ ${episode.navigation.previous_episode.episode}</button>`
            : "<button disabled>⬅️ Previous</button>"
        }
        <span>${episode.episode}</span>
        ${
          episode.navigation.next_episode
            ? `<button onclick="handleDonghuaEpisode('${episode.navigation.next_episode.slug}', 'stream')">${episode.navigation.next_episode.episode} ➡️</button>`
            : "<button disabled>Next ➡️</button>"
        }
      </div>
    `;
  }

  container.innerHTML = html;
}

// 🌌 GANTI SERVER STREAM
function changeDonghuaStreamServer(url) {
  const videoContainer = document.getElementById("donghuaVideoContainer");
  if (!videoContainer) return;

  videoContainer.innerHTML = `<iframe src="${url}" width="100%" height="400" allowfullscreen></iframe>`;
}

// 🌌 RENDER LINK DOWNLOAD
function renderDonghuaDownloadList(downloadUrls) {
  const container = document.getElementById("donghuaEpisodeContainer");
  if (!container) return;

  if (!downloadUrls) {
    container.innerHTML = "<p>Tidak ada link download.</p>";
    return;
  }

  let html = `<h3>📥 Pilih Kualitas</h3>`;

  Object.keys(downloadUrls).forEach((quality) => {
    const qualityName = quality.replace("download_url_", "").toUpperCase();
    html += `
      <div class="download-quality">
        <h4>${qualityName}</h4>
        <div class="download-links">
          ${Object.entries(downloadUrls[quality])
            .map(
              ([host, url]) =>
                `<a href="${url}" target="_blank" class="download-link">${host}</a>`
            )
            .join("")}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// 🌠 LOADING HANDLER
function showDonghuaLoading() {
  const loading = document.getElementById("donghua-loading");
  const list = document.getElementById("donghua-list");

  if (loading) loading.style.display = "block";
  if (list) list.innerHTML = "";
}

function hideDonghuaLoading() {
  const loading = document.getElementById("donghua-loading");
  if (loading) loading.style.display = "none";
}

function showDonghuaError(message) {
  const loading = document.getElementById("donghua-loading");
  const list = document.getElementById("donghua-list");

  if (loading) {
    loading.textContent = message;
    loading.style.display = "block";
  }

  if (list) list.innerHTML = "";
}

// 🌠 CREATE POPUP
function createDonghuaPopup() {
  const popup = document.createElement("div");
  popup.id = "donghuaPopup";
  popup.className = "popup-overlay";

  popup.innerHTML = `
    <div class="popup-content">
      <button id="closeDonghuaPopup" class="close-btn">
        <i class="fas fa-times"></i>
      </button>
      <div id="donghuaPopupContent"></div>
    </div>
  `;

  document.body.appendChild(popup);
}
