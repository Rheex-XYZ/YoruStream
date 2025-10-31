// ANIME.JS
// 🌌 API URL
const baseApiUrl =
  "https://www.sankavollerei.com/anime/samehadaku/completed?page=";
const searchApiUrl = "https://www.sankavollerei.com/anime/samehadaku/search?q=";
const animeDetailUrl = "https://www.sankavollerei.com/anime/samehadaku/anime/";
const episodeDetailUrl =
  "https://www.sankavollerei.com/anime/samehadaku/episode/";
const batchApiUrl =
  "https://www.sankavollerei.com/anime/samehadaku/batch?page=";
const batchDetailUrl = "https://www.sankavollerei.com/anime/samehadaku/batch/";

// 🌟 ELEMENT DOM
const animeList = document.getElementById("anime-list");
const batchList = document.getElementById("batch-list");
const loading = document.getElementById("loading");
const sectionTitleText = document.getElementById("section-title-text");
const viewAnimeBtn = document.getElementById("view-anime");
const viewBatchBtn = document.getElementById("view-batch");
let currentPage = 1;
let currentBatchPage = 1;
let currentView = "anime";

// 🚀 INIT
document.addEventListener("DOMContentLoaded", () => {
  loadCompletedAnime(currentPage);
  loadBatchAnime(currentBatchPage);

  viewAnimeBtn.addEventListener("click", () => {
    currentView = "anime";
    viewAnimeBtn.classList.add("active");
    viewBatchBtn.classList.remove("active");
    animeList.style.display = "grid";
    batchList.style.display = "none";
    sectionTitleText.textContent = "Anime Terbaru";
    renderPagination(currentPage);
  });

  viewBatchBtn.addEventListener("click", () => {
    currentView = "batch";
    viewBatchBtn.classList.add("active");
    viewAnimeBtn.classList.remove("active");
    animeList.style.display = "none";
    batchList.style.display = "grid";
    sectionTitleText.textContent = "Batch Anime";
    renderBatchPagination(currentBatchPage);
  });
});

// 🌠 FETCH DATA COMPLETED
async function loadCompletedAnime(page = 1) {
  showLoading();
  try {
    const res = await fetch(baseApiUrl + page);
    const data = await res.json();
    renderAnime(data.data.animeList);
    if (currentView === "anime") {
      renderPagination(page);
    }
    observeCards();
  } catch (err) {
    console.error(err);
    loading.textContent = "Gagal memuat data. Coba lagi nanti.";
  }
}

// 🌠 FETCH DATA BATCH
async function loadBatchAnime(page = 1) {
  try {
    const res = await fetch(batchApiUrl + page);
    const data = await res.json();
    renderBatchAnime(data.data.batchList);
    if (currentView === "batch") {
      renderBatchPagination(page);
    }
    observeCards();
  } catch (err) {
    console.error(err);
    if (batchList) {
      batchList.innerHTML = "<p>Gagal memuat batch anime. Coba lagi nanti.</p>";
    }
  }
}

// 🌠 SEARCH FUNCTION
async function searchAnime(query) {
  if (!query) return loadCompletedAnime(currentPage);
  showLoading();
  try {
    const res = await fetch(searchApiUrl + encodeURIComponent(query));
    const data = await res.json();
    if (data.status !== "success") throw new Error("Gagal memuat data search");
    renderAnime(data.data.animeList);
    const pagination = document.getElementById("pagination");
    if (pagination) pagination.innerHTML = "";
    observeCards();
  } catch (err) {
    console.error(err);
    loading.textContent = "Anime tidak ditemukan.";
  }
}

// 🌌 RENDER DATA ANIME
function renderAnime(animes) {
  animeList.innerHTML = "";
  if (!animes || animes.length === 0) {
    loading.textContent = "Anime tidak ditemukan.";
    return;
  }
  animes.forEach((anime, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = `${index * 0.1}s`;
    const animeId = anime.animeId || anime.slug || anime.id;
    card.innerHTML = `
            <img src="${anime.poster}" alt="${anime.title}" />
            <div class="card-content">
                <h3>${anime.title}</h3>
                <p>${anime.type} • ⭐ ${anime.score || "-"}</p>
            </div>
        `;
    card.addEventListener("click", () => openAnimeDetail(animeId));
    animeList.appendChild(card);
  });
  loading.style.display = "none";
}

