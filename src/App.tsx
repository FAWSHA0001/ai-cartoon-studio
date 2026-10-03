import { useState } from "react";
import "./App.css";

type CharacterProfile = {
  name: string;
  role: string;
  personality: string;
  appearance: string;
};

type StoryScene = {
  number: number;
  title: string;
  description: string;
  duration: number;
  visualPrompt: string;
  videoPrompt: string;
  voiceOver: string;
  musicSfx: string;
};

type StoryProject = {
  title: string;
  prompt: string;
  type: string;
  duration: string;
  language: string;
  style: string;
  characters: CharacterProfile[];
  scenes: StoryScene[];
  createdAt: string;
};

function App() {
  const [projectType, setProjectType] =
    useState("Cartoon Story");

  const [duration, setDuration] =
    useState("5 Minutes");

  const [language, setLanguage] =
    useState("English");

  const [style, setStyle] =
    useState("3D Cartoon");

  const [prompt, setPrompt] = useState("");

  const [project, setProject] =
    useState<StoryProject | null>(null);

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [selectedScene, setSelectedScene] =
    useState(0);

  const [generatedImages, setGeneratedImages] =
    useState<Record<number, string>>({});

  const [isGeneratingImage, setIsGeneratingImage] =
    useState(false);

  const [generatedVideos, setGeneratedVideos] =
    useState<Record<number, string>>({});

  const [isGeneratingVideo, setIsGeneratingVideo] =
    useState(false);

  const getMinutes = () => {
    return Number(duration.split(" ")[0]);
  };

  const getSceneCount = () => {
    const minutes = getMinutes();

    if (minutes === 1) return 6;
    if (minutes === 5) return 30;
    if (minutes === 10) return 60;
    if (minutes === 20) return 120;
    if (minutes === 30) return 180;

    return minutes * 6;
  };

  const generateCharacters = (
    storyPrompt: string
  ): CharacterProfile[] => {
    const lower = storyPrompt.toLowerCase();

    const characters: CharacterProfile[] = [];

    const add = (
      name: string,
      role: string,
      personality: string,
      appearance: string
    ) => {
      if (
        !characters.some(
          (character) =>
            character.name === name
        )
      ) {
        characters.push({
          name,
          role,
          personality,
          appearance,
        });
      }
    };

    if (
      lower.includes("rabbit") ||
      lower.includes("bunny")
    ) {
      add(
        "Bunny",
        "Main Character",
        "Curious, brave and kind",
        "Small fluffy rabbit with white fur, long ears, expressive eyes and a blue backpack"
      );
    }

    if (lower.includes("bear")) {
      add(
        "Benny Bear",
        "Best Friend",
        "Friendly, gentle and protective",
        "Cute brown bear with round ears, warm eyes and a green scarf"
      );
    }

    if (lower.includes("fox")) {
      add(
        "Finn Fox",
        "Adventure Friend",
        "Clever, playful and energetic",
        "Orange fox with a white chest, fluffy tail and yellow satchel"
      );
    }

    if (lower.includes("cat")) {
      add(
        "Milo Cat",
        "Main Character",
        "Playful, clever and curious",
        "Small orange cat with green eyes and a red collar"
      );
    }

    if (lower.includes("dog")) {
      add(
        "Buddy Dog",
        "Best Friend",
        "Loyal, cheerful and brave",
        "Friendly golden puppy with floppy ears and a blue collar"
      );
    }

    if (lower.includes("bird")) {
      add(
        "Sunny Bird",
        "Adventure Friend",
        "Cheerful, fast and helpful",
        "Small yellow bird with tiny wings and expressive eyes"
      );
    }

    if (lower.includes("lion")) {
      add(
        "Leo Lion",
        "Main Character",
        "Brave, caring and confident",
        "Young golden lion with a soft brown mane and expressive eyes"
      );
    }

    if (lower.includes("princess")) {
      add(
        "Princess Lily",
        "Main Character",
        "Kind, courageous and compassionate",
        "Young princess with long brown hair, pink dress and silver crown"
      );
    }

    if (lower.includes("dragon")) {
      add(
        "Draco",
        "Adventure Friend",
        "Powerful, playful and loyal",
        "Small friendly green dragon with tiny wings and blue eyes"
      );
    }

    if (characters.length === 0) {
      add(
        "Alex",
        "Main Character",
        "Curious, brave and kind",
        "Young cartoon hero with expressive eyes, colorful clothes and an adventure backpack"
      );

      add(
        "Mia",
        "Best Friend",
        "Smart, cheerful and supportive",
        "Young cartoon girl with expressive eyes, colorful clothes and a yellow backpack"
      );
    }

    if (characters.length === 1) {
      add(
        "Sam",
        "Best Friend",
        "Friendly, helpful and optimistic",
        "Cute cartoon companion with expressive eyes and colorful clothing"
      );
    }

    return characters.slice(0, 4);
  };

  const characterSummary = (
    characters: CharacterProfile[]
  ) => {
    return characters
      .map(
        (character) =>
          `${character.name} (${character.role}, ${character.appearance})`
      )
      .join("; ");
  };

  const getPhase = (
    scene: number,
    total: number
  ) => {
    const progress = scene / total;

    if (progress <= 0.08) return "Opening";
    if (progress <= 0.2) return "Setup";
    if (progress <= 0.4) return "Discovery";
    if (progress <= 0.65) return "Adventure";
    if (progress <= 0.82) return "Challenge";
    if (progress <= 0.95) return "Resolution";

    return "Ending";
  };

  const getDescription = (
    scene: number,
    total: number,
    story: string,
    characters: CharacterProfile[]
  ) => {
    const phase = getPhase(scene, total);

    const main =
      characters[0]?.name ||
      "the main character";

    const friend =
      characters[1]?.name ||
      "a helpful friend";

    if (phase === "Opening") {
      return `${main} begins the adventure in a beautiful cartoon world. The environment is introduced with warm cinematic visuals while something unusual begins to happen. Story idea: ${story}.`;
    }

    if (phase === "Setup") {
      return `${main} discovers an important clue connected to the story. ${friend} joins the moment and they decide to investigate together.`;
    }

    if (phase === "Discovery") {
      return `${main} and ${friend} explore a new location and discover an unexpected secret. Their expressions show curiosity and excitement.`;
    }

    if (phase === "Adventure") {
      return `${main} and the other characters continue their journey through a colorful world. They solve problems, explore new places and move closer to their goal.`;
    }

    if (phase === "Challenge") {
      return `${main} faces the biggest obstacle of the story. The characters must work together, stay brave and find a creative solution.`;
    }

    if (phase === "Resolution") {
      return `${main} and the friends finally understand how to solve the problem. Their teamwork creates a positive change and peace returns.`;
    }

    return `${main} celebrates the successful adventure with ${friend}. The story ends with a warm emotional moment and a simple lesson.`;
  };

  const getTitle = (
    scene: number,
    total: number,
    story: string
  ) => {
    const phase = getPhase(scene, total);

    const titles: Record<string, string[]> = {
      Opening: [
        "A New Beginning",
        "The Story Begins",
        "A Curious Morning",
      ],

      Setup: [
        "The First Clue",
        "Something Strange",
        "A New Discovery",
      ],

      Discovery: [
        "The Secret Path",
        "Into the Unknown",
        "The Hidden Place",
      ],

      Adventure: [
        "The Big Adventure",
        "Across the Forest",
        "A Surprising Journey",
      ],

      Challenge: [
        "The Biggest Challenge",
        "Trouble Appears",
        "A Difficult Choice",
      ],

      Resolution: [
        "Finding the Answer",
        "Everything Changes",
        "The Solution",
      ],

      Ending: [
        "A Happy Ending",
        "A Lesson to Remember",
        "The End of the Adventure",
      ],
    };

    const list = titles[phase];

    const title =
      list[(scene - 1) % list.length];

    const cleanStory = story
      .trim()
      .slice(0, 30)
      .replace(/\s+/g, " ");

    return `${title} — ${cleanStory}`;
  };

  const getVoiceOver = (
    scene: number,
    total: number
  ) => {
    const phase = getPhase(scene, total);

    if (phase === "Opening") {
      return "Every great adventure begins with one small moment. And today, something unexpected was about to happen.";
    }

    if (phase === "Setup") {
      return "Something was different this time. A clue had appeared, and there was only one way to discover where it would lead.";
    }

    if (phase === "Discovery") {
      return "As they moved forward, the world revealed a secret they never expected to find.";
    }

    if (phase === "Adventure") {
      return "The journey continued, and every new step brought them closer to the answer.";
    }

    if (phase === "Challenge") {
      return "But then, everything changed. The biggest challenge was finally here, and giving up was not an option.";
    }

    if (phase === "Resolution") {
      return "Together, they discovered that courage, friendship and teamwork could solve even the hardest problem.";
    }

    return "And that was the end of their adventure. They would always remember what they had learned that day.";
  };

  const getMusic = (
    scene: number,
    total: number
  ) => {
    const phase = getPhase(scene, total);

    if (phase === "Opening") {
      return "Soft magical music, birds, gentle wind and sparkle effects.";
    }

    if (phase === "Setup") {
      return "Light mysterious music, footsteps, environmental ambience and discovery effects.";
    }

    if (phase === "Discovery") {
      return "Curious adventure music, magical chimes, footsteps and nature ambience.";
    }

    if (phase === "Adventure") {
      return "Energetic cinematic adventure music, movement sounds and playful effects.";
    }

    if (phase === "Challenge") {
      return "Dramatic family-friendly music, stronger percussion, wind and suspense effects.";
    }

    if (phase === "Resolution") {
      return "Warm uplifting music, gentle orchestral sounds and positive magical effects.";
    }

    return "Peaceful emotional music, soft birds, gentle wind and warm cinematic ending.";
  };

  const generateStory = () => {
    if (!prompt.trim()) {
      alert("Please enter a story idea first.");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const total = getSceneCount();

      const characters =
        generateCharacters(prompt);

      const summary =
        characterSummary(characters);

      const seconds = Math.max(
        10,
        Math.round(
          (getMinutes() * 60) / total
        )
      );

      const scenes: StoryScene[] = [];

      for (let i = 1; i <= total; i++) {
        const description =
          getDescription(
            i,
            total,
            prompt,
            characters
          );

        scenes.push({
          number: i,

          title: getTitle(
            i,
            total,
            prompt
          ),

          description,

          duration: seconds,

          visualPrompt:
            `${style} children's cartoon scene. ${description} ` +
            `Characters: ${summary}. Maintain identical character appearance, clothing, colors, proportions and facial design throughout the entire story. ` +
            `Cinematic lighting, detailed background, expressive faces, family-friendly animation, high quality.`,

          videoPrompt:
            `Create a ${seconds}-second ${style} animation. ${description} ` +
            `Use smooth character movement, expressive facial animation, cinematic camera movement and consistent character design. ` +
            `Keep all characters visually identical to previous scenes.`,

          voiceOver:
            getVoiceOver(i, total),

          musicSfx:
            getMusic(i, total),
        });
      }

      const newProject: StoryProject = {
        title:
          projectType === "Educational Cartoon"
            ? "The Amazing Cartoon Lesson"
            : projectType === "Kids Story"
            ? "The Little Adventure"
            : projectType === "Short Cartoon"
            ? "A Tiny Cartoon Adventure"
            : "The Great Cartoon Adventure",

        prompt: prompt.trim(),

        type: projectType,

        duration,

        language,

        style,

        characters,

        scenes,

        createdAt:
          new Date().toISOString(),
      };

      setProject(newProject);

      setSelectedScene(0);

      setGeneratedImages({});

      setGeneratedVideos({});

      localStorage.setItem(
        "ai-cartoon-current-project",
        JSON.stringify(newProject)
      );

      setIsGenerating(false);
    }, 700);
  };

  /*
   * AI IMAGE GENERATION
   *
   * Backend:
   * http://localhost:3001/api/generate-image
   */
  const generateSceneImage = async () => {
    if (!currentScene || !project) {
      return;
    }

    setIsGeneratingImage(true);

    try {
      const response = await fetch(
        "http://localhost:3001/api/generate-image",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            prompt: currentScene.visualPrompt,

            style: project.style,

            sceneNumber:
              currentScene.number,
          }),
        }
      );

      if (!response.ok) {
        const data =
          await response.json().catch(
            () => null
          );

        throw new Error(
          data?.error ||
            "Image generation failed."
        );
      }

      const blob =
        await response.blob();

      const imageUrl =
        URL.createObjectURL(blob);

      setGeneratedImages(
        (previous) => ({
          ...previous,

          [currentScene.number]:
            imageUrl,
        })
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Image generation failed."
      );
    } finally {
      setIsGeneratingImage(false);
    }
  };

  /*
   * FREE LOCAL VIDEO GENERATION
   *
   * Flow:
   *
   * Generated Scene Image
   *        ↓
   * Browser Blob
   *        ↓
   * Base64 Image
   *        ↓
   * Local Node Server
   *        ↓
   * FFmpeg
   *        ↓
   * MP4
   *
   * This does NOT use paid Veo.
   */
  const generateSceneVideo = async () => {
    if (!currentScene || !project) {
      return;
    }

    const imageUrl =
      generatedImages[currentScene.number];

    if (!imageUrl) {
      alert(
        "Please generate the scene image first."
      );

      return;
    }

    setIsGeneratingVideo(true);

    try {
      /*
       * Convert the generated image object URL
       * into a base64 data URL so the local
       * backend can process the exact same image.
       */
      const imageResponse =
        await fetch(imageUrl);

      if (!imageResponse.ok) {
        throw new Error(
          "Could not read the generated scene image."
        );
      }

      const imageBlob =
        await imageResponse.blob();

      const imageData =
        await new Promise<string>(
          (resolve, reject) => {
            const reader =
              new FileReader();

            reader.onloadend = () => {
              if (
                typeof reader.result ===
                "string"
              ) {
                resolve(reader.result);
              } else {
                reject(
                  new Error(
                    "Could not convert image to base64."
                  )
                );
              }
            };

            reader.onerror = () => {
              reject(
                new Error(
                  "Could not read scene image."
                )
              );
            };

            reader.readAsDataURL(
              imageBlob
            );
          }
        );

      const response = await fetch(
        "http://localhost:3001/api/generate-video",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            imageData,

            prompt:
              currentScene.videoPrompt,

            sceneNumber:
              currentScene.number,

            duration:
              Math.min(
                Math.max(
                  currentScene.duration,
                  1
                ),
                10
              ),
          }),
        }
      );

      if (!response.ok) {
        const data =
          await response.json().catch(
            () => null
          );

        throw new Error(
          data?.error ||
            "Free video generation failed."
        );
      }

      const blob =
        await response.blob();

      const videoUrl =
        URL.createObjectURL(blob);

      setGeneratedVideos(
        (previous) => {
          const oldVideo =
            previous[
              currentScene.number
            ];

          if (oldVideo) {
            URL.revokeObjectURL(
              oldVideo
            );
          }

          return {
            ...previous,

            [currentScene.number]:
              videoUrl,
          };
        }
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Free video generation failed."
      );
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const downloadSceneVideo = () => {
    if (!currentScene) {
      return;
    }

    const videoUrl =
      generatedVideos[
        currentScene.number
      ];

    if (!videoUrl) {
      return;
    }

    const link =
      document.createElement("a");

    link.href = videoUrl;

    link.download =
      `scene-${currentScene.number}.mp4`;

    document.body.appendChild(link);

    link.click();

    link.remove();
  };

  const copyText = async (
    text: string
  ) => {
    try {
      await navigator.clipboard.writeText(
        text
      );

      alert("Copied successfully.");
    } catch {
      alert("Copy failed.");
    }
  };

  const exportProject = () => {
    if (!project) return;

    const output: string[] = [
      project.title,

      "=".repeat(
        project.title.length
      ),

      "",

      `Type: ${project.type}`,

      `Duration: ${project.duration}`,

      `Language: ${project.language}`,

      `Style: ${project.style}`,

      "",

      "STORY IDEA",

      project.prompt,

      "",

      "CHARACTER BIBLE",

      "",
    ];

    project.characters.forEach(
      (character) => {
        output.push(
          `Name: ${character.name}`
        );

        output.push(
          `Role: ${character.role}`
        );

        output.push(
          `Personality: ${character.personality}`
        );

        output.push(
          `Appearance: ${character.appearance}`
        );

        output.push("");
      }
    );

    output.push("SCENES");

    output.push("");

    project.scenes.forEach(
      (scene) => {
        output.push(
          `SCENE ${scene.number}: ${scene.title}`
        );

        output.push(
          `Duration: ${scene.duration}s`
        );

        output.push(
          `Description: ${scene.description}`
        );

        output.push(
          `Visual Prompt: ${scene.visualPrompt}`
        );

        output.push(
          `Video Prompt: ${scene.videoPrompt}`
        );

        output.push(
          `Voice Over: ${scene.voiceOver}`
        );

        output.push(
          `Music/SFX: ${scene.musicSfx}`
        );

        output.push("");
      }
    );

    const blob = new Blob(
      [output.join("\n")],
      {
        type: "text/plain;charset=utf-8",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `${project.title
        .replace(
          /[^a-z0-9]+/gi,
          "-"
        )
        .toLowerCase()}.txt`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  };

  const loadProject = () => {
    const saved =
      localStorage.getItem(
        "ai-cartoon-current-project"
      );

    if (!saved) {
      alert(
        "No saved project found."
      );

      return;
    }

    try {
      const parsed =
        JSON.parse(
          saved
        ) as StoryProject;

      setProject(parsed);

      setSelectedScene(0);

      setGeneratedImages({});

      setGeneratedVideos({});
    } catch {
      alert(
        "Could not load saved project."
      );
    }
  };

  const startNewProject = () => {
    setProject(null);

    setPrompt("");

    setSelectedScene(0);

    setGeneratedImages({});

    setGeneratedVideos({});
  };

  const currentScene =
    project?.scenes[
      selectedScene
    ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            🎬
          </div>

          <div>
            <h1>
              AI Cartoon Studio
            </h1>

            <span>
              Creative Production Suite
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${
              !project ? "active" : ""
            }`}
            onClick={startNewProject}
          >
            ✨ Story Creator
          </button>

          <button
            className={`nav-item ${
              project ? "active" : ""
            }`}
            onClick={loadProject}
          >
            📂 My Project
          </button>
        </nav>

        <div className="creator-card">
          <div className="creator-avatar">
            AI
          </div>

          <div>
            <strong>
              AI Creator
            </strong>

            <span>
              Studio Workspace
            </span>
          </div>
        </div>

        <div className="sidebar-footer">
          <span>
            AI Cartoon Studio
          </span>

          <small>
            Production Workspace
          </small>
        </div>
      </aside>

      <main className="main-content">
        {!project ? (
          <>
            <header className="page-header">
              <div>
                <span className="eyebrow">
                  AI CREATIVE WORKSPACE
                </span>

                <h2>
                  Create Your Cartoon Story
                </h2>

                <p>
                  Turn a simple idea into a
                  complete cartoon production
                  plan.
                </p>
              </div>

              <button
                className="load-button"
                onClick={loadProject}
              >
                📂 Load Project
              </button>
            </header>

            <section className="creator-section">
              <div className="story-card">
                <div className="section-heading">
                  <div>
                    <span className="section-number">
                      01
                    </span>

                    <div>
                      <h3>
                        Story Idea
                      </h3>

                      <p>
                        Describe the cartoon
                        you want to create.
                      </p>
                    </div>
                  </div>
                </div>

                <textarea
                  className="story-input"
                  value={prompt}
                  onChange={(event) =>
                    setPrompt(
                      event.target.value
                    )
                  }
                  placeholder="Example: A brave little rabbit discovers a magical forest and helps the forest animals..."
                />

                <div className="quick-prompts">
                  <span>
                    Quick ideas:
                  </span>

                  <button
                    onClick={() =>
                      setPrompt(
                        "A brave little rabbit discovers a magical forest and helps the forest animals."
                      )
                    }
                  >
                    🐰 Magical Rabbit
                  </button>

                  <button
                    onClick={() =>
                      setPrompt(
                        "A friendly bear and a clever fox go on an exciting adventure to find a hidden treasure."
                      )
                    }
                  >
                    🐻 Forest Adventure
                  </button>

                  <button
                    onClick={() =>
                      setPrompt(
                        "A young princess discovers a tiny friendly dragon and learns the importance of friendship."
                      )
                    }
                  >
                    🐉 Princess & Dragon
                  </button>
                </div>
              </div>

              <div className="settings-card">
                <div className="section-heading">
                  <div>
                    <span className="section-number">
                      02
                    </span>

                    <div>
                      <h3>
                        Production Settings
                      </h3>

                      <p>
                        Configure your cartoon
                        project.
                      </p>
                    </div>
                  </div>
                </div>

                <label>
                  Content Type

                  <select
                    value={projectType}
                    onChange={(event) =>
                      setProjectType(
                        event.target.value
                      )
                    }
                  >
                    <option>
                      Cartoon Story
                    </option>

                    <option>
                      Kids Story
                    </option>

                    <option>
                      Educational Cartoon
                    </option>

                    <option>
                      Short Cartoon
                    </option>
                  </select>
                </label>

                <label>
                  Duration

                  <select
                    value={duration}
                    onChange={(event) =>
                      setDuration(
                        event.target.value
                      )
                    }
                  >
                    <option>
                      1 Minute
                    </option>

                    <option>
                      5 Minutes
                    </option>

                    <option>
                      10 Minutes
                    </option>

                    <option>
                      20 Minutes
                    </option>

                    <option>
                      30 Minutes
                    </option>
                  </select>
                </label>

                <label>
                  Language

                  <select
                    value={language}
                    onChange={(event) =>
                      setLanguage(
                        event.target.value
                      )
                    }
                  >
                    <option>
                      English
                    </option>

                    <option>
                      Urdu
                    </option>

                    <option>
                      Hindi
                    </option>
                  </select>
                </label>

                <label>
                  Visual Style

                  <select
                    value={style}
                    onChange={(event) =>
                      setStyle(
                        event.target.value
                      )
                    }
                  >
                    <option>
                      3D Cartoon
                    </option>

                    <option>
                      2D Cartoon
                    </option>

                    <option>
                      Anime
                    </option>

                    <option>
                      Storybook
                    </option>

                    <option>
                      Pixar Inspired
                    </option>
                  </select>
                </label>

                <button
                  className="generate-button"
                  onClick={generateStory}
                  disabled={isGenerating}
                >
                  {isGenerating
                    ? "⚙️ Generating..."
                    : "✨ Generate Cartoon Story"}
                </button>
              </div>
            </section>

            <section className="workflow-section">
              <div className="section-heading">
                <div>
                  <span className="section-number">
                    03
                  </span>

                  <div>
                    <h3>
                      Production Workflow
                    </h3>

                    <p>
                      Complete production pipeline
                      for your cartoon.
                    </p>
                  </div>
                </div>
              </div>

              <div className="workflow-grid">
                <div className="workflow-card">
                  <span>✍️</span>

                  <strong>
                    Story
                  </strong>

                  <p>
                    Structured story
                  </p>
                </div>

                <div className="workflow-card">
                  <span>👥</span>

                  <strong>
                    Characters
                  </strong>

                  <p>
                    Character consistency
                  </p>
                </div>

                <div className="workflow-card">
                  <span>🎨</span>

                  <strong>
                    Visual Prompts
                  </strong>

                  <p>
                    Image-ready prompts
                  </p>
                </div>

                <div className="workflow-card">
                  <span>🎥</span>

                  <strong>
                    Video Prompts
                  </strong>

                  <p>
                    Animation instructions
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            <header className="page-header">
              <div>
                <span className="eyebrow">
                  PROJECT READY
                </span>

                <h2>
                  {project.title}
                </h2>

                <p>
                  {project.prompt}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <button
                  className="load-button"
                  onClick={exportProject}
                >
                  ⬇ Export Project
                </button>

                <button
                  className="new-project-button"
                  onClick={startNewProject}
                >
                  + New Project
                </button>
              </div>
            </header>

            <section className="project-stats">
              <div>
                <span>
                  CONTENT TYPE
                </span>

                <strong>
                  {project.type}
                </strong>
              </div>

              <div>
                <span>
                  DURATION
                </span>

                <strong>
                  {project.duration}
                </strong>
              </div>

              <div>
                <span>
                  LANGUAGE
                </span>

                <strong>
                  {project.language}
                </strong>
              </div>

              <div>
                <span>
                  SCENES
                </span>

                <strong>
                  {project.scenes.length}
                </strong>
              </div>
            </section>

            <section className="characters-section">
              <div className="section-heading">
                <div>
                  <span className="section-number">
                    01
                  </span>

                  <div>
                    <h3>
                      Character Bible
                    </h3>

                    <p>
                      Character consistency for
                      every scene.
                    </p>
                  </div>
                </div>
              </div>

              <div className="characters-grid">
                {project.characters.map(
                  (character) => (
                    <div
                      className="character-card"
                      key={character.name}
                    >
                      <span>
                        👤
                      </span>

                      <div>
                        <strong>
                          {character.name}
                        </strong>

                        <small>
                          {character.role}
                        </small>

                        <p>
                          <b>
                            Personality:
                          </b>{" "}
                          {character.personality}
                        </p>

                        <p>
                          <b>
                            Appearance:
                          </b>{" "}
                          {character.appearance}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            <section className="scenes-section">
              <div className="section-heading">
                <div>
                  <span className="section-number">
                    02
                  </span>

                  <div>
                    <h3>
                      Scene Production
                    </h3>

                    <p>
                      Work through your scenes
                      one by one.
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  overflowX: "auto",
                  paddingBottom: 14,
                  marginBottom: 18,
                }}
              >
                {project.scenes.map(
                  (scene, index) => (
                    <button
                      key={scene.number}
                      onClick={() =>
                        setSelectedScene(
                          index
                        )
                      }
                      style={{
                        minWidth: 82,
                        padding:
                          "10px 12px",
                        borderRadius: 10,
                        border:
                          selectedScene ===
                          index
                            ? "2px solid currentColor"
                            : "1px solid rgba(255,255,255,.12)",
                        background:
                          selectedScene ===
                          index
                            ? "rgba(255,255,255,.10)"
                            : "rgba(255,255,255,.04)",
                        color: "inherit",
                        cursor:
                          "pointer",
                        fontWeight: 700,
                      }}
                    >
                      Scene{" "}
                      {scene.number}
                    </button>
                  )
                )}
              </div>

              {currentScene && (
                <article className="scene-card">
                  <div className="scene-header">
                    <div>
                      <span>
                        SCENE{" "}
                        {currentScene.number}
                      </span>

                      <h4>
                        {currentScene.title}
                      </h4>
                    </div>

                    <strong>
                      {currentScene.duration}s
                    </strong>
                  </div>

                  <p className="scene-description">
                    {currentScene.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      gap: 10,
                      marginBottom: 18,
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      className="load-button"
                      disabled={
                        selectedScene === 0
                      }
                      onClick={() =>
                        setSelectedScene(
                          Math.max(
                            0,
                            selectedScene -
                              1
                          )
                        )
                      }
                    >
                      ← Previous Scene
                    </button>

                    <span
                      style={{
                        alignSelf:
                          "center",
                        fontWeight: 700,
                        opacity: 0.7,
                      }}
                    >
                      {selectedScene + 1} /{" "}
                      {project.scenes.length}
                    </span>

                    <button
                      className="load-button"
                      disabled={
                        selectedScene ===
                        project.scenes.length -
                          1
                      }
                      onClick={() =>
                        setSelectedScene(
                          Math.min(
                            project.scenes.length -
                              1,
                            selectedScene +
                              1
                          )
                        )
                      }
                    >
                      Next Scene →
                    </button>
                  </div>

                  {/* =========================
                      AI IMAGE
                  ========================== */}

                  <div
                    style={{
                      marginBottom: 22,
                      padding: 18,
                      borderRadius: 16,
                      border:
                        "1px solid rgba(255,255,255,.10)",
                      background:
                        "rgba(255,255,255,.035)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        gap: 12,
                        flexWrap:
                          "wrap",
                        marginBottom: 14,
                      }}
                    >
                      <div>
                        <strong
                          style={{
                            fontSize: 17,
                          }}
                        >
                          🖼️ AI Scene Image
                        </strong>

                        <p
                          style={{
                            margin:
                              "5px 0 0",
                            opacity:
                              0.65,
                          }}
                        >
                          Generate a visual
                          from this
                          scene's Visual
                          Prompt.
                        </p>
                      </div>

                      <button
                        className="load-button"
                        onClick={
                          generateSceneImage
                        }
                        disabled={
                          isGeneratingImage
                        }
                      >
                        {isGeneratingImage
                          ? "⏳ Generating Image..."
                          : generatedImages[
                              currentScene
                                .number
                            ]
                          ? "🔄 Regenerate Image"
                          : "🎨 Generate AI Image"}
                      </button>
                    </div>

                    {generatedImages[
                      currentScene.number
                    ] ? (
                      <div
                        style={{
                          overflow:
                            "hidden",
                          borderRadius:
                            14,
                          border:
                            "1px solid rgba(255,255,255,.10)",
                          background:
                            "#111",
                        }}
                      >
                        <img
                          src={
                            generatedImages[
                              currentScene
                                .number
                            ]
                          }
                          alt={`Generated image for Scene ${currentScene.number}`}
                          style={{
                            display:
                              "block",
                            width:
                              "100%",
                            maxHeight:
                              620,
                            objectFit:
                              "cover",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          minHeight:
                            220,
                          display:
                            "grid",
                          placeItems:
                            "center",
                          textAlign:
                            "center",
                          borderRadius:
                            14,
                          border:
                            "1px dashed rgba(255,255,255,.14)",
                          background:
                            "rgba(0,0,0,.12)",
                          padding: 24,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize:
                                42,
                              marginBottom:
                                10,
                            }}
                          >
                            🎨
                          </div>

                          <strong>
                            No scene image
                            generated yet
                          </strong>

                          <p
                            style={{
                              opacity:
                                0.6,
                              marginBottom:
                                0,
                            }}
                          >
                            Click
                            “Generate AI
                            Image” to
                            create this
                            scene visual.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* =========================
                      FREE LOCAL VIDEO
                  ========================== */}

                  <div
                    style={{
                      marginBottom: 22,
                      padding: 18,
                      borderRadius: 16,
                      border:
                        "1px solid rgba(255,255,255,.10)",
                      background:
                        "rgba(255,255,255,.035)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        gap: 12,
                        flexWrap:
                          "wrap",
                        marginBottom: 14,
                      }}
                    >
                      <div>
                        <strong
                          style={{
                            fontSize: 17,
                          }}
                        >
                          🎥 Free Scene Video
                        </strong>

                        <p
                          style={{
                            margin:
                              "5px 0 0",
                            opacity:
                              0.65,
                          }}
                        >
                          Turn the generated
                          scene image into
                          a free animated MP4
                          using local FFmpeg.
                        </p>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          flexWrap:
                            "wrap",
                        }}
                      >
                        {generatedVideos[
                          currentScene.number
                        ] && (
                          <button
                            className="load-button"
                            onClick={
                              downloadSceneVideo
                            }
                          >
                            ⬇ Download Video
                          </button>
                        )}

                        <button
                          className="load-button"
                          onClick={
                            generateSceneVideo
                          }
                          disabled={
                            isGeneratingVideo ||
                            !generatedImages[
                              currentScene
                                .number
                            ]
                          }
                        >
                          {isGeneratingVideo
                            ? "⏳ Creating Free Video..."
                            : generatedVideos[
                                currentScene
                                  .number
                              ]
                            ? "🔄 Regenerate Free Video"
                            : "🎥 Generate Free Video"}
                        </button>
                      </div>
                    </div>
                                        {isGeneratingVideo && (
                      <div
                        style={{
                          padding: 18,
                          marginBottom: 14,
                          borderRadius: 14,
                          textAlign: "center",
                          background:
                            "rgba(255,255,255,.04)",
                          border:
                            "1px solid rgba(255,255,255,.08)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 34,
                            marginBottom: 8,
                          }}
                        >
                          🎬
                        </div>

                        <strong>
                          Creating your free
                          animated video...
                        </strong>

                        <p
                          style={{
                            opacity: 0.65,
                            marginBottom: 0,
                          }}
                        >
                          Local FFmpeg is
                          converting the scene
                          image into an MP4.
                          Please keep this page
                          open.
                        </p>
                      </div>
                    )}

                    {generatedVideos[
                      currentScene.number
                    ] ? (
                      <div
                        style={{
                          overflow:
                            "hidden",
                          borderRadius:
                            14,
                          border:
                            "1px solid rgba(255,255,255,.10)",
                          background:
                            "#000",
                        }}
                      >
                        <video
                          src={
                            generatedVideos[
                              currentScene
                                .number
                            ]
                          }
                          controls
                          playsInline
                          style={{
                            display:
                              "block",
                            width:
                              "100%",
                            maxHeight:
                              620,
                            background:
                              "#000",
                          }}
                        />
                      </div>
                    ) : (
                      !isGeneratingVideo && (
                        <div
                          style={{
                            minHeight:
                              220,
                            display:
                              "grid",
                            placeItems:
                              "center",
                            textAlign:
                              "center",
                            borderRadius:
                              14,
                            border:
                              "1px dashed rgba(255,255,255,.14)",
                            background:
                              "rgba(0,0,0,.12)",
                            padding: 24,
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize:
                                  42,
                                marginBottom:
                                  10,
                              }}
                            >
                              🎥
                            </div>

                            <strong>
                              No scene video
                              generated yet
                            </strong>

                            <p
                              style={{
                                opacity:
                                  0.6,
                                marginBottom:
                                  0,
                              }}
                            >
                              First generate
                              the scene image,
                              then click
                              “Generate Free
                              Video”.
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {/* =========================
                      PROMPTS
                  ========================== */}

                  <div className="production-grid">
                    <div className="production-box">
                      <div className="production-heading">
                        <strong>
                          🎨 Visual Prompt
                        </strong>

                        <button
                          onClick={() =>
                            copyText(
                              currentScene.visualPrompt
                            )
                          }
                        >
                          Copy
                        </button>
                      </div>

                      <p>
                        {
                          currentScene.visualPrompt
                        }
                      </p>
                    </div>

                    <div className="production-box">
                      <div className="production-heading">
                        <strong>
                          🎥 Video Prompt
                        </strong>

                        <button
                          onClick={() =>
                            copyText(
                              currentScene.videoPrompt
                            )
                          }
                        >
                          Copy
                        </button>
                      </div>

                      <p>
                        {
                          currentScene.videoPrompt
                        }
                      </p>
                    </div>

                    <div className="production-box">
                      <div className="production-heading">
                        <strong>
                          🎙 Voice Over
                        </strong>

                        <button
                          onClick={() =>
                            copyText(
                              currentScene.voiceOver
                            )
                          }
                        >
                          Copy
                        </button>
                      </div>

                      <p>
                        {
                          currentScene.voiceOver
                        }
                      </p>
                    </div>

                    <div className="production-box">
                      <div className="production-heading">
                        <strong>
                          🎵 Music / SFX
                        </strong>

                        <button
                          onClick={() =>
                            copyText(
                              currentScene.musicSfx
                            )
                          }
                        >
                          Copy
                        </button>
                      </div>

                      <p>
                        {
                          currentScene.musicSfx
                        }
                      </p>
                    </div>
                  </div>
                </article>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;