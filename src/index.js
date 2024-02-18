const visit = require("unist-util-visit");
const fetch = require("node-fetch");

module.exports = async ({ markdownAST }, pluginOptions) => {
  var nodes = [];
  visit(markdownAST, "paragraph", (node) => {
    if (node.children.length != 3) return;
    const textNode = node.children[0];
    const linkNode = node.children[1];
    if (textNode.type !== "text" || textNode.value.trim() !== "embed-url-code")
      return;
    if (linkNode.type !== "link") return;
    const lang = node.children[2].value.trim();
    console.log("Fetching url for code block: " + linkNode.url);
    let sourceUrl = linkNode.url.trim();
    let codeUrl = sourceUrl;
    if (codeUrl.toLowerCase().startsWith("https://github.com")) {
      codeUrl = codeUrl
        .replace("https://github.com", "https://raw.githubusercontent.com")
        .replace("blob/", "");
    }
    if (
      codeUrl.toLowerCase().startsWith("https://gist.githubusercontent.com")
    ) {
      const paths = codeUrl
        .replace("https://gist.githubusercontent.com/", "")
        .split("/");
      sourceUrl =
        "https://gist.github.com/" + paths[0] + "/" + paths[1] + "#" + paths[4];
    }
    const codeNode = {
      type: "code",
      value: codeUrl,
      lang: lang,
    };
    node.children = [
      {
        type: "html",
        value: `
        <p style="color: rebeccapurple;font-style: italic;font-weight: lighter; margin-bottom:0;margin-top:0">
          Embedded from <a href='${sourceUrl}'>${sourceUrl}</a>
        </p>
      `,
      },
      codeNode,
      {
        type: "html",
        value: `
        <p style="color: rebeccapurple;font-style: italic;font-weight: lighter; margin-top:0; font-size: x-small">
          Check the <a href='${sourceUrl}'>original code here</a>
        </p>
      `,
      },
    ];
    nodes.push(codeNode);
  });
  await Promise.all(
    nodes.map(async (node) => {
      node.value = await fetch(node.value).then((response) => response.text());
    })
  );
  return markdownAST;
};
