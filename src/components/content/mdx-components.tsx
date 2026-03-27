import type { ComponentProps, ReactNode } from "react";
import { isValidElement } from "react";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/content/code-block";
import { MermaidBlock } from "@/components/content/mermaid-block";

type CodeElementProps = ComponentProps<"code"> & {
  children?: ReactNode;
};

function getTextContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map((child) => getTextContent(child)).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getTextContent(node.props.children);
  }

  return "";
}

const components = {
  a: ({ href = "", children, ...props }: ComponentProps<"a">) => {
    const isInternal = href.startsWith("/");
    const isHashLink = href.startsWith("#");
    const isExternalLink = href.startsWith("http://") || href.startsWith("https://");

    if (isInternal) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }

    if (isHashLink) {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    }

    return (
      <a
        href={href}
        target={isExternalLink ? "_blank" : undefined}
        rel={isExternalLink ? "noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
  pre: ({ children }: ComponentProps<"pre">) => {
    if (!isValidElement<CodeElementProps>(children)) {
      return <pre>{children}</pre>;
    }

    const className = children.props.className ?? "";
    const language = className.match(/language-([\w-]+)/)?.[1];
    const code = getTextContent(children.props.children).replace(/\n$/, "");

    if (language === "mermaid") {
      return <MermaidBlock chart={code} />;
    }

    return <CodeBlock code={code} language={language} />;
  },
  table: ({ children, ...props }: ComponentProps<"table">) => (
    <div className="content-table not-prose">
      <table {...props}>{children}</table>
    </div>
  ),
};

export async function MdxContent({ source }: { source: string }) {
  const { content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            { behavior: "wrap", properties: { className: ["anchor-link"] } },
          ],
        ],
      },
    },
    components,
  });

  return <div className="content-prose">{content}</div>;
}
