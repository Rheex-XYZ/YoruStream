// FILM.JS
// 🎞️ Elemen utama
const filmList = document.getElementById("film-list");
const filmPopup = document.getElementById("filmPopup");
const filmPopupContent = document.getElementById("filmPopupContent");
const closeFilmPopup = document.getElementById("closeFilmPopup");
const filmLoading = document.getElementById("film-loading"); // Tambahkan referensi ke elemen loading

// ⚡ Proxy Codetabs untuk bypass CORS
const proxy = "https://api.codetabs.com/v1/proxy/?quest=";
const baseSite = "https://new20.ngefilm.site/";

// ---------------- FETCH HELPERS ----------------
async function fetchViaProxy(url) {
  const full = proxy + encodeURIComponent(url);
  const res = await fetch(full, { cache: "no-store" });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return await res.text();
}

function resolveUrl(url, base = baseSite) {
  try {
    return new URL(url, base).href;
  } catch {
    return url;
  }
}

function showStatus(msg) {
  filmList.innerHTML = `<p style="padding:20px;text-align:center; color: rgba(255,255,255,0.7);">${msg}</p>`;
}

// Fungsi untuk menyembunyikan loading
function hideLoading() {
  if (filmLoading) {
    filmLoading.style.display = "none";
    filmLoading.style.visibility = "hidden";
    filmLoading.style.opacity = "0";
    filmLoading.style.height = "0";
    filmLoading.style.overflow = "hidden";
    console.log("Loading hidden");
  }
}

// Fungsi untuk menampilkan loading
function showLoading() {
  if (filmLoading) {
    filmLoading.style.display = "block";
    filmLoading.style.visibility = "visible";
    filmLoading.style.opacity = "1";
    filmLoading.style.height = "auto";
    filmLoading.style.overflow = "visible";
    console.log("Loading shown");
  }
}

// ---------------- SEARCH / LOAD FILMS ----------------
async function loadFilms(url = baseSite) {
  // Tampilkan elemen loading
  showLoading();

  try {
    const html = await fetchViaProxy(url);
    const doc = new DOMParser().parseFromString(html, "text/html");

    let results = Array.from(
      doc.querySelectorAll(".gmr-box-content.gmr-box-archive.text-center")
    );

    if (!results.length) {
      results = Array.from(
        doc.querySelectorAll(
          "#gmr-main-load article, .gmr-box-content, article, .content-thumbnail"
        )
      );
    }

    filmList.innerHTML = "";
    if (!results.length) {
      hideLoading();
      return showStatus("⚠️ Tidak ditemukan artikel film.");
    }

    results.forEach((el, idx) => {
      let a = el.querySelector("a") || el.closest("a");
      let href = a
        ? a.getAttribute("href")
        : (el.getAttribute && el.getAttribute("href")) || null;
      if (href) href = resolveUrl(href, url);

      let imgEl = el.querySelector("img");
      let img = "";
      if (imgEl) {
        img =
          imgEl.getAttribute("data-src") ||
          imgEl.getAttribute("data-lazy-src") ||
          imgEl.getAttribute("src") ||
          "";
        if (!img) {
          const srcset =
            imgEl.getAttribute("srcset") ||
            imgEl.getAttribute("data-srcset") ||
            "";
          if (srcset) {
            const parts = srcset.split(",").map((p) => p.trim());
            if (parts.length) {
              const last = parts[parts.length - 1].split(" ")[0];
              img = last;
            }
          }
        }
      }
      if (!img) img = "https://i.ibb.co/2Y4VqQ2/no-image.png";
      else img = resolveUrl(img, url);

      const title =
        (imgEl && (imgEl.getAttribute("title") || imgEl.getAttribute("alt"))) ||
        (a && (a.getAttribute("title") || a.textContent)) ||
        (el.getAttribute && (el.getAttribute("title") || el.textContent)) ||
        "Tanpa Judul";

      if (href) {
        const card = document.createElement("div");
        card.className = "card";
        card.style.animationDelay = `${(idx % 12) * 0.03}s`;
        card.innerHTML = `
                    <img src="${img}" alt="${escapeHtml(title)}" loading="lazy">
                    <div class="card-content">
                        <h3>${escapeHtml(title.trim())}</h3>
                    </div>
                `;

        card.addEventListener("click", () => openPlayer(title.trim(), href));
        filmList.appendChild(card);
      }
    });

    // Sembunyikan elemen loading setelah data berhasil dimuat
    hideLoading();
    observeCards();
    applySearchFilter();
  } catch (err) {
    console.error("❌ Gagal memuat film:", err);
    // Sembunyikan elemen loading saat terjadi error
    hideLoading();
    showStatus("❌ Gagal memuat daftar film. Cek console.");
  }
}

