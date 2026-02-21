
import { projects, chapters, scenes } from "../../../stores.svelte";

import { smartenText, toFileName } from "../../../utils";

const toMarkdown = text => {
  return text
    .replace(/(_|\*)/g, "\\$1") // escape Markdown special characters
    .replace(/<br\W*>/gi, "\n") // line breaks
    .replace(/<(i|em)>/gi, "_") // italic
    .replace(/<\/(i|em)>/gi, "_")
    .replace(/<(b|strong)>/gi, "**") // bold
    .replace(/<\/(b|strong)>/gi, "**")
    .replace(/&gt;/g, ">") // unescape HTML special characters
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
};

const parser = new DOMParser();

/**
 * Convert an HTML string to Markdown by walking the DOM nodes.
 */
const htmlToMarkdown = html => {
  if (!html) return "";
  const doc = parser.parseFromString(html, "text/html");
  const nodes = doc.body.childNodes;
  let result = "";

  for (const node of nodes) {
    if (node.nodeType !== 1) continue; // skip non-element nodes
    const tag = node.tagName.toLowerCase();
    const text = node.innerHTML.replace(/(\s|<br\s*\/?>)+$/, "").trim();

    switch (tag) {
      case "h1":
      case "h2":
      case "h3":
        result += `### ${toMarkdown(smartenText(text))}\n\n`;
        break;
      case "blockquote":
        // blockquote may contain <p> children
        result += `> ${toMarkdown(smartenText(node.textContent.trim()))}\n\n`;
        break;
      case "pre":
        result += `\`\`\`\n${toMarkdown(node.textContent)}\n\`\`\`\n\n`;
        break;
      case "p":
      default:
        result += `${toMarkdown(smartenText(text))}\n\n`;
        break;
    }
  }

  return result;
};

export default async project => {
  const sceneMapper = currentScene => htmlToMarkdown(currentScene.content);

  const chapterMapper = currentChapter => {
    return (
      `## ${toMarkdown(currentChapter.title)}\n\n` +
      scenes
        .filter(scene => scene.chapter == currentChapter.id && scene.content)
        .sort(compare)
        .map(sceneMapper)
        .join("***\n\n")
    );
  };

  const title = projects.find(e => e.id == project).title;
  const frontpage = `# ${toMarkdown(smartenText(title))}\n\n`;
  const toc = chapters
    .filter(e => e.project == project)
    .sort(compare)
    .reduce(
      (prev, curr) =>
        `${prev}- [${curr.title}](#${curr.title.replace(
          /[^a-zA-Z0-9]/g,
          "-"
        )})\n`,
      ""
    );

  const contents = chapters
    .filter(e => e.project == project)
    .sort(compare)
    .map(chapterMapper)
    .join("\n\n");

  const document = frontpage + toc + contents;

  return {
    document: document,
    filename: toFileName(title) + ".md",
  };
};

const compare = (a, b) => {
  if (a.order < b.order) {
    return -1;
  }
  if (a.order > b.order) {
    return 1;
  }
  return 0;
};
