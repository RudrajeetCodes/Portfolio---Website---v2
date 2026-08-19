const roles = [
    "Game Development",
    "Front End Development",
    "Linux"
];

const roleText = document.getElementById("role-text");

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRole() {
    const currentRole = roles[roleIndex];

    if (!deleting) {
        roleText.textContent = currentRole.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
            deleting = true;
            setTimeout(typeRole, 1500);
            return;
        }
    } else {
        roleText.textContent = currentRole.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    setTimeout(typeRole, deleting ? 50 : 100);
}

typeRole();

const discordId = "321037704563523584";

let lastSeen = null;

function getLastSeenText() {
    if (!lastSeen) {
        return "Offline";
    }

    const elapsed = Date.now() - lastSeen.getTime();
    const minutes = Math.floor(elapsed / 60000);

    if (minutes < 1) {
        return "Offline • Last seen just now";
    }

    if (minutes === 1) {
        return "Offline • Last seen 1 minute ago";
    }

    if (minutes < 60) {
        return `Offline • Last seen ${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours === 1) {
        return "Offline • Last seen 1 hour ago";
    }

    return `Offline • Last seen ${hours} hours ago`;
}

setInterval(() => {
    const statusDot = document.getElementById("discord-status");
    const tooltip = document.getElementById("discord-tooltip");

    if (statusDot.className === "offline") {
        tooltip.textContent = getLastSeenText();
    }
}, 60000);

fetch(`https://api.lanyard.rest/v1/users/${discordId}`)
    .then(response => response.json())
    .then(data => {
        const status = data.data.discord_status;

        const statusDot = document.getElementById("discord-status");
        const tooltip = document.getElementById("discord-tooltip");

        statusDot.className = status;

        if (status === "online") {

            tooltip.textContent = "Online";

            localStorage.setItem(
                "discordLastSeen",
                Date.now()
            );

        } else if (status === "idle") {

            tooltip.textContent = "Idle";

            localStorage.setItem(
                "discordLastSeen",
                Date.now()
            );

        } else if (status === "dnd") {

            tooltip.textContent = "Do Not Disturb";

            localStorage.setItem(
                "discordLastSeen",
                Date.now()
            );

        } else {

            const lastSeen = localStorage.getItem("discordLastSeen");

            if (lastSeen) {
                const elapsed = Date.now() - Number(lastSeen);
                const minutes = Math.floor(elapsed / 60000);

                if (minutes < 1) {
                    tooltip.textContent = "Offline · Last seen just now";
                } else if (minutes === 1) {
                    tooltip.textContent = "Offline · Last seen 1 minute ago";
                } else if (minutes < 60) {
                    tooltip.textContent = `Offline · Last seen ${minutes} minutes ago`;
                } else {
                    const hours = Math.floor(minutes / 60);

                    if (hours === 1) {
                        tooltip.textContent = "Offline · Last seen 1 hour ago";
                    } else {
                        tooltip.textContent = `Offline · Last seen ${hours} hours ago`;
                    }
                }

            } else {
                tooltip.textContent = getLastSeenText();
            }
        }

        const spotify = data.data.spotify;

        const spotifyLabel = document.getElementById("spotify-label");
        const spotifyCover = document.getElementById("spotify-cover");
        const spotifySong = document.getElementById("spotify-song");
        const spotifyArtist = document.getElementById("spotify-artist");

        if (spotify) {

            spotifyLabel.textContent = "CURRENTLY LISTENING";

            spotifyCover.src = spotify.album_art_url;
            spotifySong.textContent = spotify.song;
            spotifyArtist.textContent = spotify.artist;

            const spotifyPlay = document.getElementById("spotify-play");
            spotifyPlay.href = `https://open.spotify.com/track/${spotify.track_id}`;

            // Remember the current song
            localStorage.setItem("lastSpotifySong", spotify.song);
            localStorage.setItem("lastSpotifyArtist", spotify.artist);
            localStorage.setItem("lastSpotifyCover", spotify.album_art_url);

        } else {

            spotifyLabel.textContent = "LAST PLAYED";

            const lastSong = localStorage.getItem("lastSpotifySong");
            const lastArtist = localStorage.getItem("lastSpotifyArtist");
            const lastCover = localStorage.getItem("lastSpotifyCover");


            const lastTrack = localStorage.getItem("lastSpotifyTrack");
            if (lastSong) {
                spotifyCover.src = lastCover;
                spotifySong.textContent = lastSong;
                spotifyArtist.textContent = lastArtist;
                document.getElementById("spotify-play").href =
                    `https://open.spotify.com/track/${lastTrack}`;
            }
        }



    });

const socket = new WebSocket("wss://api.lanyard.rest/socket");

socket.addEventListener("open", () => {
    console.log("Lanyard WebSocket connected");
});

socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);

    console.log("Lanyard event:", data);

    if (data.op === 1) {
        socket.send(JSON.stringify({
            op: 2,
            d: {
                subscribe_to_id: discordId
            }
        }));

        console.log("Subscribed to Discord presence");
    }
    if (data.t === "PRESENCE_UPDATE") {
        const status = data.d.discord_status;

        if (status !== "offline") {
            localStorage.setItem("discordLastSeen", Date.now());
        }

        const statusDot = document.getElementById("discord-status");
        const tooltip = document.getElementById("discord-tooltip");

        statusDot.className = status;

        if (status === "online") {
            tooltip.textContent = "Online";
        } else if (status === "idle") {
            tooltip.textContent = "Idle";
        } else if (status === "dnd") {
            tooltip.textContent = "Do Not Disturb";
        } else {
            tooltip.textContent = getLastSeenText();
        }

        console.log("Live status:", status);
    }
});

