import { get } from "svelte/store";

import { chapters, scenes } from "../../../stores";

export default class Export {
  constructor(id) {
    this.projectId = id;
  }
  async fetchData() {
    const sceneMapper = currentScene => currentScene.content || "";
    const chapterMapper = currentChapter => {
      return {
        title: currentChapter.title,
        data: get(scenes)
          .filter(scene => scene.chapter == currentChapter.id && scene.content)
          .sort(this.compare)
          .map(sceneMapper)
          .join("<hr />"),
      };
    };
    return get(chapters)
      .filter(e => e.project == this.projectId)
      .sort(this.compare)
      .map(chapterMapper);
  }
  compare(a, b) {
    if (a.order < b.order) {
      return -1;
    }
    if (a.order > b.order) {
      return 1;
    }
    return 0;
  }
}
