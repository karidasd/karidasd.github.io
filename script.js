// Typing Effect for Hero Section
const typedTextSpan = document.getElementById("typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = [
    "Algorithmic Trading & Quant Dev.",
    "AI Agent Architect.",
    "Data Scientist & Researcher.",
    "PhD Candidate & Instructor.",
    "Machine Learning Engineer."
];
const typingDelay = 90;
const erasingDelay = 45;
const newTextDelay = 1800;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } 
    else {
        cursorSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } 
    else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if(textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    if(textArray.length) setTimeout(type, newTextDelay + 250);
    runTerminalAnimation();
    loadGitHubStats();
});

// Smooth Scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Terminal Animation Logic
async function runTerminalAnimation() {
    const term = document.getElementById("terminal-body");
    if (!term) return;

    const lines = [
        { text: "python run_orchestrator.py", delay: 900, type: true, prompt: true },
        { text: "[INFO] Initializing DarkAIs Quant & AI Systems...", delay: 700, type: false, colorClass: "t-blue" },
        { text: "[INFO] Connecting to Solana RPC & Broker WebSockets...", delay: 600, type: false, colorClass: "t-blue" },
        { text: "[AGENTS] Spawning Algo Academy, Solana Sniper, Agentic-BI...", delay: 800, type: false, colorClass: "t-yellow" },
        { text: "[ACADEMY] 12 Interactive Modules & Botakis online...", delay: 350, type: false },
        { text: "[SNIPER] Jito MEV Bundles & Anti-Rug engine primed...", delay: 350, type: false },
        { text: "[SUCCESS] All systems operational. Ready.", delay: 500, type: false, colorClass: "t-green" }
    ];

    term.innerHTML = "";

    for (let line of lines) {
        if (line.prompt) {
            term.innerHTML += `<span class="t-green">visitor@darkais:~$</span> `;
        }
        
        if (line.type) {
            const span = document.createElement("span");
            term.appendChild(span);
            for (let i = 0; i < line.text.length; i++) {
                span.textContent += line.text.charAt(i);
                await new Promise(r => setTimeout(r, 50));
            }
            term.innerHTML += "<br>";
        } else {
            const colorClass = line.colorClass ? ` class="${line.colorClass}"` : "";
            term.innerHTML += `<span${colorClass}>${line.text}</span><br>`;
        }
        await new Promise(r => setTimeout(r, line.delay));
    }
    
    term.innerHTML += `<span class="t-green">visitor@darkais:~$</span> <span class="blink-cursor">_</span>`;
}

// Live GitHub Dashboard Logic
async function loadGitHubStats() {
    const reposEl = document.getElementById("github-repos");
    const followersEl = document.getElementById("github-followers");
    const starsEl = document.getElementById("github-stars");
    const feedEl = document.getElementById("activity-feed");

    const fallbackStats = { repos: "46", followers: "20", stars: "38" };
    const fallbackActivity = [
        { repo: "algo-trading-academy", desc: "Deploy Grand Finale: Solana Sniper, Journal & Confluence", time: "Just now" },
        { repo: "solana-sniper-bot", desc: "Release update: Jito MEV and Anti-Rug filter optimization", time: "1h ago" },
        { repo: "prompt-to-loop-engineering", desc: "Push to main: 7-level agentic self-correction loop", time: "1d ago" }
    ];

    try {
        const userRes = await fetch("https://api.github.com/users/karidasd");
        if (!userRes.ok) throw new Error();
        const userData = await userRes.json();
        
        const reposRes = await fetch("https://api.github.com/users/karidasd/repos?per_page=100");
        let totalStars = 0;
        if (reposRes.ok) {
            const reposData = await reposRes.json();
            totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        }

        const eventsRes = await fetch("https://api.github.com/users/karidasd/events/public");
        let activityHtml = "";
        
        if (eventsRes.ok) {
            const events = await eventsRes.json();
            const pushEvents = events.filter(e => e.type === "PushEvent").slice(0, 3);
            
            if (pushEvents.length > 0) {
                pushEvents.forEach(event => {
                    const repoName = event.repo.name.replace("karidasd/", "");
                    const commitMsg = event.payload.commits[0] ? event.payload.commits[0].message : "Code update";
                    const timeString = formatGitHubTime(event.created_at);
                    activityHtml += `
                        <div class="activity-item">
                            <span class="repo-tag">${repoName}</span>
                            <strong>Commit:</strong> ${commitMsg}
                            <span class="time-tag">${timeString}</span>
                        </div>
                    `;
                });
            }
        }

        reposEl.textContent = userData.public_repos || fallbackStats.repos;
        followersEl.textContent = userData.followers || fallbackStats.followers;
        starsEl.textContent = totalStars || fallbackStats.stars;

        if (activityHtml) {
            feedEl.innerHTML = activityHtml;
        } else {
            renderFallbackActivity();
        }

    } catch (e) {
        reposEl.textContent = fallbackStats.repos;
        followersEl.textContent = fallbackStats.followers;
        starsEl.textContent = fallbackStats.stars;
        renderFallbackActivity();
    }

    function renderFallbackActivity() {
        feedEl.innerHTML = fallbackActivity.map(act => `
            <div class="activity-item">
                <span class="repo-tag">${act.repo}</span>
                ${act.desc}
                <span class="time-tag">${act.time}</span>
            </div>
        `).join("");
    }
}

function formatGitHubTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
