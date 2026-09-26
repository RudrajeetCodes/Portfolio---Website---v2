async function loadWakaTimeLanguages() {
    try {
        const response = await fetch("/api/wakatime-languages");

        if (!response.ok) {
            throw new Error("Failed to fetch WakaTime languages");
        }

        const data = await response.json();

        const defaultLanguages = [
            "JavaScript",
            "Python",
            "HTML",
            "CSS",
            "C++"
        ];

        const languageMap = {};

        // Add WakaTime data
        (data.languages || []).forEach((language) => {
            languageMap[language.name] = language.total_seconds;
        });

        // Make sure our default languages exist
        defaultLanguages.forEach((language) => {
            if (!(language in languageMap)) {
                languageMap[language] = 0;
            }
        });

        // Convert back to array and sort highest → lowest
        const languages = Object.entries(languageMap)
            .map(([name, total_seconds]) => ({
                name,
                total_seconds
            }))
            .sort(
                (a, b) =>
                    b.total_seconds - a.total_seconds
            );

        const container =
            document.querySelector(".coding-languages");

        if (!container) return;

        container
            .querySelectorAll(".language-row")
            .forEach(row => row.remove());

        if (languages.length === 0) return;

        const maxSeconds =
            languages[0].total_seconds || 1;

        languages.forEach((language) => {
            const totalSeconds = language.total_seconds;

            const hours =
                Math.floor(totalSeconds / 3600);

            const minutes =
                Math.floor((totalSeconds % 3600) / 60);

            let time;

            if (hours > 0) {
                time = `${hours}h ${minutes}m`;
            } else if (minutes > 0) {
                time = `${minutes}m`;
            } else {
                time = "<1m";
            }

            const percentage =
                totalSeconds > 0
                    ? (totalSeconds / maxSeconds) * 100
                    : 0;

            const row =
                document.createElement("div");

            row.className = "language-row";

            row.innerHTML = `
                <span>${language.name}</span>

                <div class="language-bar">
                    <div
                        class="language-fill"
                        style="width: ${percentage}%"
                    ></div>
                </div>

                <small>${time}</small>
            `;

            container.appendChild(row);
        });

    } catch (error) {
        console.error(
            "WakaTime languages error:",
            error
        );
    }
}