// ---------------- PLAYER ----------------
async function openPlayer(title, filmUrl) {
  filmPopup.classList.add("show");
  filmPopupContent.innerHTML = `
        <h2>${escapeHtml(title)}</h2>
        <p style="text-align:center; color: rgba(255,255,255,0.7);">Klik tombol di bawah untuk mencari sumber video.</p>
        <div id="videoContainer" style="margin: 20px 0;"></div>
        <div class="popup-buttons">
            <button class="stream-btn" id="filmStreamBtn">🎬 Cari Stream</button>
            <button class="download-btn" id="filmDownloadBtn">⬇️ Download</button>
        </div>
    `;

  const streamBtn = document.getElementById("filmStreamBtn");
  const downloadBtn = document.getElementById("filmDownloadBtn");
  const videoContainer = document.getElementById("videoContainer");

  streamBtn.addEventListener("click", async () => {
    streamBtn.textContent = "⏳ Memuat...";
    streamBtn.disabled = true;
    videoContainer.innerHTML = "";

    try {
      const filmHtml = await fetchViaProxy(filmUrl);
      const directCandidates = collectStreamCandidatesFromHtml(
        filmHtml,
        filmUrl
      );
      const prefer = prioritizeCandidates(Array.from(directCandidates));

      if (prefer.length) {
        const chosen = resolveUrl(prefer[0], filmUrl);
        videoContainer.innerHTML = `<iframe src="${chosen}" width="100%" height="400" allowfullscreen></iframe>`;
        streamBtn.textContent = "✅ Tayang";
        return;
      }

      const streamUrl = extractPlayer4Link(filmHtml, filmUrl);
      if (!streamUrl) {
        videoContainer.innerHTML = `<p style="color: #f55; text-align: center;">⚠️ Tidak ditemukan sumber stream.</p>`;
        streamBtn.textContent = "🎬 Coba Lagi";
        streamBtn.disabled = false;
        return;
      }

      const iframe = await getIframeFromServer(streamUrl);
      if (iframe) {
        videoContainer.innerHTML = `<iframe src="${iframe}" width="100%" height="400" allowfullscreen></iframe>`;
        streamBtn.textContent = "✅ Tayang";
      } else {
        videoContainer.innerHTML = `<p style="color: #f55; text-align: center;">❌ Gagal menemukan iframe dari server player2.</p>`;
        streamBtn.textContent = "🎬 Coba Lagi";
        streamBtn.disabled = false;
      }
    } catch (err) {
      console.error("Gagal memuat stream:", err);
      videoContainer.innerHTML = `<p style="color: #f55; text-align: center;">❌ Gagal mengambil sumber stream.</p>`;
      streamBtn.textContent = "🎬 Coba Lagi";
      streamBtn.disabled = false;
    }
  });

  downloadBtn.addEventListener("click", () => {
    alert("🛠️ Fitur download akan ditambahkan nanti.");
  });
}

// ---------------- PLAYER TOOLS ----------------
function extractPlayer4Link(html, pageUrl) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  let found = null;
  doc.querySelectorAll("a[href]").forEach((a) => {
    const href = resolveUrl(a.getAttribute("href"), pageUrl);
    if (/\?player=2/i.test(href)) found = href;
  });
  console.log("🎬 Server player2:", found);
  return found;
}

async function getIframeFromServer(serverUrl) {
  try {
    const html = await fetchViaProxy(serverUrl);
    const doc = new DOMParser().parseFromString(html, "text/html");
    const iframe = doc.querySelector(
      ".gmr-embed-responsive iframe, iframe[src]"
    );
    if (iframe) {
      const src =
        iframe.getAttribute("src") ||
        iframe.getAttribute("data-src") ||
        iframe.getAttribute("data-href");
      return resolveUrl(src, serverUrl);
    }

    const candidates = collectStreamCandidatesFromHtml(html, serverUrl);
    const prioritized = prioritizeCandidates(Array.from(candidates));
    return prioritized.length ? resolveUrl(prioritized[0], serverUrl) : null;
  } catch (e) {
    console.error("❌ Gagal ambil iframe:", e);
  }
  return null;
}

