export default async function handler(req, res) {
    try {
        const apiKey = process.env.WAKATIME_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "WakaTime API key is not configured"
            });
        }

        const response = await fetch(
            `https://api.wakatime.com/api/v1/users/current/heartbeats?date=${new Date().toISOString().slice(0, 10)}&api_key=${encodeURIComponent(apiKey)}`
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: "WakaTime rejected the request",
                wakatime: data
            });
        }

        const heartbeats = data.data || [];

        if (heartbeats.length === 0) {
            return res.status(200).json({
                active: false,
                project: null,
                language: null
            });
        }

        const latest = heartbeats.reduce((latest, heartbeat) => {
            return heartbeat.time > latest.time ? heartbeat : latest;
        });

        const lastActivity = latest.time * 1000;
        const minutesSinceActivity =
            (Date.now() - lastActivity) / 60000;

        const active = minutesSinceActivity <= 5;

        return res.status(200).json({
            active,
            project: latest.project || null,
            language: latest.language || null,
            last_activity: latest.time
        });

    } catch (error) {
        console.error("WakaTime status error:", error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
}