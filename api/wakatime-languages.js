export default async function handler(req, res) {
    try {
        const apiKey = process.env.WAKATIME_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "WakaTime API key is not configured"
            });
        }

        const languageTotals = {};

        const today = new Date();

        // Last 7 days
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            const dateString = new Intl.DateTimeFormat("en-CA", {
                timeZone: "Asia/Kolkata"
            }).format(date);

            const response = await fetch(
                `https://api.wakatime.com/api/v1/users/current/durations?date=${dateString}&timezone=Asia/Kolkata&api_key=${encodeURIComponent(apiKey)}`
            );

            const data = await response.json();

            if (!response.ok) {
                return res.status(response.status).json({
                    error: "WakaTime rejected the request",
                    wakatime: data
                });
            }

            const durations = data.data || [];

            durations.forEach((duration) => {
                if (!duration.language) return;

                languageTotals[duration.language] =
                    (languageTotals[duration.language] || 0) +
                    (duration.duration || 0);
            });
        }

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