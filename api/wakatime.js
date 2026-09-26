export default async function handler(req, res) {
    try {
        const apiKey = process.env.WAKATIME_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "WakaTime API key is not configured"
            });
        }

        // Current date in India
        const now = new Date(
            new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kolkata"
            })
        );

        // Find Monday of the current week
        const day = now.getDay();
        const diff = day === 0 ? -6 : 1 - day;

        const monday = new Date(now);
        monday.setDate(now.getDate() + diff);

        // Build Monday -> today
        const dates = [];

        for (
            let date = new Date(monday);
            date <= now;
            date.setDate(date.getDate() + 1)
        ) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            dates.push(`${year}-${month}-${day}`);
        }

        const results = await Promise.all(
            dates.map(async (date) => {
                const response = await fetch(
                    `https://api.wakatime.com/api/v1/users/current/durations?date=${date}&timezone=Asia/Kolkata&api_key=${encodeURIComponent(apiKey)}`
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch WakaTime data for ${date}`
                    );
                }

                return response.json();
            })
        );

        const languageTotals = {};

        results.forEach((result) => {
            const durations = result.data || [];

            durations.forEach((duration) => {
                const language = duration.language;

                if (!language) return;

                languageTotals[language] =
                    (languageTotals[language] || 0) +
                    (duration.duration || 0);
            });
        });

        // Languages we always want visible
        const defaultLanguages = [
            "JavaScript",
            "Python",
            "HTML",
            "CSS",
            "C++",
            "Other"
        ];

        // Add missing default languages as 0
        defaultLanguages.forEach((language) => {
            if (!(language in languageTotals)) {
                languageTotals[language] = 0;
            }
        });

        const languages = Object.entries(languageTotals)
            .map(([name, total_seconds]) => ({
                name,
                total_seconds
            }))
            .sort(
                (a, b) =>
                    b.total_seconds - a.total_seconds
            );

        return res.status(200).json({
            languages
        });

    } catch (error) {
        console.error(
            "WakaTime languages error:",
            error
        );

        return res.status(500).json({
            error: "Internal server error"
        });
    }
}