document.querySelectorAll(".experience-item").forEach((item) => {
    item.addEventListener("click", function () {

        const description = this.nextElementSibling;

        if (!description) {
            return;
        }

        description.classList.toggle("open");

    });
});

const projects = [
    {
        title: "AOT Inspired Game",
        type: "Game Development",
        description:
            "An Attack on Titan-inspired game built using Luau and Roblox Studio.",
        image: "assets/images/game.png",
        imageScale: 1,
        status: "In Development",
        tags: ["Luau", "Roblox Studio"],
        github: "",
        live: "https://www.roblox.com/games/16253563336/GEAR-TEST"
    },

    {
        title: "My First Portfolio",
        type: "Web Development",
        description:
            "My first portfolio website built using HTML, CSS, and JavaScript.",
        image: "assets/images/portfolio.png",
        imageScale: 1.8,
        status: "Live",
        tags: ["HTML", "CSS", "JavaScript"],
        github: "https://github.com/RudrajeetCodes/Portfolio",
        live: "https://portfolio-tawny-one-14.vercel.app/"
    }
];

const projectsGrid = document.getElementById("projects-grid");

projects.forEach((project) => {
    const card = document.createElement("article");

    card.className = "project-card";

    card.innerHTML = `
        <div class="project-image">
            <img
                src="${project.image}"
                alt="${project.title}"
                style="transform: scale(${project.imageScale});"
            >
        </div>

        <div class="project-info">

            <div class="project-title">
                <h3>${project.title}</h3>

                <span class="project-status ${project.status === "Live" ? "live" : "development"}">
                    <span></span>
                    ${project.status}
                </span>
            </div>

            <span class="project-type">
                ${project.type}
            </span>

            <p>
                ${project.description}
            </p>

            <div class="project-bottom">

                <div class="project-tags">
                    ${project.tags.map(tag => `<span>${tag}</span>`).join("")}
                </div>

                <div class="project-links">

                    ${project.live
            ? `<a href="${project.live}" target="_blank" rel="noopener noreferrer">↗</a>`
            : ""
        }

                    ${project.github
            ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer">◈</a>`
            : ""
        }

                </div>

            </div>

        </div>
    `;

    projectsGrid.appendChild(card);
});

const githubUsername = "RudrajeetCodes";

async function loadGithubContributions() {
    const graph = document.getElementById("github-graph");
    const total = document.getElementById("github-total");
    const months = document.getElementById("github-months");
    const lastYear = document.getElementById("github-last-year");

    try {
        const response = await fetch(
            `https://githubgraph.jigyansurout.com/api/ghcg/fetch-data?login=${githubUsername}`
        );

        if (!response.ok) {
            throw new Error("Failed to load GitHub data");
        }

        const data = await response.json();

        console.log("GitHub data:", data);

        const calendar =
            data.user.contributionsCollection.contributionCalendar;

        graph.innerHTML = "";
        months.innerHTML = "";

        // Total
        total.textContent =
            calendar.totalContributions.toLocaleString();

        lastYear.textContent =
            `${calendar.totalContributions.toLocaleString()} contributions in the last year`;

        // Month labels
        // Month labels
        let lastMonth = "";

        calendar.weeks.forEach((week, weekIndex) => {

            week.contributionDays.forEach((day) => {

                const date = new Date(day.date + "T00:00:00");

                const month = date.toLocaleString("en-US", {
                    month: "short"
                });

                // Add the first month
                if (weekIndex === 0 && lastMonth === "") {

                    const label = document.createElement("span");

                    label.className = "github-month";
                    label.textContent = month;

                    const weekWidth = 10;
                    const weekGap = 4;
                    const weekStep = weekWidth + weekGap;

                    label.style.left = `${weekIndex * weekStep}px`;

                    months.appendChild(label);

                    lastMonth = month;
                }

                // Add a label whenever a new month starts
                else if (date.getDate() === 1 && month !== lastMonth) {

                    const label = document.createElement("span");

                    label.className = "github-month";
                    label.textContent = month;

                    const weekWidth = 10;
                    const weekGap = 4;
                    const weekStep = weekWidth + weekGap;

                    label.style.left = `${weekIndex * weekStep}px`;

                    months.appendChild(label);

                    lastMonth = month;
                }
            });
        });

        // Contribution graph
        calendar.weeks.forEach((week) => {

            const weekColumn = document.createElement("div");

            weekColumn.className = "github-week";

            week.contributionDays.forEach((day) => {

                const cell = document.createElement("div");

                cell.className = "github-day";

                // GitHub contribution level
                const levelMap = {
                    "NONE": 0,
                    "FIRST_QUARTILE": 1,
                    "SECOND_QUARTILE": 2,
                    "THIRD_QUARTILE": 3,
                    "FOURTH_QUARTILE": 4
                };

                const level =
                    levelMap[day.contributionLevel] ?? 0;

                cell.classList.add(`level-${level}`);

                cell.title =
                    `${day.contributionCount} contributions on ${day.date}`;

                weekColumn.appendChild(cell);
            });

            graph.appendChild(weekColumn);
        });

    } catch (error) {

        console.error(
            "GitHub contribution error:",
            error
        );
    }
}

