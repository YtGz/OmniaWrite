import { migrateBlocksToHtml } from "./utils";

// Migrate legacy block JSON scene content to HTML strings
(function migrateSceneContent() {
  try {
    const raw = localStorage.getItem("scenes");
    if (!raw) return;
    const scenesData = JSON.parse(raw);
    let changed = false;
    for (const scene of scenesData) {
      if (scene.content && typeof scene.content === "object" && scene.content.blocks) {
        scene.content = migrateBlocksToHtml(scene.content);
        changed = true;
      }
    }
    if (changed) {
      localStorage.setItem("scenes", JSON.stringify(scenesData));
    }
  } catch (e) {
    // Ignore migration errors on corrupt data
  }
})();

const defaultIntern = {
  version: "1.1.0",
  installed: false,
};

const defaultSettings = {
  theme: "dark",
  language: "en",
  autosave: true,
  spellCheck: true,
  lastLocation: true,
};

if (localStorage.getItem("intern") === null) {
  localStorage.setItem("intern", JSON.stringify(defaultIntern));
  localStorage.setItem("settings", JSON.stringify(defaultSettings));
  localStorage.setItem("state", "{}");
  localStorage.setItem("projects", "[]");
  localStorage.setItem("chapters", "[]");
  localStorage.setItem("scenes", "[]");
  localStorage.setItem("tabs", "[]");
  localStorage.setItem("cards", "[]");
}

// --- ID generation ---

const getRandomNumber = () => {
  const generateId = () => Math.floor(Math.random() * 999999);

  let id = generateId();
  while (doesIdExist(id)) {
    id = generateId();
  }

  return id;
};

const doesIdExist = id => {
  if (projects.some(p => p.id === id)) return true;
  if (chapters.some(c => c.id === id)) return true;
  if (scenes.some(s => s.id === id)) return true;
  if (tabs.some(t => t.id === id)) return true;
  if (cards.some(c => c.id === id)) return true;
  return false;
};

// --- Stores ---

function loadJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

function loadJSONArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

const updateLocalTimestamp = () => {
  appState.lastLocalSave = (+new Date() / 1000).toFixed();
};

// --- appState ---

export let appState = $state(loadJSON("state"));

appState.setCurrentTitle = title => {
  appState.currentTitle = title;
};

appState.setCurrentProject = project => {
  appState.currentProject = project;
};

appState.setCurrentLocation = location => {
  appState.lastLocation = location;
};

appState.updateCloudTimestamp = timestamp => {
  appState.lastCloudSave = timestamp.toFixed();
  appState.lastLocalSave = timestamp.toFixed();
};

appState.updateLocalTimestamp = () => {
  appState.lastLocalSave = (+new Date() / 1000).toFixed();
};

appState.setLogin = bool => {
  appState.isUserLoggedIn = bool;
};

// --- projects ---

export let projects = $state(loadJSONArray("projects"));

projects.createProject = (title, author, description, publisher, language) => {
  updateLocalTimestamp();
  const newProjectId = getRandomNumber();
  projects.push({
    id: newProjectId,
    title,
    author,
    description,
    publisher,
    language,
  });
  return newProjectId;
};

projects.removeProject = id => {
  updateLocalTimestamp();
  const idx = projects.findIndex(p => p.id === id);
  if (idx !== -1) projects.splice(idx, 1);
};

projects.setProject = project => {
  updateLocalTimestamp();
  const idx = projects.findIndex(p => p.id == project.id);
  if (idx !== -1) projects[idx] = project;
};

projects.updateProjectTimestamp = id => {
  const idx = projects.findIndex(p => p.id == id);
  if (idx !== -1) projects[idx].lastOpen = (+new Date() / 1000).toFixed();
};

// --- chapters ---

export let chapters = $state(loadJSONArray("chapters"));

chapters.createChapter = (project, title) => {
  updateLocalTimestamp();
  chapters.push({
    id: getRandomNumber(),
    project,
    title,
    order: chapters.length,
    ui: { open: true },
  });
};

chapters.setChapterTitle = (id, title) => {
  updateLocalTimestamp();
  const idx = chapters.findIndex(c => c.id == id);
  if (idx !== -1) chapters[idx].title = title;
};

chapters.setChapterOrder = (id, order) => {
  updateLocalTimestamp();
  const idx = chapters.findIndex(c => c.id == id);
  if (idx !== -1) chapters[idx].order = order;
};

chapters.removeChapter = id => {
  updateLocalTimestamp();
  const idx = chapters.findIndex(c => c.id === id);
  if (idx !== -1) chapters.splice(idx, 1);
};

