// DOM Elements
const serverIpInput = document.getElementById('serverIp');
const checkButton = document.getElementById('checkButton');
const serverInfo = document.getElementById('serverInfo');
const serverName = document.getElementById('serverName');
const serverIcon = document.getElementById('serverIcon');
const status = document.getElementById('status');
const motd = document.getElementById('motd');
const players = document.getElementById('players');
const version = document.getElementById('version');
const ping = document.getElementById('ping');
const serverType = document.getElementById('serverType');
const playersList = document.getElementById('playersList');
const favoritesList = document.getElementById('favoritesList');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');

// State
let currentServer = null;
let autoRefreshInterval = null;
let isMusicPlaying = false;

// --- Multi-Ping Mode ---
const multiPingInput = document.getElementById('multiPingInput');
const multiPingCheck = document.getElementById('multiPingCheck');
const multiPingResult = document.getElementById('multiPingResult');
const multiPingFilter = document.getElementById('multiPingFilter');
const multiPingSort = document.getElementById('multiPingSort');
let multiPingData = [];
let multiPingShowOnlineOnly = false;
let multiPingSortPlayers = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
    setupEventListeners();
    initializeMusic();
    setupAnimations();
});

// Event Listeners
function setupEventListeners() {
    checkButton.addEventListener('click', checkServer);
    serverIpInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkServer();
    });
    musicToggle.addEventListener('click', toggleMusic);
}

// Music Control
function initializeMusic() {
    // Use the <audio> element for local music
    bgMusic.volume = 0.5;
    musicToggle.classList.add('ready');
}

function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        isMusicPlaying = true;
    } else {
        bgMusic.pause();
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        isMusicPlaying = false;
    }
}

// Animations
function setupAnimations() {
    // Animate status card on load
    anime({
        targets: '.status-card',
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutExpo'
    });

    // Animate status items on hover
    document.querySelectorAll('.status-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            anime({
                targets: item,
                scale: 1.05,
                duration: 300,
                easing: 'easeOutExpo'
            });
        });

        item.addEventListener('mouseleave', () => {
            anime({
                targets: item,
                scale: 1,
                duration: 300,
                easing: 'easeOutExpo'
            });
        });
    });
}

// Main Functions
async function checkServer() {
    const ip = serverIpInput.value.trim();
    if (!ip) return;

    try {
        // Show loading animation
        anime({
            targets: '.status-card',
            opacity: 0.5,
            duration: 300
        });

        const startTime = performance.now();
        const response = await fetch(`https://api.mcsrvstat.us/2/${ip}`);
        const data = await response.json();
        const endTime = performance.now();

        currentServer = ip;
        updateUI(data, endTime - startTime);
        startAutoRefresh();

        // Animate results
        anime({
            targets: '.status-card',
            opacity: 1,
            duration: 300
        });
    } catch (error) {
        console.error('Error checking server:', error);
        showError('Failed to check server status. Please try again.');
    }
}

function updateUI(data, pingTime) {
    // Update server name and icon
    serverName.textContent = currentServer;
    serverIcon.src = data.icon || 'https://api.mcstatus.io/v2/icon/' + currentServer;

    // Status badge with icon and color
    const statusEl = document.getElementById('status');
    statusEl.innerHTML = data.online
        ? '<i class="fas fa-check-circle"></i> Online'
        : '<i class="fas fa-times-circle"></i> Offline';
    statusEl.className = 'status-badge' + (data.online ? '' : ' offline');

    // MOTD with color codes
    const motdEl = document.getElementById('motd');
    if (data.motd && data.motd.html && data.motd.html.length) {
        motdEl.innerHTML = data.motd.html.join('<br>');
    } else if (data.motd && data.motd.raw && data.motd.raw.length) {
        motdEl.innerHTML = colorizeMotd(data.motd.raw.join(' '));
    } else {
        motdEl.innerHTML = '-';
    }

    // Players
    if (data.players) {
        const online = data.players.online || 0;
        const max = data.players.max || 0;
        players.textContent = `${online}/${max}`;
        // Player list
        playersList.innerHTML = '';
        if (data.players.list && data.players.list.length > 0) {
            data.players.list.forEach((player, index) => {
                const playerElement = document.createElement('div');
                playerElement.className = 'player-item';
                playerElement.textContent = player;
                playersList.appendChild(playerElement);
                anime({
                    targets: playerElement,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    delay: index * 50,
                    duration: 300,
                    easing: 'easeOutExpo'
                });
            });
        }
    } else {
        players.textContent = '0/0';
        playersList.innerHTML = '';
    }

    // Version
    version.textContent = data.version || 'Unknown';
    // Ping
    ping.textContent = `${Math.round(pingTime)}ms`;
    // Hide type field (removed)
    // Show server info
    serverInfo.style.display = 'block';
}

