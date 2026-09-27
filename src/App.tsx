import { useState } from "react";
import "./App.css";

type StoryScene = {
  number: number;
  title: string;
  description: string;
  duration: number;
};

type StoryProject = {
  title: string;
  prompt: string;
  type: string;
  duration: string;
  language: string;
  style: string;
  characters: string[];
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

    return 30;
  };

  const generateCharacters = (storyPrompt: string) => {
    const lower = storyPrompt.toLowerCase();

    const characters: string[] = [];

    if (lower.includes("rabbit") || lower.includes("bunny")) {
      characters.push("Little Rabbit");
    }

    if (lower.includes("bear")) {
      characters.push("Friendly Bear");
    }

    if (lower.includes("fox")) {
      characters.push("Clever Fox");
    }

    if (lower.includes("cat")) {
      characters.push("Curious Cat");
    }

    if (lower.includes("dog")) {
      characters.push("Happy Dog");
    }

    if (lower.includes("bird")) {
      characters.push("Little Bird");
    }

    if (lower.includes("lion")) {
      characters.push("Young Lion");
    }

    if (lower.includes("princess")) {
      characters.push("Little Princess");
    }

    if (lower.includes("dragon")) {
      characters.push("Friendly Dragon");
    }

    if (characters.length === 0) {
      characters.push("Main Character");
      characters.push("Best Friend");
      characters.push("Story Guide");
    }

    return characters;
  };

  const generateSceneDescription = (
    sceneNumber: number,
    totalScenes: number,
    storyPrompt: string
  ) => {
    const progress = sceneNumber / totalScenes;

    if (sceneNumber === 1) {
      return `Opening scene introducing the world and the main character. Story idea: ${storyPrompt}`;
    }

    if (progress < 0.15) {
      return `Introduce the main character's normal life and establish the setting. The story begins to develop around: ${storyPrompt}`;
    }

    if (progress < 0.35) {
      return `The main character discovers a new problem, mystery, adventure, or challenge connected to the story idea.`;
    }

    if (progress < 0.55) {
      return `The adventure becomes more exciting. The characters explore the situation and face new obstacles.`;
    }

    if (progress < 0.75) {
      return `The main challenge becomes serious. The characters must make an important decision and work together.`;
    }

    if (progress < 0.9) {
      return `The main problem begins to resolve. The characters learn an important lesson through their adventure.`;
    }

    if (sceneNumber === totalScenes) {
      return `Final scene. The story reaches a satisfying ending and leaves the audience with a positive lesson.`;
    }

    return `The characters move toward the final solution while the story builds toward its conclusion.`;
  };

  const generateStory = () => {
    if (!prompt.trim()) {
      alert("Please enter a story or poem idea first.");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const totalScenes = getSceneCount();

      const characters = generateCharacters(prompt);

      const scenes: StoryScene[] = [];

      const secondsPerScene = Math.max(
        10,
        Math.round((getMinutes() * 60) / totalScenes)
      );

      for (let i = 1; i <= totalScenes; i++) {
        scenes.push({
          number: i,
          title:
            i === 1
              ? "The Beginning"
              : i === totalScenes
              ? "The Happy Ending"
              : `Adventure Scene ${i}`,
          description: generateSceneDescription(
            i,
            totalScenes,
            prompt
          ),
          duration: secondsPerScene,
        });
      }

      const title =
        projectType === "Kids Poem"
          ? "A Wonderful Little Adventure"
          : projectType === "Nursery Rhyme"
          ? "The Magical Day"
          : "The Magical Adventure";

      const newProject: StoryProject = {
        title,
        prompt,
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
    }, 1200);
  };

  const loadProject = () => {
    const saved = localStorage.getItem("ai-cartoon-current-project");

    if (!saved) {
      alert("No saved project found.");
      return;
    }

    setProject(JSON.parse(saved));
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <span>🎬</span>

          <div>
            <h2>AI Cartoon</h2>
            <p>Studio</p>
          </div>
        </div>

        <nav>
          <button className="nav-item active">
            🏠 Dashboard
          </button>

          <button className="nav-item">
            📁 My Projects
          </button>

          <button className="nav-item">
            🧍 Characters
          </button>

          <button className="nav-item">
            🎨 Assets
          </button>

          <button className="nav-item">
            🎵 Music & SFX
          </button>

          <button className="nav-item">
            ⚙️ Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="free-box">
            <strong>FREE MODE</strong>
            <span>Local project storage enabled</span>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>AI Cartoon Studio</h1>

            <p>
              Create original stories, scenes and complete cartoon
              projects.
            </p>
          </div>

          <div className="status">
            <span className="status-dot"></span>
            System Ready
          </div>
        </header>

        {!project ? (
          <section className="creator">
            <div className="story-card">
              <div className="card-title">
                <div>
                  <h2>✨ Create Your Story</h2>

                  <p>
                    Enter your idea and turn it into a complete
                    scene-by-scene project.
                  </p>
                </div>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: A little rabbit discovers a magical forest and learns why sharing with friends is important..."
              />

              <div className="quick-prompts">
                <button
                  onClick={() =>
                    setPrompt(
                      "A little rabbit discovers a magical forest and learns the importance of friendship."
                    )
                  }
                >
                  🐰 Rabbit Story
                </button>

                <button
                  onClick={() =>
                    setPrompt(
                      "A colorful nursery rhyme about friendly animals living together."
                    )
                  }
                >
                  🎵 Nursery Rhyme
                </button>

                <button
                  onClick={() =>
                    setPrompt(
                      "A bedtime story about a little bear who learns to be brave."
                    )
                  }
                >
                  🌙 Bedtime Story
                </button>

                <button
                  onClick={() =>
                    setPrompt(
                      "An educational cartoon teaching children about the planets."
                    )
                  }
                >
                  🚀 Educational
                </button>
              </div>
            </div>

            <div className="settings-card">
              <h2>🎬 Video Settings</h2>

              <label>Content Type</label>

              <select
                value={projectType}
                onChange={(e) =>
                  setProjectType(e.target.value)
                }
              >
                <option>Cartoon Story</option>
                <option>Kids Poem</option>
                <option>Nursery Rhyme</option>
                <option>Bedtime Story</option>
                <option>Educational Story</option>
                <option>Funny Cartoon</option>
                <option>Animal Adventure</option>
              </select>

              <label>Duration</label>

              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option>1 Minute</option>
                <option>5 Minutes</option>
                <option>10 Minutes</option>
                <option>20 Minutes</option>
                <option>30 Minutes</option>
              </select>

              <label>Language</label>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value)
                }
              >
                <option>English</option>
                <option>Urdu</option>
                <option>Hindi</option>
                <option>Arabic</option>
                <option>Spanish</option>
              </select>

              <label>Visual Style</label>

              <select
                value={style}
                onChange={(e) =>
                  setStyle(e.target.value)
                }
              >
                <option>3D Cartoon</option>
                <option>2D Cartoon</option>
                <option>Anime</option>
                <option>Storybook</option>
                <option>Clay Animation</option>
                <option>Educational Cartoon</option>
              </select>

              <button
                className="create-button"
                onClick={generateStory}
                disabled={isGenerating}
              >
                {isGenerating
                  ? "⏳ CREATING STORY..."
                  : "✨ CREATE STORY"}
              </button>

              <button
                className="load-button"
                onClick={loadProject}
              >
                📂 LOAD SAVED PROJECT
              </button>
            </div>
          </section>
        ) : (
          <section className="project-view">
            <div className="project-header">
              <div>
                <span className="project-label">
                  STORY PROJECT
                </span>

                <h1>{project.title}</h1>

                <p>{project.prompt}</p>
              </div>

              <button
                className="new-project-button"
                onClick={() => setProject(null)}
              >
                + New Project
              </button>
            </div>

            <div className="project-stats">
              <div>
                <span>Content</span>
                <strong>{project.type}</strong>
              </div>

              <div>
                <span>Duration</span>
                <strong>{project.duration}</strong>
              </div>

              <div>
                <span>Language</span>
                <strong>{project.language}</strong>
              </div>

              <div>
                <span>Scenes</span>
                <strong>{project.scenes.length}</strong>
              </div>
            </div>

            <div className="characters-section">
              <h2>🧍 Characters</h2>

              <div className="character-list">
                {project.characters.map((character) => (
                  <div
                    className="character-card"
                    key={character}
                  >
                    <span>👤</span>
                    {character}
                  </div>
                ))}
              </div>
            </div>

            <div className="scenes-section">
              <div className="section-heading">
                <div>
                  <h2>🎬 Scene Plan</h2>

                  <p>
                    Your video has been divided into individual
                    production scenes.
                  </p>
                </div>
              </div>

              <div className="scene-list">
                {project.scenes.map((scene) => (
                  <div
                    className="scene-card"
                    key={scene.number}
                  >
                    <div className="scene-number">
                      {scene.number}
                    </div>

                    <div className="scene-info">
                      <h3>{scene.title}</h3>

                      <p>{scene.description}</p>
                    </div>

                    <div className="scene-duration">
                      {scene.duration}s
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;