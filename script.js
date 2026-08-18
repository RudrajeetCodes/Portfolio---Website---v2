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

fetch(`https://api.lanyard.rest/v1/users/${discordId}`)
    .then(response => response.json())
    .then(data => {
        const status = data.data.discord_status;

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
            tooltip.textContent = "Offline";
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