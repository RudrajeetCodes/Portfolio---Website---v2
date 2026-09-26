export default async function handler(req, res) {
    try {
        const apiKey = process.env.WAKATIME_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "WakaTime API key is not configured"
            });
        }

        const auth = Buffer
            .from(`${apiKey}:`)
            .toString("base64");

        const response = await fetch(
            "https://api.wakatime.com/api/v1/users/current/status_bar/today",
            {
                headers: {
                    Authorization: `Basic ${auth}`
                }
            }
        );

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Failed to fetch WakaTime data"
            });
        }

        const data = await response.json();

        return res.status(200).json(data);

    } catch (error) {
        console.error("WakaTime error:", error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
}