// ---------------- STREAM CANDIDATE COLLECTOR ----------------
function collectStreamCandidatesFromHtml(html, baseUrl) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const results = new Set();
  doc.querySelectorAll("iframe").forEach((i) => {
    const s =
      i.getAttribute("src") ||
      i.getAttribute("data-src") ||
      i.getAttribute("data-href");
    if (s) results.add(resolveUrl(s, baseUrl));
  });
  doc
    .querySelectorAll(
      "[data-src],[data-href],[data-video],[data-srcset],[srcset],[src]"
    )
    .forEach((el) => {
      [
        "data-src",
        "data-href",
        "data-video",
        "data-srcset",
        "srcset",
        "src",
      ].forEach((attr) => {
        if (el.hasAttribute && el.hasAttribute(attr)) {
          let v = el.getAttribute(attr);
          if (!v) return;
          if (attr === "srcset" || attr === "data-srcset") {
            const parts = v.split(",").map((p) => p.trim());
            if (parts.length) v = parts[parts.length - 1].split(" ")[0];
          }
          if (typeof v === "string") {
            v.split(/\s+/).forEach((token) => {
              if (/https?:\/\//i.test(token) || token.startsWith("/"))
                results.add(resolveUrl(token, baseUrl));
            });
          }
        }
      });
    });
  doc.querySelectorAll("script").forEach((s) => {
    if (!s.textContent) return;
    const matches = s.textContent.match(/https?:\/\/[^\s'"]+/g) || [];
    matches.forEach((u) => {
      if (/player|stream|m3u8|mp4|cdn|bbai5|rpmlive|jwplayer|embed/i.test(u)) {
        results.add(u);
      }
    });
  });
  const bodyText = doc.documentElement.innerHTML || "";
  const bodyMatches = bodyText.match(/https?:\/\/[^\s'"]+/g) || [];
  bodyMatches.forEach((u) => {
    if (/player|stream|m3u8|mp4|cdn|bbai5|rpmlive|jwplayer|embed/i.test(u)) {
      results.add(u);
    }
  });
  return results;
}

function prioritizeCandidates(arr) {
  if (!Array.isArray(arr)) return [];
  const uniq = Array.from(new Set(arr));
  const score = (u) => {
    const low = String(u).toLowerCase();
    let s = 0;
    if (low.includes(".m3u8")) s += 50;
    if (low.includes(".mp4")) s += 40;
    if (
      low.includes("rpmlive") ||
      low.includes("bbai5") ||
      low.includes("cdn") ||
      low.includes("stream")
    )
      s += 30;
    if (
      low.includes("player") ||
      low.includes("embed") ||
      low.includes("jwplayer")
    )
      s += 20;
    if (low.includes("youtube") || low.includes("vimeo")) s -= 5;
    return s;
  };
  return uniq.sort((a, b) => score(b) - score(a));
}

// ---------------- UI HELPERS ----------------
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ---------------- MODAL CONTROL ----------------
closeFilmPopup.addEventListener("click", () => {
  filmPopup.classList.remove("show");
  filmPopupContent.innerHTML = "";
});

window.addEventListener("click", (e) => {
  if (e.target === filmPopup) {
    filmPopup.classList.remove("show");
    filmPopupContent.innerHTML = "";
  }
});

// ---------------- SEARCH FEATURE ----------------
const filmSearchBtn = document.getElementById("film-search-btn");
const filmSearchInput = document.getElementById("film-search-input");

if (filmSearchBtn) {
  filmSearchBtn.addEventListener("click", () => {
    const q = filmSearchInput?.value?.trim() || "";
    if (!q) {
      loadFilms(baseSite);
      return;
    }
    const searchUrl = `${baseSite}?s=${encodeURIComponent(
      q
    )}&post_type%5B%5D=post&post_type%5B%5D=tv`;
    loadFilms(searchUrl);
  });
}

if (filmSearchInput) {
  filmSearchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      const q = e.target.value.trim();
      if (!q) {
        loadFilms(baseSite);
        return;
      }
      const searchUrl = `${baseSite}?s=${encodeURIComponent(
        q
      )}&post_type%5B%5D=post&post_type%5B%5D=tv`;
      loadFilms(searchUrl);
    } else {
      applySearchFilter();
    }
  });
}

function applySearchFilter() {
  const q = filmSearchInput?.value?.toLowerCase() || "";
  const cards = filmList.querySelectorAll(".card");
  cards.forEach((card) => {
    const title = card.querySelector("h3")?.textContent?.toLowerCase() || "";
    card.style.display = title.includes(q) ? "" : "none";
  });
}

// Tambahkan fungsi observeCards jika belum ada
function observeCards() {
  // Implementasi observer untuk animasi card jika diperlukan
  console.log("Cards observed");
}