// Favorites Management
function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favoritesList.innerHTML = '';

    favorites.forEach(ip => {
        const favoriteElement = document.createElement('div');
        favoriteElement.className = 'favorite-item';
        favoriteElement.innerHTML = `
            <div>${ip}</div>
            <button onclick="removeFavorite('${ip}')">Remove</button>
        `;
        favoriteElement.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') {
                serverIpInput.value = ip;
                checkServer();
            }
        });

        // Animate favorite items
        anime({
            targets: favoriteElement,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 500,
            easing: 'easeOutExpo'
        });

        favoritesList.appendChild(favoriteElement);
    });
}

function addFavorite(ip) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.includes(ip)) {
        favorites.push(ip);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        loadFavorites();
    }
}

function removeFavorite(ip) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updatedFavorites = favorites.filter(fav => fav !== ip);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    loadFavorites();
}

// Auto-refresh functionality
function startAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }

    autoRefreshInterval = setInterval(() => {
        if (currentServer) {
            checkServer();
        }
    }, 10000); // Refresh every 10 seconds
}

// Error handling
function showError(message) {
    status.textContent = 'Error';
    status.className = 'status-offline';
    motd.textContent = message;
    players.textContent = '-';
    version.textContent = '-';
    ping.textContent = '-';
    serverType.textContent = '-';
    playersList.innerHTML = '';

    // Animate error state
    anime({
        targets: '.status-card',
        translateX: [-10, 10, -10, 10, 0],
        duration: 500,
        easing: 'easeInOutQuad'
    });
}

// Tab switching logic
const tabs = document.querySelectorAll('.zt-tab');
const tabContents = document.querySelectorAll('.zt-tab-content');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        tabContents.forEach(c => c.style.display = 'none');
        document.getElementById('zt-' + tab.dataset.tab).style.display = '';
    });
});

// Compare Mode logic
const compareBtn = document.getElementById('compareButton');
if (compareBtn) {
    compareBtn.addEventListener('click', async () => {
        const ip1 = document.getElementById('compareIp1').value.trim();
        const ip2 = document.getElementById('compareIp2').value.trim();
        if (!ip1 || !ip2) return;
        document.getElementById('compareResult').innerHTML = '<div style="text-align:center;padding:24px"><i class="fas fa-spinner fa-spin"></i> Đang so sánh...</div>';
        try {
            const [data1, data2] = await Promise.all([
                fetch(`https://api.mcsrvstat.us/2/${ip1}`).then(r => r.json()),
                fetch(`https://api.mcsrvstat.us/2/${ip2}`).then(r => r.json())
            ]);
            renderCompareResult(ip1, data1, ip2, data2);
        } catch (e) {
            document.getElementById('compareResult').innerHTML = '<div style="color:red;text-align:center">Lỗi khi so sánh server!</div>';
        }
    });
}

