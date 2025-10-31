// MANGA.JS - 修复响应式布局
// 📚 MANGA.JS - DIBUNGKUS DALAM IIFE UNTUK MENCEGAH KONFLIK VARIABEL GLOBAL
(function () {
  ("use strict");

  // 📚 API URL
  const baseMangaUrl = "https://www.sankavollerei.com/comic/bacakomik/";
  const mangaLatestUrl = baseMangaUrl + "latest";
  const mangaPopularUrl = baseMangaUrl + "populer";
  const mangaTopUrl = baseMangaUrl + "top";
  const mangaSearchUrl = baseMangaUrl + "search/";
  const mangaDetailUrl = baseMangaUrl + "detail/";
  const mangaChapterUrl = baseMangaUrl + "chapter/";
  const mangaGenresUrl = baseMangaUrl + "genres";
  const mangaRecomenUrl = baseMangaUrl + "recomen";
  const mangaColoredUrl = baseMangaUrl + "komikberwarna/";
  const mangaTypeUrl = baseMangaUrl + "only/";

  // 🌟 ELEMENT DOM
  // Menggunakan 'let' karena elemen ini akan dibuat secara dinamis
  let sectionTitleText;
  let mangaList;
  let mangaLoading;
  let mangaSearchInput;
  let mangaSearchBtn;
  let mangaPagination;
  let viewLatestBtn;
  let viewPopularBtn;
  let viewTopBtn;
  let viewRecomenBtn;
  let viewColoredBtn;
  let typeFilter;

  // 📊 STATE
  let currentMangaPage = 1;
  let currentMangaView = "latest"; // latest, popular, top, recomen, colored, search, type
  let currentMangaType = ""; // manga, manhwa, manhua
  let currentSearchQuery = "";
  let hasNextPage = false;
  let isInitialized = false; // Tambahkan flag untuk mencegah inisialisasi ganda

  // 🚀 INIT
  document.addEventListener("DOMContentLoaded", () => {
    // Cek apakah tab Manga aktif saat halaman dimuat
    const mangaTab = document.getElementById("mangaTab");
    if (mangaTab && mangaTab.classList.contains("active")) {
      initMangaTab();
    }

    // Tambahkan event listener untuk tab switching
    const mangaTabLink = document.querySelector('[data-tab="mangaTab"]');
    if (mangaTabLink) {
      mangaTabLink.addEventListener("click", () => {
        // Beri jeda sedikit agar DOM siap sebelum inisialisasi
        setTimeout(initMangaTab, 100);
      });
    }
  });

  function initMangaTab() {
    // Jika sudah diinisialisasi, hanya perlu memperbarui referensi elemen
    if (isInitialized) {
      updateElementReferences();
      return;
    }

    // Inisialisasi ulang elemen DOM setiap kali tab dibuka
    updateElementReferences();

    // Ganti "Coming Soon" dengan konten manga jika masih ada
    const comingSoonElement = document.querySelector("#mangaTab .coming-soon");
    if (comingSoonElement) {
      comingSoonElement.remove();
    }

    // Setelah elemen dibuat, inisialisasi ulang referensinya
    updateElementReferences();

    // Setup event listeners
    setupMangaEventListeners();

    // Load data
    loadManga(currentMangaPage);

    // Tandai sebagai sudah diinisialisasi
    isInitialized = true;
  }

  function updateElementReferences() {
    sectionTitleText = document.querySelector("#mangaTab #section-title-text");
    mangaList = document.getElementById("manga-list");
    mangaLoading = document.getElementById("manga-loading");
    mangaSearchInput = document.getElementById("manga-search-input");
    mangaSearchBtn = document.getElementById("manga-search-btn");
    mangaPagination = document.getElementById("manga-pagination");
    viewLatestBtn = document.getElementById("view-latest");
    viewPopularBtn = document.getElementById("view-popular");
    viewTopBtn = document.getElementById("view-top");
    viewRecomenBtn = document.getElementById("view-recomen");
    viewColoredBtn = document.getElementById("view-colored");
    typeFilter = document.getElementById("type-filter");
  }

  function setupMangaEventListeners() {
    // Hapus event listener yang ada untuk mencegah duplikasi
    if (mangaSearchBtn) {
      mangaSearchBtn.replaceWith(mangaSearchBtn.cloneNode(true));
      mangaSearchBtn = document.getElementById("manga-search-btn");
      mangaSearchBtn.addEventListener("click", () => {
        const query = mangaSearchInput.value.trim();
        searchManga(query);
      });
    }

    if (mangaSearchInput) {
      mangaSearchInput.replaceWith(mangaSearchInput.cloneNode(true));
      mangaSearchInput = document.getElementById("manga-search-input");
      mangaSearchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const query = mangaSearchInput.value.trim();
          searchManga(query);
        }
      });
    }

    if (viewLatestBtn) {
      viewLatestBtn.replaceWith(viewLatestBtn.cloneNode(true));
      viewLatestBtn = document.getElementById("view-latest");
      viewLatestBtn.addEventListener("click", () => {
        currentMangaView = "latest";
        updateActiveButton(viewLatestBtn);
        if (sectionTitleText) sectionTitleText.textContent = "Komik Terbaru";
        currentMangaPage = 1;
        loadManga(currentMangaPage);
      });
    }

    if (viewPopularBtn) {
      viewPopularBtn.replaceWith(viewPopularBtn.cloneNode(true));
      viewPopularBtn = document.getElementById("view-popular");
      viewPopularBtn.addEventListener("click", () => {
        currentMangaView = "popular";
        updateActiveButton(viewPopularBtn);
        if (sectionTitleText) sectionTitleText.textContent = "Komik Populer";
        currentMangaPage = 1;
        loadManga(currentMangaPage);
      });
    }

    if (viewTopBtn) {
      viewTopBtn.replaceWith(viewTopBtn.cloneNode(true));
      viewTopBtn = document.getElementById("view-top");
      viewTopBtn.addEventListener("click", () => {
        currentMangaView = "top";
        updateActiveButton(viewTopBtn);
        if (sectionTitleText) sectionTitleText.textContent = "Top Komik";
        currentMangaPage = 1;
        loadManga(currentMangaPage);
      });
    }

    if (viewRecomenBtn) {
      viewRecomenBtn.replaceWith(viewRecomenBtn.cloneNode(true));
      viewRecomenBtn = document.getElementById("view-recomen");
      viewRecomenBtn.addEventListener("click", () => {
        currentMangaView = "recomen";
        updateActiveButton(viewRecomenBtn);
        if (sectionTitleText)
          sectionTitleText.textContent = "Rekomendasi Komik";
        currentMangaPage = 1;
        loadManga(currentMangaPage);
      });
    }

    if (viewColoredBtn) {
      viewColoredBtn.replaceWith(viewColoredBtn.cloneNode(true));
      viewColoredBtn = document.getElementById("view-colored");
      viewColoredBtn.addEventListener("click", () => {
        currentMangaView = "colored";
        updateActiveButton(viewColoredBtn);
        if (sectionTitleText) sectionTitleText.textContent = "Komik Berwarna";
        currentMangaPage = 1;
        loadManga(currentMangaPage);
      });
    }

    if (typeFilter) {
      typeFilter.replaceWith(typeFilter.cloneNode(true));
      typeFilter = document.getElementById("type-filter");
      typeFilter.addEventListener("change", (e) => {
        currentMangaType = e.target.value;
        currentMangaView = "type";
        if (sectionTitleText)
          sectionTitleText.textContent = currentMangaType
            ? `Komik ${
                currentMangaType.charAt(0).toUpperCase() +
                currentMangaType.slice(1)
              }`
            : "Semua Komik";
        currentMangaPage = 1;
        loadManga(currentMangaPage);
      });
    }
  }

  function updateActiveButton(activeBtn) {
    // Remove active class from all buttons
    const allButtons = document.querySelectorAll(
      "#mangaTab .view-toggle .toggle-btn"
    );
    allButtons.forEach((btn) => btn.classList.remove("active"));

    // Add active class to the clicked button
    activeBtn.classList.add("active");
  }

  // 🌠 FETCH DATA
  async function loadManga(page = 1) {
    showMangaLoading();

    try {
      let apiUrl = "";

      switch (currentMangaView) {
        case "latest":
          apiUrl = mangaLatestUrl;
          break;
        case "popular":
          apiUrl = mangaPopularUrl;
          break;
        case "top":
          apiUrl = mangaTopUrl;
          break;
        case "recomen":
          apiUrl = mangaRecomenUrl;
          break;
        case "colored":
          apiUrl = mangaColoredUrl + page;
          break;
        case "type":
          if (currentMangaType) {
            apiUrl = mangaTypeUrl + currentMangaType;
          } else {
            apiUrl = mangaLatestUrl;
          }
          break;
        case "search":
          if (currentSearchQuery) {
            apiUrl = mangaSearchUrl + encodeURIComponent(currentSearchQuery);
          } else {
            apiUrl = mangaLatestUrl;
          }
          break;
        default:
          apiUrl = mangaLatestUrl;
      }

      if (
        currentMangaView !== "search" &&
        currentMangaView !== "type" &&
        currentMangaView !== "top" &&
        currentMangaView !== "recomen"
      ) {
        if (currentMangaView !== "latest" || page > 1) {
          apiUrl += page > 1 ? page : "";
        }
      }

      const res = await fetch(apiUrl);
      const data = await res.json();

      if (data.success !== true) throw new Error("Gagal memuat data");

      hasNextPage = data.hasNextPage || false;
      const mangaDataList = data.komikList || [];

      renderManga(mangaDataList);

      if (
        currentMangaView === "latest" ||
        currentMangaView === "popular" ||
        currentMangaView === "colored"
      ) {
        renderMangaPagination(page);
      } else {
        if (mangaPagination) mangaPagination.innerHTML = "";
      }

      // observeCards(); // Pastikan fungsi ini ada di script.js atau file lain
    } catch (err) {
      console.error(err);
      showMangaError("Gagal memuat data. Coba lagi nanti.");
    }
  }

  // 🔍 SEARCH FUNCTION
  async function searchManga(query) {
    if (!query) {
      currentMangaView = "latest";
      return loadManga(currentMangaPage);
    }

    currentSearchQuery = query;
    currentMangaView = "search";
    showMangaLoading();

    try {
      const res = await fetch(mangaSearchUrl + encodeURIComponent(query));
      const data = await res.json();

      if (data.success !== true) throw new Error("Gagal memuat data search");

      renderManga(data.komikList || []);

      if (mangaPagination) mangaPagination.innerHTML = "";
      // observeCards();
    } catch (err) {
      console.error(err);
      showMangaError("Manga tidak ditemukan.");
    }
  }

  // 🌌 RENDER DATA - 修复响应式布局
  function renderManga(mangas) {
    if (!mangaList) return;
    mangaList.innerHTML = "";

    if (!mangas || mangas.length === 0) {
      showMangaError("Manga tidak ditemukan.");
      return;
    }

    // 确保mangaList使用与animeList相同的网格布局
    mangaList.className = "content-grid";

    mangas.forEach((manga, index) => {
      const card = document.createElement("div");
      card.className = "card"; // 使用与Anime.js相同的card类
      card.style.animationDelay = `${index * 0.1}s`;

      let slug = manga.slug || "";
      card.setAttribute("data-slug", slug);

      let ratingHtml = "";
      if (manga.rating) {
        const rating = parseFloat(manga.rating);
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        ratingHtml = '<div class="rating">';
        for (let i = 0; i < 5; i++) {
          if (i < fullStars) {
            ratingHtml += '<i class="fas fa-star"></i>';
          } else if (i === fullStars && hasHalfStar) {
            ratingHtml += '<i class="fas fa-star-half-alt"></i>';
          } else {
            ratingHtml += '<i class="far fa-star"></i>';
          }
        }
        ratingHtml += `</div><span class="rating-value">${manga.rating}</span>`;
      }

      card.innerHTML = `
        <img src="${manga.cover}" alt="${manga.title}" loading="lazy" />
        <div class="card-content">
          <h3>${manga.title}</h3>
          ${manga.chapter ? `<p>Chapter: ${manga.chapter}</p>` : ""}
          ${manga.date ? `<p>${manga.date}</p>` : ""}
          ${manga.type ? `<p class="type-badge">${manga.type}</p>` : ""}
          ${ratingHtml}
        </div>
      `;

      card.addEventListener("click", () => {
        const slug = card.getAttribute("data-slug");
        openMangaDetail(slug);
      });

      mangaList.appendChild(card);
    });

    hideMangaLoading();
  }

  // 🔢 PAGINATION
  function renderMangaPagination(page) {
    if (!mangaPagination) return;
    mangaPagination.innerHTML = `
      <button id="prev-manga-page" ${
        page <= 1 ? "disabled" : ""
      }>⬅️ Prev</button>
      <span>Halaman ${page}</span>
      <button id="next-manga-page" ${
        !hasNextPage ? "disabled" : ""
      }>Next ➡️</button>
    `;

    document.getElementById("prev-manga-page").addEventListener("click", () => {
      if (page > 1) {
        currentMangaPage--;
        loadManga(currentMangaPage);
      }
    });

    document.getElementById("next-manga-page").addEventListener("click", () => {
      if (hasNextPage) {
        currentMangaPage++;
        loadManga(currentMangaPage);
      }
    });
  }

  // 🌠 POPUP DETAIL
  async function openMangaDetail(mangaId) {
    const popupOverlay = document.getElementById("mangaPopup");
    const popupContent = document.getElementById("mangaPopupContent");

    if (!popupOverlay || !popupContent) {
      createMangaPopup();
      return openMangaDetail(mangaId);
    }

    popupOverlay.classList.add("show");
    popupContent.innerHTML = `<p style="color:#fff;text-align:center;">🔄 Memuat detail manga...</p>`;

    try {
      const res = await fetch(mangaDetailUrl + mangaId);
      const data = await res.json();

      if (data.success !== true) throw new Error("Gagal memuat detail");

      const manga = data.detail;
      const synopsis = manga.synopsis || "Tidak ada deskripsi.";
      const genres =
        manga.genres?.map((g) => `<span>${g.title}</span>`).join("") || "";

      popupContent.innerHTML = `
        <div class="popup-anime">
          <img src="${manga.cover}" alt="${manga.title}" />
          <div class="popup-info">
            <h2>${manga.title}</h2>
            ${
              manga.otherTitle
                ? `<p><strong>Judul Lain:</strong> ${manga.otherTitle}</p>`
                : ""
            }
            <div class="genre-list">${genres}</div>
            <p><strong>Status:</strong> ${manga.status}</p>
            <p><strong>Tipe:</strong> ${manga.type}</p>
            <p><strong>Penulis:</strong> ${manga.author || "-"}</p>
            <p><strong>Artis:</strong> ${manga.artist || "-"}</p>
            <p><strong>Rilis:</strong> ${manga.release || "-"}</p>
            <p><strong>Series:</strong> ${manga.series || "-"}</p>
            <p><strong>Pembaca:</strong> ${manga.reader || "-"}</p>
            <p><strong>Rating:</strong> ${manga.rating || "-"}</p>
            <p>${synopsis}</p>
            <div class="popup-buttons">
              <button class="stream-btn" id="mangaReadBtn">📖 BACA</button>
            </div>
            <div id="mangaChapterContainer" class="episode-list"></div>
          </div>
        </div>
      `;

      document.getElementById("mangaReadBtn").addEventListener("click", () => {
        renderMangaChapterList(manga.chapters);
      });

      document
        .getElementById("closeMangaPopup")
        .addEventListener("click", () => {
          popupOverlay.classList.remove("show");
          popupContent.innerHTML = "";
        });
    } catch (err) {
      console.error(err);
      popupContent.innerHTML = `<p style="color:#f55;">Gagal memuat data manga!</p>`;
    }
  }

  // 🌌 RENDER CHAPTER LIST
  function renderMangaChapterList(chapters) {
    const container = document.getElementById("mangaChapterContainer");
    if (!container) return;

    if (!chapters || chapters.length === 0) {
      container.innerHTML = "<p>Tidak ada chapter tersedia.</p>";
      return;
    }

    container.innerHTML = `
      <h3>Pilih Chapter untuk Dibaca</h3>
      <div class="chapter-buttons">
        ${chapters
          .map((ch, index) => {
            let chapterTitle = ch.title;
            if (!chapterTitle && ch.slug) {
              const slugParts = ch.slug.split("/");
              const chapterPart = slugParts[slugParts.length - 1];
              const chapterNum = chapterPart.match(/chapter-(\d+)/i);
              if (chapterNum) {
                chapterTitle = `Chapter ${chapterNum[1]}`;
              }
            }
            return `<button class="chapter-btn" data-slug="${
              ch.slug
            }" data-title="${
              chapterTitle || `Chapter ${chapters.length - index}`
            }">${
              chapterTitle || `Chapter ${chapters.length - index}`
            }</button>`;
          })
          .join("")}
      </div>
    `;

    // Tambahkan event listener untuk setiap tombol chapter
    const chapterButtons = container.querySelectorAll(".chapter-btn");
    chapterButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const slug = this.getAttribute("data-slug");
        const title = this.getAttribute("data-title");
        readMangaChapter(slug, title);
      });
    });
  }

  // 🌌 RENDER MANGA READER
  function renderMangaReader(chapter, chapterTitle) {
    const container = document.getElementById("mangaChapterContainer");
    if (!container) return;

    if (!chapter.images || chapter.images.length === 0) {
      container.innerHTML = `<p>Tidak ada halaman tersedia.</p>`;
      return;
    }

    // Generate all images at once
    let imagesHtml = "";
    chapter.images.forEach((img, index) => {
      imagesHtml += `<img src="${img}" alt="Page ${
        index + 1
      }" class="manga-page-img" />`;
    });

    // Extract chapter numbers for navigation buttons
    let prevChapterText = "Prev";
    let nextChapterText = "Next";

    if (chapter.navigation.prev) {
      const prevSlug = chapter.navigation.prev;
      const prevChapterMatch = prevSlug.match(/chapter-(\d+)/i);
      if (prevChapterMatch) {
        prevChapterText = `Chapter ${prevChapterMatch[1]}`;
      }
    }

    if (chapter.navigation.next) {
      const nextSlug = chapter.navigation.next;
      const nextChapterMatch = nextSlug.match(/chapter-(\d+)/i);
      if (nextChapterMatch) {
        nextChapterText = `Chapter ${nextChapterMatch[1]}`;
      }
    }

    let html = `
    <div class="manga-reader-container">
      <div class="manga-reader-header">
        <h3>${chapterTitle}</h3>
        <div class="manga-reader-info">
          <span class="page-info">${chapter.images.length} Halaman</span>
        </div>
      </div>
      <div class="manga-reader-pages">
        ${imagesHtml}
      </div>
      <!-- 底部章节导航 -->
      <div class="manga-reader-bottom-navigation">
        <div class="manga-reader-controls bottom-nav-controls">
          <button id="prevChapterBtnBottom" class="reader-btn small-btn" ${
            !chapter.navigation.prev ? "disabled" : ""
          }>
            <i class="fas fa-chevron-left"></i> ${prevChapterText}
          </button>
          <button id="nextChapterBtnBottom" class="reader-btn small-btn" ${
            !chapter.navigation.next ? "disabled" : ""
          }>
            ${nextChapterText} <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  `;

    container.innerHTML = html;

    const prevChapterBtnBottom = document.getElementById(
      "prevChapterBtnBottom"
    );
    const nextChapterBtnBottom = document.getElementById(
      "nextChapterBtnBottom"
    );
    const pageImgs = container.querySelectorAll(".manga-page-img");

    // 设置全屏模式为默认模式
    pageImgs.forEach((img) => {
      img.style.width = "100%";
      img.style.height = "auto";
      img.style.maxWidth = "100%";
      img.style.display = "block";
    });

    // Chapter navigation for bottom buttons
    if (prevChapterBtnBottom && chapter.navigation.prev) {
      prevChapterBtnBottom.addEventListener("click", () => {
        // Extract slug from URL properly
        let prevSlug = chapter.navigation.prev;
        // Remove domain if present
        if (prevSlug.includes("bacakomik.my")) {
          prevSlug = prevSlug.split("bacakomik.my/").pop();
        }
        // Ensure we don't have leading slashes
        prevSlug = prevSlug.replace(/^\/+/, "");
        readMangaChapter(prevSlug, prevChapterText);
      });
    }

    if (nextChapterBtnBottom && chapter.navigation.next) {
      nextChapterBtnBottom.addEventListener("click", () => {
        // Extract slug from URL properly
        let nextSlug = chapter.navigation.next;
        // Remove domain if present
        if (nextSlug.includes("bacakomik.my")) {
          nextSlug = nextSlug.split("bacakomik.my/").pop();
        }
        // Ensure we don't have leading slashes
        nextSlug = nextSlug.replace(/^\/+/, "");
        readMangaChapter(nextSlug, nextChapterText);
      });
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (!container.offsetParent) return; // Check if popup is visible
      switch (e.key) {
        case "ArrowUp":
          const popupContent = document.getElementById("mangaPopupContent");
          if (popupContent) {
            popupContent.scrollBy({
              top: -100,
              behavior: "smooth",
            });
          }
          break;
        case "ArrowDown":
          if (popupContent) {
            popupContent.scrollBy({
              top: 100,
              behavior: "smooth",
            });
          }
          break;
        case "Home":
          e.preventDefault();
          // Scroll to top
          if (popupContent) {
            popupContent.scrollTop = 0;
            popupContent.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
          break;
        case "End":
          if (popupContent) {
            popupContent.scrollTo({
              top: popupContent.scrollHeight,
              behavior: "smooth",
            });
          }
          break;
      }
    });
  }

  // 🌌 READ MANGA CHAPTER
  async function readMangaChapter(chapterId, chapterTitle) {
    const container = document.getElementById("mangaChapterContainer");
    if (!container) return;

    container.innerHTML = `<p style="text-align:center;color:#fff;">🔄 Memuat chapter...</p>`;

    try {
      // Extract slug if chapterId is a full URL
      let slug = chapterId;
      if (chapterId.includes("http")) {
        // Extract just the path part after the domain
        const url = new URL(chapterId);
        slug = url.pathname;
        // Remove leading slash if present
        slug = slug.replace(/^\//, "");
      }

      const res = await fetch(mangaChapterUrl + slug);
      const data = await res.json();

      if (data.success !== true) throw new Error("Gagal memuat chapter");

      renderMangaReader(data, chapterTitle);

      // 滚动到顶部
      setTimeout(() => {
        console.log("Auto-scrolling to top after chapter load");

        // 尝试多种方法找到正确的滚动容器
        const popupOverlay = document.getElementById("mangaPopup");
        const popupContent = document.getElementById("mangaPopupContent");

        // 方法1: 尝试滚动弹窗内容
        if (popupContent) {
          console.log("Found popup content, scrolling to top");
          popupContent.scrollTop = 0;
          popupContent.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }

        // 方法2: 尝试滚动弹窗覆盖层
        if (popupOverlay) {
          console.log("Found popup overlay, scrolling to top");
          popupOverlay.scrollTop = 0;
          popupOverlay.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }

        // 方法3: 尝试滚动主窗口
        console.log("Scrolling main window to top");
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        // 方法4: 尝试滚动文档元素
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // 方法5: 使用jQuery（如果可用）
        if (typeof $ !== "undefined") {
          console.log("Using jQuery to scroll to top");
          $(popupContent || popupOverlay || window).animate(
            {
              scrollTop: 0,
            },
            300
          );
        }
      }, 100);
    } catch (err) {
      console.error(err);
      container.innerHTML = `<p style="color:#f55;text-align:center;">Gagal memuat chapter!</p>`;
    }
  }

  // 🌠 LOADING HANDLER
  function showMangaLoading() {
    if (mangaLoading) mangaLoading.style.display = "block";
    if (mangaList) mangaList.innerHTML = "";
  }

  function hideMangaLoading() {
    if (mangaLoading) mangaLoading.style.display = "none";
  }

  function showMangaError(message) {
    if (mangaLoading) {
      mangaLoading.textContent = message;
      mangaLoading.style.display = "block";
    }
    if (mangaList) mangaList.innerHTML = "";
  }

  // 🌠 CREATE POPUP
  function createMangaPopup() {
    const popup = document.createElement("div");
    popup.id = "mangaPopup";
    popup.className = "popup-overlay";

    popup.innerHTML = `
      <div class="popup-content">
        <button id="closeMangaPopup" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
        <div id="mangaPopupContent"></div>
      </div>
    `;

    document.body.appendChild(popup);
  }

  // Ekspos fungsi ke global scope
  window.readMangaChapter = readMangaChapter;
})();
