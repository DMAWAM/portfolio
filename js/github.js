document.addEventListener("DOMContentLoaded", () => {
    // ✅ anpassen falls dein GitHub-User anders heisst:
    const GH_USER = "dmawam";

    // Pagination
    const PER_PAGE = 6;
    let page = 1;

    // Cache (1h)
    const CACHE_KEY = `gh_insights_${GH_USER}`;
    const CACHE_TTL_MS = 60 * 60 * 1000;

    const $status = document.getElementById("ghStatus");
    const $list = document.getElementById("ghRepoList");
    const $more = document.getElementById("ghMore");
    const $refresh = document.getElementById("ghRefresh");
    const $meta = document.getElementById("ghChartMeta");

    let chart;

    function now() { return Date.now(); }

    function loadCache() {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (!data?.ts || !data?.payload) return null;
            if (now() - data.ts > CACHE_TTL_MS) return null;
            return data.payload;
        } catch {
            return null;
        }
    }

    function saveCache(payload) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: now(), payload }));
        } catch {
            // ignore (quota / privacy mode)
        }
    }

    function clearCache() {
        localStorage.removeItem(CACHE_KEY);
    }

    async function ghFetch(url) {
        const res = await fetch(url, {
            headers: {
                "Accept": "application/vnd.github+json"
            }
        });
        if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
        return res.json();
    }

    async function fetchRepos(pageNr) {
        // GitHub REST: "List repositories for a user" (Repos pro User laden) :contentReference[oaicite:2]{index=2}
        const url = `https://api.github.com/users/${GH_USER}/repos?per_page=${PER_PAGE}&page=${pageNr}&sort=updated`;
        return ghFetch(url);
    }

    async function fetchLanguages(fullName) {
        // GitHub REST: "List repository languages" (Bytes pro Sprache) :contentReference[oaicite:3]{index=3}
        const url = `https://api.github.com/repos/${fullName}/languages`;
        return ghFetch(url);
    }

    function formatDate(iso) {
        try { return new Date(iso).toLocaleDateString("de-CH"); } catch { return iso; }
    }

    function repoCard(repo) {
        const a = document.createElement("a");
        a.className = "repo-item";
        a.href = repo.html_url;
        a.target = "_blank";
        a.rel = "noreferrer";
        a.innerHTML = `
      <div class="repo-top">
        <div class="repo-name">${repo.name}</div>
        <div class="repo-meta">${repo.language ? repo.language : "—"} · ★ ${repo.stargazers_count}</div>
      </div>
      <div class="repo-desc">${repo.description ? repo.description : "Kein Beschreibungstext."}</div>
      <div class="repo-foot muted">Updated: ${formatDate(repo.updated_at)}</div>
    `;
        return a;
    }

    function renderRepos(repos, append = true) {
        if (!append) $list.innerHTML = "";
        repos.forEach(r => $list.appendChild(repoCard(r)));
    }

    function buildChart(languageTotals) {
        const entries = Object.entries(languageTotals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8); // Top 8 für lesbare Legende

        const labels = entries.map(e => e[0]);
        const values = entries.map(e => e[1]);

        const ctx = document.getElementById("ghChart");
        if (!ctx) return;

        if (chart) chart.destroy();
        chart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels,
                datasets: [{ data: values }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                        callbacks: {
                            label: (item) => {
                                const v = item.raw || 0;
                                const kb = Math.round(v / 1024);
                                return ` ${item.label}: ${kb.toLocaleString("de-CH")} KB`;
                            }
                        }
                    }
                }
            }
        });
    }

    async function computeLanguageTotals(repos) {
        const totals = {};
        // einfache Begrenzung, damit du nicht sofort rate-limits triffst:
        const sample = repos.slice(0, 10);

        for (const repo of sample) {
            const langs = await fetchLanguages(repo.full_name);
            for (const [lang, bytes] of Object.entries(langs)) {
                totals[lang] = (totals[lang] || 0) + bytes;
            }
        }
        return { totals, usedRepos: sample.length };
    }

    async function initInsights() {
        // Versuch Cache
        const cached = loadCache();
        if (cached) {
            $status.textContent = "Daten aus Cache geladen.";
            renderRepos(cached.firstRepos, false);
            buildChart(cached.languageTotals);
            $meta.textContent = `Quelle: Cache · Repos im Chart: ${cached.usedRepos}`;
            return;
        }

        $status.textContent = "Lade Repositories…";
        const firstRepos = await fetchRepos(1);

        renderRepos(firstRepos, false);
        $status.textContent = "Berechne Tech-Stack…";

        const { totals, usedRepos } = await computeLanguageTotals(firstRepos);

        buildChart(totals);
        $meta.textContent = `Quelle: GitHub API · Repos im Chart: ${usedRepos}`;

        saveCache({ firstRepos, languageTotals: totals, usedRepos });
        $status.textContent = "Fertig.";
    }

    async function loadMore() {
        page += 1;
        $more.disabled = true;
        try {
            const repos = await fetchRepos(page);
            if (!repos.length) {
                $status.textContent = "Keine weiteren Repos gefunden.";
                return;
            }
            renderRepos(repos, true);
            $status.textContent = `Seite ${page} geladen.`;
        } catch (e) {
            $status.textContent = "Fehler beim Nachladen.";
        } finally {
            $more.disabled = false;
        }
    }

    $more?.addEventListener("click", loadMore);
    $refresh?.addEventListener("click", () => {
        clearCache();
        $status.textContent = "Cache gelöscht. Bitte Seite neu laden.";
    });

    initInsights().catch(() => {
        $status.textContent = "GitHub-Daten konnten nicht geladen werden.";
    });
});