function renderCompareResult(ip1, s1, ip2, s2) {
    // Helper: get status, ping, motd, players, version, icon
    function getStatus(s) { return s.online ? 'Online' : 'Offline'; }
    function getPing(s) { return s.debug && s.debug.ping ? s.debug.ping : (s.ping || '-'); }
    function getMotd(s) {
        if (s.motd && s.motd.html && s.motd.html.length) return s.motd.html.join('<br>');
        if (s.motd && s.motd.raw && s.motd.raw.length) return colorizeMotd(s.motd.raw.join(' '));
        return '-';
    }
    function getPlayers(s) {
        if (s.players) return `${s.players.online} / ${s.players.max}`;
        return '-';
    }
    function getPlayersNum(s) { return s.players ? s.players.online : 0; }
    function getVersion(s) { return s.version || '-'; }
    function getIcon(s, ip) {
        if (s.icon) return `<img src="${s.icon}" class="compare-icon" alt="icon" />`;
        return `<img src="https://api.mcsrvstat.us/icon/${ip}" class="compare-icon" alt="icon" onerror="this.src='assets/images/icons/sample.png'" />`;
    }
    // Highlight: ping thấp hơn, player nhiều hơn
    const ping1 = Number(getPing(s1));
    const ping2 = Number(getPing(s2));
    const pnum1 = getPlayersNum(s1);
    const pnum2 = getPlayersNum(s2);
    const highlight1 = (ping1 && ping2 && ping1 < ping2) ? 'compare-highlight' : '';
    const highlight2 = (ping1 && ping2 && ping2 < ping1) ? 'compare-highlight' : '';
    const phigh1 = (pnum1 > pnum2) ? 'compare-highlight' : '';
    const phigh2 = (pnum2 > pnum1) ? 'compare-highlight' : '';
    // Status highlight
    const status1 = s1.online ? 'compare-highlight' : '';
    const status2 = s2.online ? 'compare-highlight' : '';
    // Table
    document.getElementById('compareResult').innerHTML = `
    <table class="compare-result-table">
      <tr>
        <th></th>
        <th>${getIcon(s1, ip1)}<br>${ip1}</th>
        <th>${getIcon(s2, ip2)}<br>${ip2}</th>
      </tr>
      <tr>
        <td>Trạng thái</td>
        <td class="${status1}">${getStatus(s1)}</td>
        <td class="${status2}">${getStatus(s2)}</td>
      </tr>
      <tr>
        <td>Ping</td>
        <td class="${highlight1}">${getPing(s1)}</td>
        <td class="${highlight2}">${getPing(s2)}</td>
      </tr>
      <tr>
        <td>MOTD</td>
        <td>${getMotd(s1)}</td>
        <td>${getMotd(s2)}</td>
      </tr>
      <tr>
        <td>Người chơi</td>
        <td class="${phigh1}">${getPlayers(s1)}</td>
        <td class="${phigh2}">${getPlayers(s2)}</td>
      </tr>
      <tr>
        <td>Phiên bản</td>
        <td>${getVersion(s1)}</td>
        <td>${getVersion(s2)}</td>
      </tr>
    </table>
    `;
}

// Update colorizeMotd to support §-codes to HTML span
function colorizeMotd(motd) {
    // Replace §x with span color
    const colorMap = {
        '0': '#000', '1': '#00a', '2': '#0a0', '3': '#0aa', '4': '#a00', '5': '#a0a', '6': '#fa0', '7': '#aaa',
        '8': '#555', '9': '#55f', 'a': '#5f5', 'b': '#5ff', 'c': '#f55', 'd': '#f5f', 'e': '#ff5', 'f': '#fff'
    };
    let open = 0;
    let html = motd.replace(/§([0-9a-f])/gi, (m, c) => {
        open++;
        return `<span style="color:${colorMap[c]||'#fff'}">`;
    }).replace(/§[klmnor]/gi, () => {
        if (open > 0) { open--; return '</span>'; }
        return '';
    });
    while (open-- > 0) html += '</span>';
    return html;
}

if (multiPingCheck) {
    multiPingCheck.addEventListener('click', doMultiPing);
}
if (multiPingFilter) {
    multiPingFilter.addEventListener('click', () => {
        multiPingShowOnlineOnly = !multiPingShowOnlineOnly;
        renderMultiPing();
    });
}
if (multiPingSort) {
    multiPingSort.addEventListener('click', () => {
        multiPingSortPlayers = !multiPingSortPlayers;
        renderMultiPing();
    });
}

