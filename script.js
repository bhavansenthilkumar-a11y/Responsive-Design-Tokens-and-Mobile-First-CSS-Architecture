
/* =========================================
   ELEVATE — DASHBOARD INTERACTIONS
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const reportButton = document.getElementById("reportButton");
    const chartPeriod = document.getElementById("chartPeriod");
    const chartTotal = document.getElementById("chartTotal");
    const bars = document.querySelectorAll(".bar");

    // 1. LIGHT / DARK THEME
    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;

        const isDark = theme === "dark";

        themeToggle.setAttribute("aria-pressed", String(isDark));
        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light theme" : "Switch to dark theme"
        );

        themeToggle.innerHTML = isDark
            ? "☀ <span>Theme</span>"
            : "◐ <span>Theme</span>";
    }

    let savedTheme = "light";

    try {
        savedTheme = localStorage.getItem("elevate-theme") || "light";
    } catch {
        savedTheme = "light";
    }

    applyTheme(savedTheme);

    themeToggle.addEventListener("click", () => {
        const currentTheme =
            document.documentElement.dataset.theme || "light";

        const nextTheme =
            currentTheme === "dark" ? "light" : "dark";

        applyTheme(nextTheme);

        try {
            localStorage.setItem("elevate-theme", nextTheme);
        } catch {
            // Theme still works if browser storage is unavailable.
        }
    });

    // 2. MOBILE SIDEBAR
    function setSidebarOpen(isOpen) {
        sidebar.classList.toggle("is-open", isOpen);

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );

        menuToggle.textContent = isOpen ? "✕" : "☰";
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = sidebar.classList.contains("is-open");
        setSidebarOpen(!isOpen);
    });

    // Close menu after selecting a navigation link.
    sidebar.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
            setSidebarOpen(false);
        });
    });

    // Close the mobile menu using Escape.
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setSidebarOpen(false);
        }
    });

    // Close the sidebar when returning to desktop width.
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) {
            setSidebarOpen(false);
        }
    });

    // 3. SIMPLE TOAST NOTIFICATION
    function showToast(message) {
        let toast = document.getElementById("dashboardToast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "dashboardToast";
            toast.className = "dashboard-toast";
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add("is-visible");

        clearTimeout(showToast.timeout);

        showToast.timeout = setTimeout(() => {
            toast.classList.remove("is-visible");
        }, 2800);
    }

    // 4. CREATE REPORT BUTTON
    reportButton.addEventListener("click", () => {
        showToast("Your report workspace is ready to explore!");
    });

    // 5. CHART PERIOD SELECTOR
    const chartData = {
        week: {
            total: "$24,560",
            heights: [42, 65, 50, 82, 60, 92, 72]
        },
        month: {
            total: "$98,420",
            heights: [35, 48, 62, 45, 76, 88, 95]
        },
        year: {
            total: "$684,250",
            heights: [30, 42, 55, 49, 70, 82, 96]
        }
    };

    chartPeriod.addEventListener("change", () => {
        const selectedPeriod = chartData[chartPeriod.value];

        if (!selectedPeriod) return;

        chartTotal.textContent = selectedPeriod.total;

        bars.forEach((bar, index) => {
            bar.style.setProperty(
                "--bar-height",
                `${selectedPeriod.heights[index]}%`
            );
        });

        showToast(
            `Chart updated: ${chartPeriod.options[
                chartPeriod.selectedIndex
            ].text}`
        );
    });

    // 6. INITIAL STATE
    setSidebarOpen(false);
});
