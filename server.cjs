const http = require("http");

const PORT = 3001;
const API_KEY = process.env.POLLINATIONS_API_KEY;

if (!API_KEY) {
  console.error(
    "Missing POLLINATIONS_API_KEY environment variable."
  );
  process.exit(1);
}

const sendJson = (res, status, data) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  res.end(JSON.stringify(data));
};

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });

    res.end();
    return;
  }

  if (
    req.method === "POST" &&
    req.url === "/api/generate-image"
  ) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const parsed = JSON.parse(body);

        const prompt = String(
          parsed.prompt || ""
        ).trim();

        if (!prompt) {
          sendJson(res, 400, {
            error: "Image prompt is required.",
          });

          return;
        }

        const model = "flux";

        const imageUrl =
          "https://gen.pollinations.ai/image/" +
          encodeURIComponent(prompt) +
          `?model=${encodeURIComponent(model)}`;

        const imageResponse = await fetch(imageUrl, {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        });

        if (!imageResponse.ok) {
          const errorText =
            await imageResponse.text();

          console.error(
            "Pollinations error:",
            errorText
          );

          sendJson(res, 500, {
            error:
              "Pollinations image generation failed.",
          });

          return;
        }

        const imageBuffer = Buffer.from(
          await imageResponse.arrayBuffer()
        );

        res.writeHead(200, {
          "Content-Type":
            imageResponse.headers.get(
              "content-type"
            ) || "image/jpeg",
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
        });

        res.end(imageBuffer);
      } catch (error) {
        console.error(error);

        sendJson(res, 500, {
          error:
            error instanceof Error
              ? error.message
              : "Image generation failed.",
        });
      }
    });

    return;
  }

  sendJson(res, 404, {
    error: "Not found.",
  });
});

server.listen(PORT, () => {
  console.log(
    `AI Cartoon Studio image server running at http://localhost:${PORT}`
  );
});