// 🌌 RENDER DATA BATCH
function renderBatchAnime(batches) {
  batchList.innerHTML = "";
  if (!batches || batches.length === 0) {
    batchList.innerHTML = "<p>Tidak ada batch anime.</p>";
    return;
  }
  batches.forEach((batch, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = `${index * 0.1}s`;
    card.innerHTML = `
            <img src="${batch.poster}" alt="${batch.title}" />
            <div class="card-content">
                <h3>${batch.title}</h3>
                <p>${batch.type} • ⭐ ${batch.score || "-"}</p>
            </div>
        `;
    card.addEventListener("click", () => openBatchDetail(batch.batchId));
    batchList.appendChild(card);
  });
}

// 🔢 PAGINATION ANIME
function renderPagination(page) {
  let pagination = document.getElementById("pagination");
  if (!pagination) return;
  pagination.innerHTML = `
        <button id="prev-page" ${page <= 1 ? "disabled" : ""}>⬅️ Prev</button>
        <span>Halaman ${page}</span>
        <button id="next-page">Next ➡️</button>
    `;
  document.getElementById("prev-page").addEventListener("click", () => {
    if (page > 1) {
      currentPage--;
      loadCompletedAnime(currentPage);
    }
  });
  document.getElementById("next-page").addEventListener("click", () => {
    currentPage++;
    loadCompletedAnime(currentPage);
  });
}

// 🔢 PAGINATION BATCH
function renderBatchPagination(page) {
  let pagination = document.getElementById("pagination");
  if (!pagination) return;
  pagination.innerHTML = `
        <button id="prev-batch-page" ${
          page <= 1 ? "disabled" : ""
        }>⬅️ Prev</button>
        <span>Halaman ${page}</span>
        <button id="next-batch-page">Next ➡️</button>
    `;
  document.getElementById("prev-batch-page").addEventListener("click", () => {
    if (page > 1) {
      currentBatchPage--;
      loadBatchAnime(currentBatchPage);
    }
  });
  document.getElementById("next-batch-page").addEventListener("click", () => {
    currentBatchPage++;
    loadBatchAnime(currentBatchPage);
  });
}

// 🔎 SEARCH EVENT
document.getElementById("search-btn").addEventListener("click", () => {
  const query = document.getElementById("search-input").value;
  searchAnime(query);
});
document.getElementById("search-input").addEventListener("keyup", (e) => {
  if (e.key === "Enter") searchAnime(e.target.value);
});

// 🌠 LOADING HANDLER
function showLoading() {
  animeList.innerHTML = "";
  loading.style.display = "block";
  loading.textContent = "Memuat data anime...";
}

/* ========== POPUP INTERAKTIF ========== */
const popupOverlay = document.getElementById("animePopup");
const popupContent = document.getElementById("popupContent");
const closePopup = document.getElementById("closePopup");
closePopup.addEventListener("click", () => {
  popupOverlay.classList.remove("show");
  popupContent.innerHTML = "";
});

// 🌌 BUKA DETAIL ANIME
async function openAnimeDetail(animeId) {
  popupOverlay.classList.add("show");
  popupContent.innerHTML = `<p style="color:#fff;text-align:center;">🔄 Memuat detail anime...</p>`;
  try {
    const res = await fetch(animeDetailUrl + animeId);
    const data = await res.json();
    const anime = data.data;
    const synopsis =
      anime.synopsis?.paragraphs?.join("<br><br>") || "Tidak ada deskripsi.";
    const genres =
      anime.genreList?.map((g) => `<span>${g.title}</span>`).join("") || "";
    popupContent.innerHTML = `
            <div class="popup-anime">
                <img src="${anime.poster}" alt="${anime.title}" />
                <div class="popup-info">
                    <h2>${anime.title}</h2>
                    <div class="genre-list">${genres}</div>
                    <p>${synopsis}</p>
                    <div class="popup-buttons">
                        <button class="stream-btn" id="streamBtn">🎬 STREAM</button>
                        <button class="download-btn" id="downloadBtn">⬇️ DOWNLOAD</button>
                    </div>
                    <div id="episodeContainer" class="episode-list"></div>
                </div>
            </div>
        `;
    document
      .getElementById("streamBtn")
      .addEventListener("click", () =>
        renderEpisodeList(anime.episodeList, "stream")
      );
    document
      .getElementById("downloadBtn")
      .addEventListener("click", () =>
        renderEpisodeList(anime.episodeList, "download")
      );
  } catch (err) {
    console.error(err);
    popupContent.innerHTML = `<p style="color:#f55;">Gagal memuat data anime!</p>`;
  }
}

