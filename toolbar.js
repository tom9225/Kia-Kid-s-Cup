document.addEventListener("DOMContentLoaded", function() {
    const styleHTML = `
    <style>
        /* =========================================================
           Kia / FIFA Official Partner Logo
           桌機版：左上角，toolbar 外面
           手機版：導覽頁上方，與叉叉同高度
        ========================================================= */

        .site-logo-desktop {
            position: fixed;
            top: 24px;
            left: 28px;
            z-index: 2002;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            /*
               電腦版 Logo 高度會用 JS 同步 toolbar 高度
               這裡先給一個預設高度，避免 JS 還沒執行時過大
            */
            height: 50px;
            width: auto;

            pointer-events: auto;
            opacity: 1;
            transform: translateY(0);
            transition:
                height 0.25s ease,
                top 0.25s ease,
                left 0.25s ease;
        }

        .site-logo-desktop img {
            display: block;
            height: 100%;
            width: auto;
            max-width: 250px;
            object-fit: contain;
            user-select: none;
            -webkit-user-drag: none;
            filter: drop-shadow(0 8px 22px rgba(0, 0, 0, 0.55));
        }

        /* =========================================================
           手機版漢堡按鈕 / 叉叉
        ========================================================= */

        .menu-toggle {
            display: none;
            position: fixed;
            top: 25px;
            right: 25px;
            width: 50px;
            height: 50px;
            background: rgba(10, 15, 20, 0.75);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 50%;
            cursor: pointer;
            z-index: 2003;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 6px;
            transition: all 0.3s ease;
        }

        .menu-toggle:hover {
            border-color: rgba(193, 247, 34, 0.45);
            box-shadow: 0 0 18px rgba(193, 247, 34, 0.12);
        }

        .menu-toggle span {
            display: block;
            width: 22px;
            height: 2px;
            background-color: #ffffff;
            transition: all 0.3s ease;
        }
        
        .menu-toggle.open span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }

        .menu-toggle.open span:nth-child(2) {
            opacity: 0;
        }

        .menu-toggle.open span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }

        /* =========================================================
           手機側邊滑出選單
        ========================================================= */

        .mobile-nav {
            position: fixed;
            top: 0;
            right: -100%;
            width: min(82vw, 390px);
            height: 100vh;
            background: rgba(5, 5, 5, 0.88);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border-left: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 2001;
            display: flex;
            flex-direction: column;

            /*
               手機版重點：
               padding-top 跟叉叉 top: 25px 對齊
            */
            padding: 25px 34px 40px;

            gap: 18px;
            transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: -26px 0 70px rgba(0, 0, 0, 0.55);
            overflow-y: auto;
        }

        .mobile-nav.open {
            right: 0;
        }

        .mobile-nav-logo {
            width: calc(100% - 72px);
            min-height: 50px;
            height: 50px;
            margin: 0 0 30px;
            padding: 0 0 22px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-shrink: 0;
        }

        .mobile-nav-logo img {
            height: 34px;
            width: auto;
            max-width: 100%;
            display: block;
            object-fit: contain;
            user-select: none;
            -webkit-user-drag: none;
            filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.5));
        }

        .mobile-nav a {
            color: #ffffff !important;
            text-decoration: none;
            font-size: 1.12rem;
            font-weight: 600;
            letter-spacing: 2px;
            transition: color 0.3s, transform 0.3s, border-color 0.3s;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .mobile-nav a.active,
        .mobile-nav a:hover {
            color: var(--kia-green) !important;
            transform: translateX(4px);
            border-bottom-color: rgba(193, 247, 34, 0.28);
        }

        .mobile-nav-logo:hover {
            transform: none !important;
            border-bottom-color: rgba(255,255,255,0.08) !important;
        }

        /* =========================================================
           遮罩底層
        ========================================================= */

        .menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.4);
            z-index: 2000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.4s ease;
        }

        .menu-overlay.open {
            opacity: 1;
            pointer-events: auto;
        }

        body.mobile-menu-open {
            overflow: hidden;
        }

        /* =========================================================
           桌機版
        ========================================================= */

        @media (min-width: 769px) {
            .toolbar-container {
                z-index: 2001;
            }

            .site-logo-desktop {
                top: 24px;
                left: 28px;
            }

            .site-logo-desktop img {
                max-width: 250px;
            }
        }

        @media (min-width: 1201px) {
            .site-logo-desktop {
                left: 32px;
            }

            .site-logo-desktop img {
                max-width: 260px;
            }
        }

        @media (min-width: 1025px) and (max-width: 1200px) {
            .site-logo-desktop {
                left: 24px;
            }

            .site-logo-desktop img {
                max-width: 220px;
            }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
            .site-logo-desktop {
                left: 20px;
            }

            .site-logo-desktop img {
                max-width: 180px;
            }
        }

        /* =========================================================
           手機版
        ========================================================= */

        @media (max-width: 768px) {
            .toolbar-container {
                display: none;
            }

            .site-logo-desktop {
                display: none;
            }

            .menu-toggle {
                display: flex;
            }

            .mobile-nav {
                padding-top: 25px;
            }
        }

        @media (max-width: 420px) {
            .mobile-nav {
                width: 86vw;
                padding-left: 28px;
                padding-right: 28px;
            }

            .mobile-nav-logo {
                width: calc(100% - 68px);
                height: 50px;
                min-height: 50px;
                margin-bottom: 28px;
            }

            .mobile-nav-logo img {
                height: 30px;
            }

            .mobile-nav a {
                font-size: 1.04rem;
            }
        }

        @media (max-width: 360px) {
            .mobile-nav {
                padding-left: 24px;
                padding-right: 24px;
            }

            .mobile-nav-logo {
                width: calc(100% - 64px);
            }

            .mobile-nav-logo img {
                height: 28px;
            }
        }
    </style>
    `;

    const toolbarHTML = `
        <!-- 桌機版 Logo：toolbar 外面，固定在網頁左上角 -->
        <a href="index.html" class="site-logo-desktop" id="siteLogoDesktop" aria-label="Kia Official Partner Logo">
            <img src="white_logo.png" alt="Kia FIFA Official Partner">
        </a>

        <div class="toolbar-container" id="toolbarContainer">
            <div class="toolbar">
                <a href="index.html" class="nav-index">首頁</a>
                <a href="https://www.kia.com/tw/main.html" target="_blank">主辦單位</a>
                <a href="announcements.html" class="nav-announce">大會公告</a>
                <a href="live-scores.html" class="nav-scores">即時比分</a>
                <a href="quest.html" class="nav-quest">闖關卡及關卡說明</a>
                <a href="partners.html" class="nav-partners">相關單位</a>
            </div>
        </div>

        <div class="menu-toggle" id="menuToggle" aria-label="開啟導覽選單" role="button" tabindex="0">
            <span></span>
            <span></span>
            <span></span>
        </div>

        <div class="mobile-nav" id="mobileNav">
            <!-- 手機版 Logo：與右上角叉叉平行 -->
            <a href="index.html" class="mobile-nav-logo" aria-label="Kia Official Partner Logo">
                <img src="white_logo.png" alt="Kia FIFA Official Partner">
            </a>

            <a href="index.html" class="nav-index">首頁</a>
            <a href="https://www.kia.com/tw/main.html" target="_blank">主辦單位</a>
            <a href="announcements.html" class="nav-announce">大會公告</a>
            <a href="live-scores.html" class="nav-scores">即時比分</a>
            <a href="quest.html" class="nav-quest">闖關卡及關卡說明</a>
            <a href="partners.html" class="nav-partners">相關單位</a>
        </div>

        <div class="menu-overlay" id="menuOverlay"></div>
    `;
    
    document.head.insertAdjacentHTML("beforeend", styleHTML);
    document.body.insertAdjacentHTML("afterbegin", toolbarHTML);

    // =========================================================
    // 自動判斷當前網頁，加入 active
    // =========================================================
    const currentPage = window.location.pathname.split("/").pop();
    let activeClass = "nav-index";
    
    if (currentPage === "index.html" || currentPage === "") {
        activeClass = "nav-index";
    } else if (currentPage === "live-scores.html") {
        activeClass = "nav-scores";
    } else if (currentPage === "partners.html") {
        activeClass = "nav-partners";
    } else if (currentPage === "brand-story.html") {
        activeClass = "nav-brand";
    } else if (currentPage === "quest.html") {
        activeClass = "nav-quest";
    } else if (currentPage === "announcements.html") {
        activeClass = "nav-announce";
    }

    document.querySelectorAll(`.${activeClass}`).forEach(el => {
        el.classList.add("active");
    });

    // =========================================================
    // 手機版開關邏輯
    // =========================================================
    const menuToggle = document.getElementById("menuToggle");
    const mobileNav = document.getElementById("mobileNav");
    const menuOverlay = document.getElementById("menuOverlay");

    function openMenu() {
        menuToggle.classList.add("open");
        mobileNav.classList.add("open");
        menuOverlay.classList.add("open");
        document.body.classList.add("mobile-menu-open");
        menuToggle.setAttribute("aria-label", "關閉導覽選單");
    }

    function closeMenu() {
        menuToggle.classList.remove("open");
        mobileNav.classList.remove("open");
        menuOverlay.classList.remove("open");
        document.body.classList.remove("mobile-menu-open");
        menuToggle.setAttribute("aria-label", "開啟導覽選單");
    }

    function toggleMenu() {
        if (mobileNav.classList.contains("open")) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    menuToggle.addEventListener("click", toggleMenu);
    menuOverlay.addEventListener("click", closeMenu);

    menuToggle.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleMenu();
        }
    });

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    mobileNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function() {
            closeMenu();
        });
    });

    // =========================================================
    // 電腦版 Logo 高度同步 toolbar
    // 已移除：重疊時自動隱藏 Logo 的功能
    // =========================================================
    const desktopLogo = document.getElementById("siteLogoDesktop");
    const toolbarContainer = document.getElementById("toolbarContainer");

    function syncDesktopLogoWithToolbar() {
        if (!desktopLogo || !toolbarContainer) return;

        const isMobile = window.innerWidth <= 768;

        if (isMobile) return;

        const toolbarRect = toolbarContainer.getBoundingClientRect();

        /*
           Logo 高度跟 toolbar 一樣高
           加上上下限，避免 toolbar 高度異常時 Logo 過大或過小
        */
        const toolbarHeight = Math.max(38, Math.min(toolbarRect.height, 58));
        desktopLogo.style.height = toolbarHeight + "px";

        /*
           垂直位置也跟 toolbar 對齊
        */
        desktopLogo.style.top = toolbarRect.top + "px";
    }

    syncDesktopLogoWithToolbar();

    window.addEventListener("resize", syncDesktopLogoWithToolbar);
    window.addEventListener("orientationchange", syncDesktopLogoWithToolbar);
    window.addEventListener("load", syncDesktopLogoWithToolbar);

    if (window.ResizeObserver) {
        const observer = new ResizeObserver(syncDesktopLogoWithToolbar);
        observer.observe(toolbarContainer);
        observer.observe(desktopLogo);
    }
});