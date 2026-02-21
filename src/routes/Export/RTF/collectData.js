
import { projects, chapters, scenes } from "../../../stores.svelte";

import { smartenText, toFileName } from "../../../utils";

const toRTF = text => {
  return text
    .replace(/([\\\{\}])/g, "\\$1") // escape RTF special characters
    .replace(/\u00A0/g, "\\~") // non-breaking space
    .replace(/\u00AD/g, "\\-") // optional hyphen
    .replace(/\u2011/g, "\\_") // non-breaking hyphen
    .replace(/[^ -~]/g, c => `\\u${c.charCodeAt()}?`) // escape unicode
    .replace(/<br\W*>/gi, "\\line ") // line breaks
    .replace(/<(i|em)>/gi, "\\i ") // italic
    .replace(/<\/(i|em)>/gi, "\\i0 ")
    .replace(/<(b|strong)>/gi, "\\b ") // bold
    .replace(/<\/(b|strong)>/gi, "\\b0 ")
    .replace(/<u>/gi, "\\ul ") // underline
    .replace(/<\/u>/gi, "\\ul0 ")
    .replace(/&gt;/g, ">") // unescape HTML special characters
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
};

const parser = new DOMParser();

/**
 * Convert an HTML string to RTF by walking the DOM nodes.
 */
const htmlToRTF = html => {
  if (!html) return "";
  const doc = parser.parseFromString(html, "text/html");
  const nodes = doc.body.childNodes;
  let result = "";

  for (const node of nodes) {
    if (node.nodeType !== 1) continue;
    const tag = node.tagName.toLowerCase();
    const text = node.innerHTML.replace(/(\s|<br\s*\/?>)+$/, "");

    switch (tag) {
      case "h1":
      case "h2":
      case "h3":
        result += `{\\f1\\sb300\\sa300\\qc\\fs40\\b ${toRTF(
          smartenText(node.textContent)
        )}\\par}\n`;
        break;
      case "blockquote":
        result += `{\\f0\\fi-200\\li850\\ri600\\lin850\\sb300\\sa300\\i\\u8220"\\~${toRTF(
          smartenText(node.textContent)
        )}\\~\\u8221"\\par}\n`;
        break;
      case "pre":
        result += `{\\f2\\fi0\\li300\\ri300\\lin300\\sb300\\sa300\\box\\brdrhair\\brdrw1\\brdrcf1\\brsp113 ${toRTF(
          node.textContent
        )}\\par}\n`;
        break;
      case "p":
      default:
        result += `{\\f0\\sb50\\sa50\\fi300\\sl276\\slmult1\\qj ${toRTF(
          smartenText(text)
        )}\\par}\n`;
        break;
    }
  }

  return result;
};

export default class Export {
  constructor(id) {
    this.projectId = id;
  }
  async fetchData() {
    const sceneMapper = currentScene => htmlToRTF(currentScene.content);

    const chapterMapper = currentChapter => {
      return (
        `{\\f1\\fs60\\qc\\sa500\\b ${toRTF(currentChapter.title)}\\par}\n` +
        scenes
          .filter(scene => scene.chapter == currentChapter.id && scene.content)
          .sort(this.compare)
          .map(sceneMapper)
          .join("{\\f1\\qc\\sb300\\sa300 * * *\\par}\n")
      );
    };

    const title = projects.find(e => e.id == this.projectId).title;
    const fonts =
      "{\\fonttbl{\\f0\\froman Times New Roman;}{\\f1\\fswiss Arial;}{\\f2\\fmodern Courier New;}}\n";
    const colors = "{\\colortbl;\\red160\\green160\\blue160;}\n";
    const frontpage = `{\\f1\\fs120\\qc\\b\\scaps  \\line  \\line ${toRTF(
      smartenText(title)
    )}\\par}\\page\n`;

    const contents = chapters
      .filter(e => e.project == this.projectId)
      .sort(this.compare)
      .map(chapterMapper)
      .join("\\page\n");

    const document =
      "{\\rtf1\\ansi\\deff0\n" + fonts + colors + frontpage + contents + "}";

    return {
      document: document,
      filename: toFileName(title) + ".rtf",
    };
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
