export default async function handler(req, res) {
    try {
        const apiKey = process.env.WAKATIME_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "WakaTime API key is not configured"
            });
        }

        const response = await fetch(
            `https://api.wakatime.com/api/v1/users/current/stats/last_7_days?api_key=${encodeURIComponent(apiKey)}`
        );

        const data = await response.json();

        // WakaTime can return 202 while stats are being refreshed.
        // Still return whatever language data is available.
        if (response.status !== 200 && response.status !== 202) {
            return res.status(response.status).json({
                error: "WakaTime rejected the request",
                wakatime: data
            });
        }

        const languages = data.data?.languages || [];

        const result = languages
            .map((language) => ({
                name: language.name,
                total_seconds: language.total_seconds || 0
            }))
            .filter((language) => language.name)
            .sort(
                (a, b) =>
                    b.total_seconds - a.total_seconds
            );

        return res.status(200).json({
            languages: result,
            up_to_date: data.data?.is_up_to_date ?? true
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