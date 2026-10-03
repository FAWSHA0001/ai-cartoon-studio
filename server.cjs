const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const PORT = 3001;

const API_KEY = process.env.POLLINATIONS_API_KEY;

const FFMPEG_PATH =
  process.env.FFMPEG_PATH ||
  path.join(
    process.env.HOME || os.homedir(),
    "ffmpeg",
    "bin",
    "ffmpeg"
  );

if (!API_KEY) {
  console.error(
    "Missing POLLINATIONS_API_KEY environment variable."
  );
  process.exit(1);
}

// ============================================================
// HELPERS
// ============================================================

const sendJson = (res, status, data) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  res.end(JSON.stringify(data));
};

const readRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      resolve(body);
    });

    req.on("error", reject);
  });
};

const runFFmpeg = (args) => {
  return new Promise((resolve, reject) => {
    console.log("");
    console.log("Starting FFmpeg:");
    console.log(FFMPEG_PATH);
    console.log(args.join(" "));
    console.log("");

    const process = spawn(FFMPEG_PATH, args);

    let stdout = "";
    let stderr = "";

    process.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    process.stderr.on("data", (data) => {
      const text = data.toString();

      stderr += text;

      if (
        text.includes("frame=") ||
        text.includes("time=") ||
        text.includes("speed=")
      ) {
        process.stdout.write(text);
      }
    });

    process.on("error", (error) => {
      reject(error);
    });

    process.on("close", (code) => {
      if (code === 0) {
        resolve({
          stdout,
          stderr,
        });
      } else {
        reject(
          new Error(
            `FFmpeg exited with code ${code}\n${stderr}`
          )
        );
      }
    });
  });
};

const saveBase64Image = (imageData, filePath) => {
  if (
    !imageData ||
    typeof imageData !== "string"
  ) {
    throw new Error(
      "Generated image data is missing."
    );
  }

  let base64Data = imageData;

  if (imageData.includes(",")) {
    base64Data = imageData.split(",")[1];
  }

  base64Data = base64Data
    .replace(/\s/g, "")
    .trim();

  if (!base64Data) {
    throw new Error(
      "Generated image data is empty."
    );
  }

  const imageBuffer =
    Buffer.from(base64Data, "base64");

  if (!imageBuffer.length) {
    throw new Error(
      "Could not decode generated image."
    );
  }

  fs.writeFileSync(
    filePath,
    imageBuffer
  );

  return imageBuffer;
};

// ============================================================
// SAVE BASE64 VIDEO
// ============================================================

const saveBase64Video = (
  videoData,
  filePath
) => {
  if (
    !videoData ||
    typeof videoData !== "string"
  ) {
    throw new Error(
      "Video data is missing."
    );
  }

  let base64Data = videoData;

  if (videoData.includes(",")) {
    base64Data = videoData.split(",")[1];
  }

  base64Data = base64Data
    .replace(/\s/g, "")
    .trim();

  if (!base64Data) {
    throw new Error(
      "Video data is empty."
    );
  }

  const videoBuffer =
    Buffer.from(base64Data, "base64");

  if (!videoBuffer.length) {
    throw new Error(
      "Could not decode video data."
    );
  }

  fs.writeFileSync(
    filePath,
    videoBuffer
  );

  return videoBuffer;
};

// ============================================================
// SERVER
// ============================================================

