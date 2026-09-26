export default async function handler(req, res) {
    try {
        const apiKey = process.env.WAKATIME_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "WakaTime API key is not configured"
            });
        }

        const response = await fetch(
            `https://api.wakatime.com/api/v1/users/current/summaries?range=This%20Week&timezone=Asia/Kolkata&api_key=${encodeURIComponent(apiKey)}`
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: "WakaTime rejected the request",
                wakatime: data
            });
        }

        const languageTotals = {};

        const days = data.data || [];

        days.forEach((day) => {
            const languages = day.languages || [];

            languages.forEach((language) => {
                if (!language.name) return;

                languageTotals[language.name] =
                    (languageTotals[language.name] || 0) +
                    (language.total_seconds || 0);
            });
        });

        // Languages we always want visible
        const defaultLanguages = [
            "JavaScript",
            "Python",
            "HTML",
            "CSS",
            "C++"
        ];

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
            error: "Internal server error",
            message: error.message
        });
    }
}