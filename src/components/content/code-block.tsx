import { codeToHtml } from "shiki";
import { CodeBlockFrame } from "@/components/content/code-block-frame";

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
  shell: "Shell",
  zsh: "Shell",
  yaml: "YAML",
  yml: "YAML",
};

const languageAliases: Record<string, string> = {
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  css: "css",
  py: "python",
  python: "python",
  json: "json",
  mdx: "mdx",
  html: "html",
  bash: "bash",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  yaml: "yaml",
  yml: "yaml",
};

function normalizeLanguage(language?: string) {
  const normalizedLanguage = language?.toLowerCase();
  return normalizedLanguage ? (languageAliases[normalizedLanguage] ?? normalizedLanguage) : "text";
}

async function renderHighlightedCode(code: string, language?: string) {
  const normalizedLanguage = normalizeLanguage(language);

  try {
    return await codeToHtml(code, {
      lang: normalizedLanguage,
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    });
  } catch {
    return await codeToHtml(code, {
      lang: "text",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    });
  }
}

export async function CodeBlock({ code, language }: CodeBlockProps) {
  const normalizedLanguage = language?.toLowerCase();
  const label = normalizedLanguage
    ? (languageLabels[normalizedLanguage] ?? normalizedLanguage.toUpperCase())
    : "Code";
  const highlighted = await renderHighlightedCode(code, normalizedLanguage);
  const lineCount = code.split("\n").length;

  return (
    <CodeBlockFrame code={code} label={label} highlighted={highlighted} lineCount={lineCount} />
  );
}