chapters.removeAllChapters = id => {
  updateLocalTimestamp();
  for (let i = chapters.length - 1; i >= 0; i--) {
    if (chapters[i].project === id) chapters.splice(i, 1);
  }
};

chapters.toggleChapterInSidebar = id => {
  updateLocalTimestamp();
  const idx = chapters.findIndex(c => c.id == id);
  if (idx !== -1) chapters[idx].ui.open = !chapters[idx].ui.open;
};

// --- scenes ---

export let scenes = $state(loadJSONArray("scenes"));

scenes.createScene = (chapter, title) => {
  const id = getRandomNumber();
  updateLocalTimestamp();
  scenes.push({
    id,
    chapter,
    title,
    order: scenes.length,
    lastEdit: (+new Date() / 1000).toFixed(),
  });
  return id;
};

scenes.setSceneTitle = (id, title) => {
  updateLocalTimestamp();
  const idx = scenes.findIndex(c => c.id == id);
  if (idx !== -1) {
    scenes[idx].title = title;
    scenes[idx].lastEdit = (+new Date() / 1000).toFixed();
  }
};

scenes.setSceneOrder = (id, order) => {
  updateLocalTimestamp();
  const idx = scenes.findIndex(c => c.id == id);
  if (idx !== -1) scenes[idx].order = order;
};

scenes.setSceneContent = (id, content) => {
  updateLocalTimestamp();
  const idx = scenes.findIndex(c => c.id == id);
  if (idx !== -1) {
    scenes[idx].content = content;
    scenes[idx].lastEdit = (+new Date() / 1000).toFixed();
  }
};

scenes.moveScene = (id, chapter) => {
  updateLocalTimestamp();
  const idx = scenes.findIndex(c => c.id == id);
  if (idx !== -1) scenes[idx].chapter = chapter;
};

scenes.removeScene = id => {
  updateLocalTimestamp();
  const idx = scenes.findIndex(s => s.id === id);
  if (idx !== -1) scenes.splice(idx, 1);
};

scenes.removeAllScenes = id => {
  updateLocalTimestamp();
  for (let i = scenes.length - 1; i >= 0; i--) {
    if (scenes[i].chapter === id) scenes.splice(i, 1);
  }
};

// --- tabs ---

export let tabs = $state(loadJSONArray("tabs"));

tabs.createTab = (project, link) => {
  tabs.push({
    id: getRandomNumber(),
    project,
    link,
  });
};

tabs.removeTab = id => {
  const idx = tabs.findIndex(t => t.id === id);
  if (idx !== -1) tabs.splice(idx, 1);
};

// --- cards ---

export let cards = $state(loadJSONArray("cards"));

cards.createCard = (project, title, content, showTooltip) => {
  cards.push({
    id: getRandomNumber(),
    project,
    title,
    content,
    showTooltip,
  });
};

cards.setCard = card => {
  updateLocalTimestamp();
  const idx = cards.findIndex(c => c.id == card.id);
  if (idx !== -1) cards[idx] = card;
};

cards.removeCard = id => {
  const idx = cards.findIndex(c => c.id === id);
  if (idx !== -1) cards.splice(idx, 1);
};

// --- ui ---

export let ui = $state({
  focus: false,
  support: {
    show: false,
  },
});

// --- settings ---

export let settings = $state(
  JSON.parse(localStorage.getItem("settings") || JSON.stringify(defaultSettings))
);

// --- intern ---

export let intern = $state(
  JSON.parse(localStorage.getItem("intern") || JSON.stringify(defaultIntern))
);

// --- Persistence via $effect ---

$effect.root(() => {
  $effect(() => {
    localStorage.setItem("state", JSON.stringify($state.snapshot(appState)));
  });
  $effect(() => {
    localStorage.setItem("projects", JSON.stringify($state.snapshot(projects)));
  });
  $effect(() => {
    localStorage.setItem("chapters", JSON.stringify($state.snapshot(chapters)));
  });
  $effect(() => {
    localStorage.setItem("scenes", JSON.stringify($state.snapshot(scenes)));
  });
  $effect(() => {
    localStorage.setItem("tabs", JSON.stringify($state.snapshot(tabs)));
  });
  $effect(() => {
    localStorage.setItem("cards", JSON.stringify($state.snapshot(cards)));
  });
  $effect(() => {
    localStorage.setItem("settings", JSON.stringify($state.snapshot(settings)));
  });
  $effect(() => {
    localStorage.setItem("intern", JSON.stringify($state.snapshot(intern)));
  });
});