// 🌌 BUKA DETAIL BATCH
async function openBatchDetail(batchId) {
  popupOverlay.classList.add("show");
  popupContent.innerHTML = `<p style="color:#fff;text-align:center;">🔄 Memuat detail batch...</p>`;
  try {
    const res = await fetch(batchDetailUrl + batchId);
    const data = await res.json();
    const batch = data.data;
    const synopsis =
      batch.synopsis?.paragraphs?.join("<br><br>") || "Tidak ada deskripsi.";
    const genres =
      batch.genreList?.map((g) => `<span>${g.title}</span>`).join("") || "";
    popupContent.innerHTML = `
            <div class="popup-anime">
                <img src="${batch.poster}" alt="${batch.title}" />
                <div class="popup-info">
                    <h2>${batch.title}</h2>
                    <div class="genre-list">${genres}</div>
                    <p>${synopsis}</p>
                    <div class="popup-buttons">
                        <button class="download-btn" id="batchDownloadBtn">⬇️ DOWNLOAD BATCH</button>
                    </div>
                    <div id="episodeContainer" class="episode-list"></div>
                </div>
            </div>
        `;
    document
      .getElementById("batchDownloadBtn")
      .addEventListener("click", () =>
        renderDownloadList(batch.downloadUrl?.formats || [])
      );
  } catch (err) {
    console.error(err);
    popupContent.innerHTML = `<p style="color:#f55;">Gagal memuat data batch!</p>`;
  }
}

// 🌌 RENDER LIST EPISODE
function renderEpisodeList(episodes, mode) {
  const container = document.getElementById("episodeContainer");
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
                  `<button class="episode-btn" onclick="handleEpisode('${ep.episodeId}', '${mode}')">${ep.title}</button>`
              )
              .join("")}
        </div>
    `;
}

// 🌌 HANDLE STREAM / DOWNLOAD
async function handleEpisode(episodeId, mode) {
  const container = document.getElementById("episodeContainer");
  container.innerHTML = `<p style="text-align:center;color:#fff;">🔄 Memuat...</p>`;
  try {
    const res = await fetch(episodeDetailUrl + episodeId);
    const data = await res.json();
    const ep = data.data;
    if (mode === "stream") renderStreamList(ep);
    else renderDownloadList(ep.downloadUrl?.formats || []);
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p style="color:#f55;text-align:center;">Gagal memuat episode!</p>`;
  }
}

// 🌌 RENDER STREAM
function renderStreamList(ep) {
  const container = document.getElementById("episodeContainer");
  if (!ep.server || !ep.server.qualities) {
    container.innerHTML = `<p>Tidak ada sumber streaming tersedia.</p>`;
    return;
  }
  let html = `
        <h3>🎥 Pilih Kualitas / Server Streaming</h3>
        <div id="videoContainer">
            <iframe src="${ep.defaultStreamingUrl}" width="100%" height="400" allowfullscreen></iframe>
        </div>
    `;
  ep.server.qualities.forEach((quality) => {
    if (!quality.serverList || quality.serverList.length === 0) return;
    html += `
            <div class="download-section">
                <h3>${quality.title}</h3>
                <div class="download-buttons">
                    ${quality.serverList
                      .map(
                        (srv) =>
                          `<button class="quality-btn" onclick="openStreamServer('${srv.serverId}')">${srv.title}</button>`
                      )
                      .join("")}
                </div>
            </div>
        `;
  });
  container.innerHTML = html;
}

// 🌌 GANTI SERVER STREAM
async function openStreamServer(serverId) {
  const videoContainer = document.getElementById("videoContainer");
  videoContainer.innerHTML = `<p style="text-align:center;color:#fff;">🔄 Memuat server...</p>`;
  try {
    const res = await fetch(
      `https://www.sankavollerei.com/anime/samehadaku/server/${serverId}`
    );
    const data = await res.json();
    videoContainer.innerHTML = `<iframe src="${data.data.url}" width="100%" height="400" allowfullscreen></iframe>`;
  } catch (err) {
    console.error(err);
    videoContainer.innerHTML = `<p style="color:#f55;">Gagal memuat server streaming!</p>`;
  }
}

// 🌌 RENDER LINK DOWNLOAD
function renderDownloadList(formats) {
  const container = document.getElementById("episodeContainer");
  if (!formats || formats.length === 0) {
    container.innerHTML = "<p>Tidak ada link download.</p>";
    return;
  }
  let html = `<h3>📥 Pilih Format & Kualitas</h3>`;
  formats.forEach((f) => {
    html += `<div class="download-group"><h4>${f.title}</h4>`;
    f.qualities.forEach((q) => {
      html += `<div class="download-quality"><strong>${q.title}</strong>`;
      q.urls.forEach((u) => {
        html += `<a href="${
          u.url
        }" target="_blank" class="download-link">${u.title.trim()}</a>`;
      });
      html += `</div>`;
    });
    html += `</div>`;
  });
  container.innerHTML = html;
}
