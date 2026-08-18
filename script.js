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
    });