import { highlight } from "sugar-high";
import { css, python } from "sugar-high/presets";
import { CopyCodeButton } from "@/components/content/copy-code-button";

type CodeBlockProps = {
  code: string;
  language?: string;
};

const languageLabels: Record<string, string> = {
  js: "JavaScript",
  jsx: "JSX",
  ts: "TypeScript",
  tsx: "TSX",
  css: "CSS",
  py: "Python",
  python: "Python",
  json: "JSON",
  mdx: "MDX",
  html: "HTML",
  bash: "Bash",
  sh: "Shell",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderHighlightedCode(code: string, language?: string) {
  const normalizedLanguage = language?.toLowerCase();

  if (normalizedLanguage === "css") {
    return highlight(code, { ...css });
  }

  if (normalizedLanguage === "python" || normalizedLanguage === "py") {
    return highlight(code, { ...python });
  }

  if (
    !normalizedLanguage ||
    ["js", "jsx", "ts", "tsx", "json", "mdx", "html"].includes(normalizedLanguage)
  ) {
    return highlight(code);
  }

  return code
    .split("\n")
    .map((line) => `<span class="sh__line">${escapeHtml(line) || " "}</span>`)
    .join("\n");
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const normalizedLanguage = language?.toLowerCase();
  const label = normalizedLanguage ? languageLabels[normalizedLanguage] ?? normalizedLanguage.toUpperCase() : "Code";
  const highlighted = renderHighlightedCode(code, normalizedLanguage);

  return (
    <figure className="code-block not-prose">
      <figcaption className="code-block__header">
        <span className="code-block__language">{label}</span>
        <CopyCodeButton code={code} />
      </figcaption>
      <pre className="code-block__pre">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </figure>
  );
}
