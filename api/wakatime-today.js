export default async function handler(req, res) {
    try {
        const apiKey = process.env.WAKATIME_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "WakaTime API key is not configured"
            });
        }

        const response = await fetch(
            `https://api.wakatime.com/api/v1/users/current/durations?date=${new Date().toISOString().slice(0, 10)}&timezone=Asia/Kolkata&api_key=${encodeURIComponent(apiKey)}`
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: "WakaTime rejected the request",
                wakatime: data
            });
        }

        const durations = data.data || [];

        const totalSeconds = durations.reduce(
            (total, duration) =>
                total + (duration.duration || 0),
            0
        );

        return res.status(200).json({
            total_seconds: totalSeconds,
            durations
        });

    } catch (error) {
        console.error("WakaTime today error:", error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
}