loadGithubContributions();

const githubRepo = "Portfolio";

async function loadGithubActivity() {
    const activityList =
        document.getElementById("github-activity-list");

    if (!activityList) return;

    activityList.innerHTML = "";

    try {
        const response = await fetch(
            `https://api.github.com/users/${githubUsername}/events/public?per_page=100`
        );

        if (!response.ok) {
            throw new Error("Failed to load GitHub activity");
        }

        const events = await response.json();

        const commits = [];

        events.forEach((event) => {
            if (event.type !== "PushEvent") return;

            const repoName = event.repo.name;

            event.payload.commits?.forEach((commit) => {
                commits.push({
                    message: commit.message,
                    sha: commit.sha,
                    repoName: repoName,
                    date: event.created_at
                });
            });
        });

        // Newest first
        commits.sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );

        // Latest 5 commits
        const latestCommits =
            commits.slice(0, 5);
        const commitsTab =
            document.querySelector(".github-tabs button:first-child span");

        if (commitsTab) {
            commitsTab.textContent = commits.length;
        }

        if (latestCommits.length === 0) {
            activityList.innerHTML = `
                <div class="github-activity-item">
                    <span class="github-activity-title">
                        No recent commits found
                    </span>
                </div>
            `;

            return;
        }

        latestCommits.forEach((commit) => {

            const item =
                document.createElement("div");

            item.className =
                "github-activity-item";

            const message =
                commit.message.split("\n")[0];

            const date =
                new Date(commit.date);

            const formattedDate =
                date.toLocaleDateString(
                    "en-US",
                    {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    }
                );

            item.innerHTML = `
                <span class="github-activity-icon">⌘</span>

                <span class="github-activity-title">
                    ${message}
                </span>

                <span class="github-activity-repo">
                    ${commit.repoName}
                </span>

                <span class="github-activity-date">
                    ${formattedDate}
                </span>
            `;

            activityList.appendChild(item);
        });

    } catch (error) {

        console.error(
            "GitHub activity error:",
            error
        );

        activityList.innerHTML = `
            <div class="github-activity-item">
                <span class="github-activity-title">
                    Unable to load GitHub activity
                </span>
            </div>
        `;
    }
}