const server = http.createServer(
  async (req, res) => {

    // ========================================================
    // CORS
    // ========================================================

    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type",
      });

      res.end();
      return;
    }

    // ========================================================
    // AI IMAGE GENERATION
    // ========================================================

    if (
      req.method === "POST" &&
      req.url === "/api/generate-image"
    ) {
      try {
        const body =
          await readRequestBody(req);

        const parsed =
          JSON.parse(body);

        const prompt =
          String(
            parsed.prompt || ""
          ).trim();

        if (!prompt) {
          sendJson(res, 400, {
            error:
              "Image prompt is required.",
          });

          return;
        }

        const model = "flux";

        console.log("");
        console.log(
          "=========================================="
        );
        console.log(
          `Generating AI image with model=${model}`
        );
        console.log(
          "=========================================="
        );

        const imageUrl =
          "https://gen.pollinations.ai/image/" +
          encodeURIComponent(prompt) +
          `?model=${encodeURIComponent(model)}`;

        const imageResponse =
          await fetch(imageUrl, {
            headers: {
              Authorization:
                `Bearer ${API_KEY}`,
            },
          });

        if (!imageResponse.ok) {
          const errorText =
            await imageResponse.text();

          console.error(
            "Pollinations image error:",
            errorText
          );

          sendJson(res, 500, {
            error:
              "Pollinations image generation failed.",
            details:
              errorText ||
              "Unknown image generation error.",
          });

          return;
        }

        const imageBuffer =
          Buffer.from(
            await imageResponse.arrayBuffer()
          );

        console.log(
          `Image generated successfully: ${(
            imageBuffer.length /
            1024 /
            1024
          ).toFixed(2)} MB`
        );

        res.writeHead(200, {
          "Content-Type":
            imageResponse.headers.get(
              "content-type"
            ) || "image/jpeg",

          "Cache-Control":
            "no-store",

          "Access-Control-Allow-Origin":
            "*",

          "Content-Length":
            imageBuffer.length,
        });

        res.end(imageBuffer);

      } catch (error) {
        console.error(
          "Image generation error:",
          error
        );

        sendJson(res, 500, {
          error:
            error instanceof Error
              ? error.message
              : "Image generation failed.",
        });
      }

      return;
    }

    // ========================================================
    // FREE LOCAL VIDEO GENERATION
    // EXISTING IMAGE -> FFMPEG -> MP4
    // ========================================================

    if (
      req.method === "POST" &&
      req.url === "/api/generate-video"
    ) {
      let tempImagePath = null;
      let outputVideoPath = null;

      try {
        const body =
          await readRequestBody(req);

        const parsed =
          JSON.parse(body);

        const prompt =
          String(
            parsed.prompt || ""
          ).trim();

        const imageData =
          String(
            parsed.imageData || ""
          ).trim();

        if (!imageData) {
          sendJson(res, 400, {
            error:
              "Generated scene image is required. Please generate the scene image first.",
          });

          return;
        }

        const requestedDuration =
          Number(parsed.duration);

        const duration =
          Number.isFinite(
            requestedDuration
          ) &&
          requestedDuration > 0
            ? Math.min(
                Math.max(
                  requestedDuration,
                  1
                ),
                10
              )
            : 5;

        console.log("");
        console.log(
          "=========================================="
        );
        console.log(
          "FREE LOCAL VIDEO RENDER"
        );
        console.log(
          "=========================================="
        );

        console.log(
          `Duration: ${duration}s`
        );

        console.log(
          "Source: Existing generated scene image"
        );

        console.log(
          "Video model: Local FFmpeg"
        );

        console.log(
          "Encoder: h264_videotoolbox"
        );

        if (prompt) {
          console.log(
            `Scene prompt: ${prompt}`
          );
        }

        const tempId =
          `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;

        tempImagePath =
          path.join(
            os.tmpdir(),
            `ai-cartoon-${tempId}.jpg`
          );

        outputVideoPath =
          path.join(
            os.tmpdir(),
            `ai-cartoon-${tempId}.mp4`
          );

        // ----------------------------------------------------
        // SAVE IMAGE
        // ----------------------------------------------------

        console.log(
          "Step 1/2: Using existing generated scene image..."
        );

        const imageBuffer =
          saveBase64Image(
            imageData,
            tempImagePath
          );

        console.log(
          `Scene image saved: ${(
            imageBuffer.length /
            1024 /
            1024
          ).toFixed(2)} MB`
        );

        // ----------------------------------------------------
        // FFMPEG ANIMATION
        // ----------------------------------------------------

        console.log(
          "Step 2/2: Rendering animated MP4..."
        );

        const fps = 25;

        const totalFrames =
          Math.max(
            1,
            Math.round(
              duration * fps
            )
          );

        const videoFilter =
          `scale=1280:720:force_original_aspect_ratio=increase,` +
          `crop=1280:720,` +
          `zoompan=` +
          `z='min(zoom+0.0012,1.12)':` +
          `x='iw/2-(iw/zoom/2)':` +
          `y='ih/2-(ih/zoom/2)':` +
          `d=${totalFrames}:` +
          `s=1280x720:` +
          `fps=${fps},` +
          `format=yuv420p`;

        const ffmpegArgs = [
          "-y",

          "-loop",
          "1",

          "-i",
          tempImagePath,

          "-vf",
          videoFilter,

          "-t",
          String(duration),

          "-r",
          String(fps),

          "-c:v",
          "h264_videotoolbox",

          "-pix_fmt",
          "yuv420p",

          "-movflags",
          "+faststart",

          outputVideoPath,
        ];

        await runFFmpeg(
          ffmpegArgs
        );

        if (
          !fs.existsSync(
            outputVideoPath
          )
        ) {
          throw new Error(
            "FFmpeg finished but the video file was not created."
          );
        }

        const videoBuffer =
          fs.readFileSync(
            outputVideoPath
          );

        if (!videoBuffer.length) {
          throw new Error(
            "Generated video file is empty."
          );
        }

        console.log(
          `Video rendered successfully: ${(
            videoBuffer.length /
            1024 /
            1024
          ).toFixed(2)} MB`
        );

        res.writeHead(200, {
          "Content-Type":
            "video/mp4",

          "Cache-Control":
            "no-store",

          "Access-Control-Allow-Origin":
            "*",

          "Content-Length":
            videoBuffer.length,
        });

        res.end(videoBuffer);

      } catch (error) {
        console.error(
          "Local video rendering error:",
          error
        );

        sendJson(res, 500, {
          error:
            error instanceof Error
              ? error.message
              : "Local video rendering failed.",
        });

      } finally {

        try {
          if (
            tempImagePath &&
            fs.existsSync(
              tempImagePath
            )
          ) {
            fs.unlinkSync(
              tempImagePath
            );
          }
        } catch (error) {
          console.error(
            "Temporary image cleanup failed:",
            error
          );
        }

        try {
          if (
            outputVideoPath &&
            fs.existsSync(
              outputVideoPath
            )
          ) {
            fs.unlinkSync(
              outputVideoPath
            );
          }
        } catch (error) {
          console.error(
            "Temporary video cleanup failed:",
            error
          );
        }
      }

      return;
    }

    // ========================================================
    // MERGE MULTIPLE SCENE VIDEOS
    // ========================================================

    if (
      req.method === "POST" &&
      req.url === "/api/merge-videos"
    ) {
      let tempDirectory = null;
      let outputVideoPath = null;

      try {
        const body =
          await readRequestBody(req);

        const parsed =
          JSON.parse(body);

        const videos =
          Array.isArray(
            parsed.videos
          )
            ? parsed.videos
            : [];

        if (
          videos.length < 2
        ) {
          sendJson(res, 400, {
            error:
              "At least 2 scene videos are required.",
          });

          return;
        }

        if (
          videos.length > 100
        ) {
          sendJson(res, 400, {
            error:
              "Maximum 100 scene videos can be merged at once.",
          });

          return;
        }

        console.log("");
        console.log(
          "=========================================="
        );
        console.log(
          "MERGING SCENE VIDEOS"
        );
        console.log(
          "=========================================="
        );

        console.log(
          `Number of scene videos: ${videos.length}`
        );

        // ----------------------------------------------------
        // TEMP DIRECTORY
        // ----------------------------------------------------

        const mergeId =
          `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;

        tempDirectory =
          path.join(
            os.tmpdir(),
            `ai-cartoon-merge-${mergeId}`
          );

        fs.mkdirSync(
          tempDirectory,
          {
            recursive: true,
          }
        );

        // ----------------------------------------------------
        // SAVE ALL VIDEOS
        // ----------------------------------------------------

        const videoPaths = [];

        for (
          let index = 0;
          index < videos.length;
          index++
        ) {
          const videoPath =
            path.join(
              tempDirectory,
              `scene-${String(
                index + 1
              ).padStart(4, "0")}.mp4`
            );

          console.log(
            `Saving scene ${index + 1}/${videos.length}...`
          );

          saveBase64Video(
            videos[index],
            videoPath
          );

          videoPaths.push(
            videoPath
          );
        }

        // ----------------------------------------------------
        // CONCAT FILE
        // ----------------------------------------------------

        const concatFilePath =
          path.join(
            tempDirectory,
            "concat.txt"
          );

        const concatContent =
          videoPaths
            .map(
              (videoPath) =>
                `file '${videoPath.replace(
                  /'/g,
                  "'\\''"
                )}'`
            )
            .join("\n");

        fs.writeFileSync(
          concatFilePath,
          concatContent,
          "utf8"
        );

        // ----------------------------------------------------
        // OUTPUT
        // ----------------------------------------------------

        outputVideoPath =
          path.join(
            tempDirectory,
            "final-video.mp4"
          );

        // ----------------------------------------------------
        // CONCAT DEMUXER
        //
        // All generated scene videos use:
        // 1280x720
        // 25 FPS
        // H264
        // yuv420p
        //
        // Therefore they can be joined directly.
        // ----------------------------------------------------

        console.log(
          "Combining scene videos..."
        );

        const mergeArgs = [
          "-y",

          "-f",
          "concat",

          "-safe",
          "0",

          "-i",
          concatFilePath,

          "-c",
          "copy",

          "-movflags",
          "+faststart",

          outputVideoPath,
        ];

        await runFFmpeg(
          mergeArgs
        );

        // ----------------------------------------------------
        // VERIFY
        // ----------------------------------------------------

        if (
          !fs.existsSync(
            outputVideoPath
          )
        ) {
          throw new Error(
            "FFmpeg finished but final video was not created."
          );
        }

        const finalVideoBuffer =
          fs.readFileSync(
            outputVideoPath
          );

        if (
          !finalVideoBuffer.length
        ) {
          throw new Error(
            "Final video file is empty."
          );
        }

        console.log(
          `Final video created: ${(
            finalVideoBuffer.length /
            1024 /
            1024
          ).toFixed(2)} MB`
        );

        console.log(
          "=========================================="
        );
        console.log(
          "VIDEO MERGE COMPLETE"
        );
        console.log(
          "=========================================="
        );
        console.log("");

        // ----------------------------------------------------
        // RETURN FINAL MP4
        // ----------------------------------------------------

        res.writeHead(200, {
          "Content-Type":
            "video/mp4",

          "Cache-Control":
            "no-store",

          "Access-Control-Allow-Origin":
            "*",

          "Content-Length":
            finalVideoBuffer.length,
        });

        res.end(
          finalVideoBuffer
        );

      } catch (error) {
        console.error(
          "Video merge error:",
          error
        );

        sendJson(res, 500, {
          error:
            error instanceof Error
              ? error.message
              : "Video merge failed.",
        });

      } finally {

        // ----------------------------------------------------
        // CLEANUP MERGE DIRECTORY
        // ----------------------------------------------------

        try {
          if (
            tempDirectory &&
            fs.existsSync(
              tempDirectory
            )
          ) {
            fs.rmSync(
              tempDirectory,
              {
                recursive: true,
                force: true,
              }
            );

            console.log(
              "Temporary merge files deleted."
            );
          }
        } catch (error) {
          console.error(
            "Merge cleanup failed:",
            error
          );
        }
      }

      return;
    }

    // ========================================================
    // 404
    // ========================================================

    sendJson(res, 404, {
      error: "Not found.",
    });
  }
);

// ============================================================
// START SERVER
// ============================================================

server.listen(
  PORT,
  () => {
    console.log(
      `AI Cartoon Studio server running at http://localhost:${PORT}`
    );

    console.log(
      `FFmpeg path: ${FFMPEG_PATH}`
    );
  }
);