async function doMultiPing() {
    let raw = multiPingInput.value;
    // Split by comma, newline, or space, filter empty
    let ips = raw.split(/[,\n\r\s]+/).map(ip => ip.trim()).filter(ip => ip);
    if (ips.length === 0) return;
    multiPingResult.innerHTML = '<div style="text-align:center;padding:24px"><i class="fas fa-spinner fa-spin"></i> Đang kiểm tra...</div>';
    try {
        const results = await Promise.all(ips.map(ip => fetch(`https://api.mcsrvstat.us/2/${ip}`).then(r => r.json()).then(data => ({ ip, data }))));
        multiPingData = results;
        renderMultiPing();
    } catch (e) {
        multiPingResult.innerHTML = '<div style="color:red;text-align:center">Lỗi khi kiểm tra server!</div>';
    }
}

function renderMultiPing() {
    let data = multiPingData.slice();
    if (multiPingShowOnlineOnly) data = data.filter(s => s.data.online);
    if (multiPingSortPlayers) data = data.sort((a, b) => (b.data.players?.online || 0) - (a.data.players?.online || 0));
    if (data.length === 0) {
        multiPingResult.innerHTML = '<div style="text-align:center;color:#aaa;padding:24px">Không có server nào để hiển thị.</div>';
        return;
    }
    multiPingResult.innerHTML = data.map(s => `
        <div class="multi-ping-card ${s.data.online ? 'online' : 'offline'}">
            <img src="${s.data.icon || `https://api.mcsrvstat.us/icon/${s.ip}`}" class="mp-icon" alt="icon" onerror="this.src='assets/images/icons/sample.png'" />
            <div class="mp-ip">${s.ip}</div>
            <div class="mp-status">${s.data.online ? 'Online' : 'Offline'}</div>
            <div class="mp-ping">Ping: ${s.data.debug?.ping || '-'}</div>
            <div class="mp-players">Players: ${s.data.players ? s.data.players.online + ' / ' + s.data.players.max : '-'}</div>
            <div class="mp-motd" title="${s.data.motd?.clean?.join(' ') || ''}">${s.data.motd?.html?.join(' ') || s.data.motd?.clean?.join(' ') || '-'}</div>
            <div class="mp-version">${s.data.version || ''}</div>
        </div>
    `).join('');
}

// --- Default Favourite Servers ---
const defaultFavs = [
    { ip: 'luckyvn.net', name: 'LuckyVN' },
    { ip: 'heromc.net', name: 'HeroMC' },
    { ip: 'grassminevn.com', name: 'GrassMineVN' },
    { ip: 'mineahihi.com', name: 'MineAhihi' },
    { ip: 'soulmc.net', name: 'SoulMC' },
    { ip: 'supermc.vn', name: 'SuperMC' },
    { ip: 'kingmc.net', name: 'KingMC' }
];
const defaultFavorites = document.getElementById('defaultFavorites');
if (defaultFavorites) {
    defaultFavorites.innerHTML = '';
    defaultFavs.forEach(sv => {
        const el = document.createElement('div');
        el.className = 'favorite-item';
        el.innerHTML = `
            <img src="https://api.mcsrvstat.us/icon/${sv.ip}" class="server-icon" alt="icon" onerror="this.src='assets/images/icons/sample.png'" />
            <div class="server-info">
                <h3>${sv.name}</h3>
                <div class="stat">${sv.ip}</div>
            </div>
        `;
        el.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') {
                // Switch to single server tab
                document.querySelectorAll('.zt-tab').forEach(t => t.classList.remove('active'));
                document.querySelector('.zt-tab[data-tab="single"]').classList.add('active');
                document.querySelectorAll('.zt-tab-content').forEach(c => c.style.display = 'none');
                document.getElementById('zt-single').style.display = '';
                serverIpInput.value = sv.ip;
                checkServer();
                // Scroll to status card
                setTimeout(() => {
                    document.getElementById('serverInfo').scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        });
        defaultFavorites.appendChild(el);
    });
}
