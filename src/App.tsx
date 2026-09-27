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
  const [projectType, setProjectType] = useState("Cartoon Story");
  const [duration, setDuration] = useState("5 Minutes");
  const [language, setLanguage] = useState("English");
  const [style, setStyle] = useState("3D Cartoon");
  const [prompt, setPrompt] = useState("");
  const [project, setProject] = useState<StoryProject | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const getMinutes = () => Number(duration.split(" ")[0]);

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

    const addCharacter = (
      name: string,
      role: string,
      personality: string,
      appearance: string
    ) => {
      if (!characters.some((character) => character.name === name)) {
        characters.push({
          name,
          role,
          personality,
          appearance,
        });
      }
    };

    if (lower.includes("rabbit") || lower.includes("bunny")) {
      addCharacter(
        "Bunny",
        "Main Character",
        "Curious, brave and kind",
        "Small fluffy rabbit, soft white fur, long ears, expressive eyes and a tiny blue backpack"
      );
    }

    if (lower.includes("bear")) {
      addCharacter(
        "Benny Bear",
        "Best Friend",
        "Friendly, gentle and protective",
        "Cute brown bear with round ears, warm eyes and a small green scarf"
      );
    }

    if (lower.includes("fox")) {
      addCharacter(
        "Finn Fox",
        "Adventure Friend",
        "Clever, playful and energetic",
        "Orange fox with a white chest, fluffy tail and a small yellow satchel"
      );
    }

    if (lower.includes("cat")) {
      addCharacter(
        "Milo Cat",
        "Main Character",
        "Playful, clever and curious",
        "Small orange cat with bright green eyes and a red collar"
      );
    }

    if (lower.includes("dog")) {
      addCharacter(
        "Buddy Dog",
        "Best Friend",
        "Loyal, cheerful and brave",
        "Friendly golden puppy with floppy ears and a blue collar"
      );
    }

    if (lower.includes("bird")) {
      addCharacter(
        "Sunny Bird",
        "Adventure Friend",
        "Cheerful, fast and helpful",
        "Small bright yellow bird with tiny wings and expressive eyes"
      );
    }

    if (lower.includes("lion")) {
      addCharacter(
        "Leo Lion",
        "Main Character",
        "Brave, caring and confident",
        "Young golden lion with a soft brown mane and large expressive eyes"
      );
    }

    if (lower.includes("princess")) {
      addCharacter(
        "Princess Lily",
        "Main Character",
        "Kind, courageous and compassionate",
        "Young princess with long brown hair, pink dress and a small silver crown"
      );
    }

    if (lower.includes("dragon")) {
      addCharacter(
        "Draco",
        "Adventure Friend",
        "Powerful, playful and loyal",
        "Small friendly green dragon with tiny wings and glowing blue eyes"
      );
    }

    if (characters.length === 0) {
      addCharacter(
        "Alex",
        "Main Character",
        "Curious, brave and kind",
        "Young cartoon hero with expressive eyes, colorful clothes and a small adventure backpack"
      );

      addCharacter(
        "Mia",
        "Best Friend",
        "Smart, cheerful and supportive",
        "Young cartoon girl with expressive eyes, colorful clothes and a small yellow backpack"
      );
    }

    if (characters.length === 1) {
      addCharacter(
        "Sam",
        "Best Friend",
        "Friendly, helpful and optimistic",
        "Cute cartoon companion with expressive eyes and colorful clothing"
      );
    }

    return characters.slice(0, 4);
  };

  const getCharacterSummary = (
    characters: CharacterProfile[]
  ) => {
    return characters
      .map(
        (character) =>
          `${character.name} (${character.role}, ${character.appearance})`
      )
      .join("; ");
  };

  const getScenePhase = (
    sceneNumber: number,
    totalScenes: number
  ) => {
    const progress = sceneNumber / totalScenes;

    if (progress <= 0.08) return "Opening";
    if (progress <= 0.2) return "Setup";
    if (progress <= 0.4) return "Discovery";
    if (progress <= 0.65) return "Adventure";
    if (progress <= 0.82) return "Challenge";
    if (progress <= 0.95) return "Resolution";
    return "Ending";
  };

  const generateSceneTitle = (
    sceneNumber: number,
    totalScenes: number,
    storyPrompt: string
  ) => {
    const phase = getScenePhase(sceneNumber, totalScenes);

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
    const title = list[(sceneNumber - 1) % list.length];

    return `${title} — ${storyPrompt
      .trim()
      .slice(0, 35)
      .replace(/\s+/g, " ")}`;
  };

  const generateSceneDescription = (
    sceneNumber: number,
    totalScenes: number,
    storyPrompt: string,
    characters: CharacterProfile[]
  ) => {
    const phase = getScenePhase(sceneNumber, totalScenes);
    const mainCharacter =
      characters[0]?.name || "the main character";
    const friend =
      characters[1]?.name || "a helpful friend";

    if (phase === "Opening") {
      return `${mainCharacter} begins the adventure in a beautiful cartoon world. The environment is introduced with warm cinematic visuals while the character notices that something unusual may be about to happen. Story idea: ${storyPrompt}.`;
    }

    if (phase === "Setup") {
      return `${mainCharacter} discovers the first important clue connected to the story. ${friend} joins the moment and the characters decide to investigate together.`;
    }

    if (phase === "Discovery") {
      return `${mainCharacter} and ${friend} explore a new location and discover an unexpected secret. Their expressions show curiosity and excitement as the adventure becomes more important.`;
    }

    if (phase === "Adventure") {
      return `${mainCharacter} and the other characters continue their journey through a colorful world. They solve small problems, explore new places and move closer to the main goal.`;
    }

    if (phase === "Challenge") {
      return `${mainCharacter} faces the biggest obstacle of the story. The characters must work together, stay brave and find a creative way to overcome the challenge.`;
    }

    if (phase === "Resolution") {
      return `${mainCharacter} and the friends finally understand how to solve the problem. Their teamwork leads to a positive change and the world around them becomes peaceful again.`;
    }

    return `${mainCharacter} celebrates the successful adventure with ${friend}. The story ends with a warm emotional moment, a simple lesson and a peaceful cinematic final shot.`;
  };

  const generateVoiceOver = (
    sceneNumber: number,
    totalScenes: number,
    description: string
  ) => {
    const phase = getScenePhase(sceneNumber, totalScenes);

    if (phase === "Opening") {
      return `Every great adventure begins with one small moment. And today, ${description}`;
    }

    if (phase === "Setup") {
      return `Something was different this time. A clue had appeared, and there was only one way to find out where it would lead.`;
    }

    if (phase === "Discovery") {
      return `As they moved forward, the world revealed a secret they never expected to find.`;
    }

    if (phase === "Adventure") {
      return `The journey continued, and every new step brought them closer to the answer.`;
    }

    if (phase === "Challenge") {
      return `But then, everything changed. The biggest challenge was finally here, and giving up was not an option.`;
    }

    if (phase === "Resolution") {
      return `Together, they discovered that courage, friendship and teamwork could solve even the hardest problem.`;
    }

    return `And that was the end of their adventure. They would always remember what they had learned that day.`;
  };

  const generateMusicSfx = (
    sceneNumber: number,
    totalScenes: number
  ) => {
    const phase = getScenePhase(sceneNumber, totalScenes);

    if (phase === "Opening") {
      return "Soft magical background music, birds, gentle wind and subtle sparkle sound effects.";
    }

    if (phase === "Setup") {
      return "Light mysterious music, soft footsteps, environmental ambience and gentle discovery sound effects.";
    }

    if (phase === "Discovery") {
      return "Curious adventure music, magical chimes, footsteps and subtle environmental sounds.";
    }

    if (phase === "Adventure") {
      return "Energetic cinematic adventure music, movement sounds, nature ambience and playful effects.";
    }

    if (phase === "Challenge") {
      return "Dramatic but family-friendly music, stronger percussion, wind and suspense sound effects.";
    }

    if (phase === "Resolution") {
      return "Warm uplifting music, gentle orchestral sounds and positive magical effects.";
    }

    return "Peaceful emotional music, soft birds, gentle wind and a warm cinematic ending sound.";
  };

  const generateStory = () => {
    if (!prompt.trim()) {
      alert("Please enter a story idea first.");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const totalScenes = getSceneCount();
      const characters = generateCharacters(prompt);
      const characterSummary = getCharacterSummary(characters);
      const scenes: StoryScene[] = [];

      const secondsPerScene = Math.max(
        10,
        Math.round((getMinutes() * 60) / totalScenes)
      );

      for (let i = 1; i <= totalScenes; i++) {
        const description = generateSceneDescription(
          i,
          totalScenes,
          prompt,
          characters
        );

        scenes.push({
          number: i,
          title: generateSceneTitle(
            i,
            totalScenes,
            prompt
          ),
          description,
          duration: secondsPerScene,

          visualPrompt:
            `${style} children's cartoon scene. ${description} ` +
            `Characters: ${characterSummary}. ` +
            `Maintain identical character appearance, clothing, colors, proportions and facial design throughout the entire story. ` +
            `Colorful cinematic environment, expressive faces, detailed background, soft cinematic lighting, appealing composition, family-friendly animation, high quality.`,

          videoPrompt:
            `Create a ${secondsPerScene}-second ${style} animation. ` +
            `${description} ` +
            `Use smooth natural character movement, expressive facial animation, gentle body motion, cinematic camera movement and consistent character design. ` +
            `Characters must remain visually consistent with previous scenes. ` +
            `Family-friendly storytelling, polished animation and clear visual action.`,

          voiceOver: generateVoiceOver(
            i,
            totalScenes,
            description
          ),

          musicSfx: generateMusicSfx(
            i,
            totalScenes
          ),
        });
      }

      const title =
        projectType === "Educational Cartoon"
          ? "The Amazing Cartoon Lesson"
          : projectType === "Kids Story"
          ? "The Little Adventure"
          : projectType === "Short Cartoon"
          ? "A Tiny Cartoon Adventure"
          : "The Great Cartoon Adventure";

      const newProject: StoryProject = {
        title,
        prompt: prompt.trim(),
        type: projectType,
        duration,
        language,
        style,
        characters,
        scenes,
        createdAt: new Date().toISOString(),
      };

      setProject(newProject);

      localStorage.setItem(
        "ai-cartoon-current-project",
        JSON.stringify(newProject)
      );

      setIsGenerating(false);
    }, 800);
  };

  const loadProject = () => {
    const saved = localStorage.getItem(
      "ai-cartoon-current-project"
    );

    if (!saved) {
      alert("No saved project found.");
      return;
    }

    try {
      const parsed = JSON.parse(saved) as Record<
        string,
        unknown
      >;

      const rawCharacters = Array.isArray(
        parsed.characters
      )
        ? parsed.characters
        : [];

      const characters: CharacterProfile[] =
        rawCharacters.map((item, index) => {
          if (typeof item === "string") {
            return {
              name: item,
              role:
                index === 0
                  ? "Main Character"
                  : "Supporting Character",
              personality:
                "Friendly, expressive and helpful",
              appearance:
                "Consistent cartoon character design",
            };
          }

          if (
            item &&
            typeof item === "object"
          ) {
            const value = item as Record<
              string,
              unknown
            >;

            return {
              name:
                typeof value.name === "string"
                  ? value.name
                  : `Character ${index + 1}`,
              role:
                typeof value.role === "string"
                  ? value.role
                  : "Supporting Character",
              personality:
                typeof value.personality === "string"
                  ? value.personality
                  : "Friendly and expressive",
              appearance:
                typeof value.appearance === "string"
                  ? value.appearance
                  : "Consistent cartoon character design",
            };
          }

          return {
            name: `Character ${index + 1}`,
            role: "Supporting Character",
            personality:
              "Friendly and expressive",
            appearance:
              "Consistent cartoon character design",
          };
        });

      const rawScenes = Array.isArray(
        parsed.scenes
      )
        ? parsed.scenes
        : [];

      const scenes: StoryScene[] =
        rawScenes.map((item, index) => {
          if (
            item &&
            typeof item === "object"
          ) {
            const value = item as Record<
              string,
              unknown
            >;

            return {
              number:
                typeof value.number === "number"
                  ? value.number
                  : index + 1,
              title:
                typeof value.title === "string"
                  ? value.title
                  : `Scene ${index + 1}`,
              description:
                typeof value.description === "string"
                  ? value.description
                  : "",
              duration:
                typeof value.duration === "number"
                  ? value.duration
                  : 10,
              visualPrompt:
                typeof value.visualPrompt === "string"
                  ? value.visualPrompt
                  : "",
              videoPrompt:
                typeof value.videoPrompt === "string"
                  ? value.videoPrompt
                  : "",
              voiceOver:
                typeof value.voiceOver === "string"
                  ? value.voiceOver
                  : "",
              musicSfx:
                typeof value.musicSfx === "string"
                  ? value.musicSfx
                  : "Background music and suitable cartoon sound effects.",
            };
          }

          return {
            number: index + 1,
            title: `Scene ${index + 1}`,
            description: "",
            duration: 10,
            visualPrompt: "",
            videoPrompt: "",
            voiceOver: "",
            musicSfx:
              "Background music and suitable cartoon sound effects.",
          };
        });

      const loadedProject: StoryProject = {
        title:
          typeof parsed.title === "string"
            ? parsed.title
            : "Untitled Cartoon",
        prompt:
          typeof parsed.prompt === "string"
            ? parsed.prompt
            : "",
        type:
          typeof parsed.type === "string"
            ? parsed.type
            : "Cartoon Story",
        duration:
          typeof parsed.duration === "string"
            ? parsed.duration
            : "5 Minutes",
        language:
          typeof parsed.language === "string"
            ? parsed.language
            : "English",
        style:
          typeof parsed.style === "string"
            ? parsed.style
            : "3D Cartoon",
        characters,
        scenes,
        createdAt:
          typeof parsed.createdAt === "string"
            ? parsed.createdAt
            : new Date().toISOString(),
      };

      setProject(loadedProject);
    } catch {
      alert("Saved project could not be loaded.");
    }
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied successfully.");
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  };

  const downloadProject = () => {
    if (!project) return;

    const lines: string[] = [];

    lines.push(project.title);
    lines.push("=".repeat(project.title.length));
    lines.push("");
    lines.push(`Type: ${project.type}`);
    lines.push(`Duration: ${project.duration}`);
    lines.push(`Language: ${project.language}`);
    lines.push(`Style: ${project.style}`);
    lines.push("");
    lines.push("STORY IDEA");
    lines.push(project.prompt);
    lines.push("");
    lines.push("CHARACTER BIBLE");
    lines.push("");

    project.characters.forEach((character) => {
      lines.push(`Name: ${character.name}`);
      lines.push(`Role: ${character.role}`);
      lines.push(`Personality: ${character.personality}`);
      lines.push(`Appearance: ${character.appearance}`);
      lines.push("");
    });

    lines.push("SCENE PRODUCTION PLAN");
    lines.push("");

    project.scenes.forEach((scene) => {
      lines.push(`SCENE ${scene.number}: ${scene.title}`);
      lines.push(`Duration: ${scene.duration}s`);
      lines.push(`Description: ${scene.description}`);
      lines.push(`Visual Prompt: ${scene.visualPrompt}`);
      lines.push(`Video Prompt: ${scene.videoPrompt}`);
      lines.push(`Voice Over: ${scene.voiceOver}`);
      lines.push(`Music / SFX: ${scene.musicSfx}`);
      lines.push("");
    });

    const blob = new Blob(
      [lines.join("\n")],
      { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${project.title
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase()}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const newProject = () => {
    setProject(null);
    setPrompt("");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">🎬</div>

          <div>
            <h1>AI Cartoon Studio</h1>
            <span>Creative Production Suite</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            ✨ Story Creator
          </button>

          <button
            className="nav-item"
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
            <strong>AI Creator</strong>
            <span>Studio Workspace</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <span>AI Cartoon Studio</span>
          <small>Production Workspace</small>
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
                  Turn a simple idea into a complete
                  cartoon production plan.
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
                      <h3>Story Idea</h3>
                      <p>
                        Describe the cartoon you want
                        to create.
                      </p>
                    </div>
                  </div>
                </div>

                <textarea
                  className="story-input"
                  value={prompt}
                  onChange={(event) =>
                    setPrompt(event.target.value)
                  }
                  placeholder="Example: A brave little rabbit discovers a magical forest and helps the forest animals..."
                />

                <div className="quick-prompts">
                  <span>Quick ideas:</span>

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
                      <h3>Production Settings</h3>
                      <p>
                        Configure your cartoon project.
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
                    <option>1 Minute</option>
                    <option>5 Minutes</option>
                    <option>10 Minutes</option>
                    <option>20 Minutes</option>
                    <option>30 Minutes</option>
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
                    <option>English</option>
                    <option>Urdu</option>
                    <option>Hindi</option>
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
                    <option>3D Cartoon</option>
                    <option>2D Cartoon</option>
                    <option>Anime</option>
                    <option>Storybook</option>
                    <option>Pixar Inspired</option>
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
                    <h3>Production Workflow</h3>
                    <p>
                      Your generated project will
                      include everything needed for
                      production.
                    </p>
                  </div>
                </div>
              </div>

              <div className="workflow-grid">
                <div className="workflow-card">
                  <span>✍️</span>
                  <strong>Story</strong>
                  <p>
                    Complete structured story
                  </p>
                </div>

                <div className="workflow-card">
                  <span>👥</span>
                  <strong>Characters</strong>
                  <p>
                    Consistent character bible
                  </p>
                </div>

                <div className="workflow-card">
                  <span>🎨</span>
                  <strong>Visual Prompts</strong>
                  <p>
                    Scene-by-scene image prompts
                  </p>
                </div>

                <div className="workflow-card">
                  <span>🎥</span>
                  <strong>Video Prompts</strong>
                  <p>
                    Animation-ready instructions
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

                <h2>{project.title}</h2>

                <p>{project.prompt}</p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  className="load-button"
                  onClick={downloadProject}
                >
                  ⬇ Export Project
                </button>

                <button
                  className="new-project-button"
                  onClick={newProject}
                >
                  + New Project
                </button>
              </div>
            </header>

            <section className="project-stats">
              <div>
                <span>CONTENT TYPE</span>
                <strong>{project.type}</strong>
              </div>

              <div>
                <span>DURATION</span>
                <strong>{project.duration}</strong>
              </div>

              <div>
                <span>LANGUAGE</span>
                <strong>{project.language}</strong>
              </div>

              <div>
                <span>SCENES</span>
                <strong>{project.scenes.length}</strong>
              </div>
            </section>

            <section className="characters-section">
              <div className="section-heading">
                <div>
                  <span className="section-number">
                    01
                  </span>

                  <div>
                    <h3>Character Bible</h3>
                    <p>
                      Keep these details consistent
                      across every generated scene.
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
                      <span>👤</span>

                      <div>
                        <strong>
                          {character.name}
                        </strong>

                        <small>
                          {character.role}
                        </small>

                        <p>
                          <b>Personality:</b>{" "}
                          {character.personality}
                        </p>

                        <p>
                          <b>Appearance:</b>{" "}
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
                    <h3>Scene Production Plan</h3>
                    <p>
                      Every scene includes visual,
                      video, voice and sound
                      instructions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="scene-list">
                {project.scenes.map((scene) => (
                  <article
                    className="scene-card"
                    key={scene.number}
                  >
                    <div className="scene-header">
                      <div>
                        <span>
                          SCENE {scene.number}
                        </span>

                        <h4>{scene.title}</h4>
                      </div>

                      <strong>
                        {scene.duration}s
                      </strong>
                    </div>

                    <p className="scene-description">
                      {scene.description}
                    </p>

                    <div className="production-grid">
                      <div className="production-box">
                        <div className="production-heading">
                          <strong>
                            🎨 Visual Prompt
                          </strong>

                          <button
                            onClick={() =>
                              copyText(
                                scene.visualPrompt
                              )
                            }
                          >
                            Copy
                          </button>
                        </div>

                        <p>
                          {scene.visualPrompt}
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
                                scene.videoPrompt
                              )
                            }
                          >
                            Copy
                          </button>
                        </div>

                        <p>
                          {scene.videoPrompt}
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
                                scene.voiceOver
                              )
                            }
                          >
                            Copy
                          </button>
                        </div>

                        <p>
                          {scene.voiceOver}
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
                                scene.musicSfx
                              )
                            }
                          >
                            Copy
                          </button>
                        </div>

                        <p>
                          {scene.musicSfx}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;