loadGithubActivity();

const githubTabs = document.querySelectorAll(".github-tabs button");

githubTabs.forEach((button, index) => {

    button.addEventListener("click", () => {

        githubTabs.forEach(tab => {
            tab.classList.remove("active");
        });

        button.classList.add("active");

        const types = ["commits", "merged", "open", "closed"];

        if (types[index] === "commits") {
            loadGithubActivity();
        }

        if (types[index] === "merged") {
            loadGithubPullRequests("merged");
        }

        if (types[index] === "open") {
            loadGithubPullRequests("open");
        }

        if (types[index] === "closed") {
            loadGithubPullRequests("closed");
        }

        console.log("Selected GitHub tab:", types[index]);
    });

});

async function loadGithubPullRequests(type) {

    const activityList =
        document.getElementById("github-activity-list");

    activityList.innerHTML = "";

    let query = `author:${githubUsername} is:pr`;

    if (type === "merged") {
        query += " is:merged";
    } else if (type === "open") {
        query += " is:open";
    } else if (type === "closed") {
        query += " is:closed";
    }

    try {

        const response = await fetch(
            `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=5`
        );

        if (!response.ok) {
            throw new Error("Failed to load pull requests");
        }

        const data = await response.json();

        const tabIndex =
            type === "merged" ? 2 :
                type === "open" ? 3 : 4;

        const tabCount =
            document.querySelector(
                `.github-tabs button:nth-child(${tabIndex}) span`
            );

        if (tabCount) {
            tabCount.textContent = data.total_count;
        }

        data.items.forEach((pr) => {

            const item =
                document.createElement("div");

            item.className =
                "github-activity-item";

            const date =
                new Date(pr.updated_at);

            const formattedDate =
                date.toLocaleDateString(
                    "en-US",
                    {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    }
                );

            const repo =
                pr.repository_url.replace(
                    "https://api.github.com/repos/",
                    ""
                );

            item.innerHTML = `
                <span class="github-activity-icon">⌘</span>

                <span class="github-activity-title">
                    ${pr.title}
                </span>

                <span class="github-activity-repo">
                    ${repo}
                </span>

                <span class="github-activity-date">
                    ${formattedDate}
                </span>
            `;

            activityList.appendChild(item);
        });

        if (data.items.length === 0) {
            activityList.innerHTML = `
                <div class="github-activity-item">
                    <span class="github-activity-title">
                        No ${type} pull requests
                    </span>
                </div>
            `;
        }

    } catch (error) {

        console.error(
            "GitHub pull request error:",
            error
        );
    }
}

