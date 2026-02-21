
import { chapters, scenes } from "../../../stores.svelte";

export default class Export {
  constructor(id) {
    this.projectId = id;
  }
  async fetchData() {
    const sceneMapper = currentScene => currentScene.content || "";
    const chapterMapper = currentChapter => {
      return {
        title: currentChapter.title,
        data: scenes
          .filter(scene => scene.chapter == currentChapter.id && scene.content)
          .sort(this.compare)
          .map(sceneMapper)
          .join("<hr />"),
      };
    };
    return chapters
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
