import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import type { Components } from "react-markdown";

interface MarkdownContentProps {
  content: string;
}

const components: Components = {
  hr() {
    return <hr className="my-6! border-t! border-border!" />;
  },
};

const MarkdownContent = ({ content }: MarkdownContentProps) => (
  <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground/80 prose-p:leading-relaxed prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[hsl(var(--code-bg))] prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-table:text-xs prose-th:bg-secondary/50 prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-td:border-border prose-th:border-border prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-li:text-foreground/80 [&_h2]:border-b [&_h2]:border-border [&_h2]:pb-2 [&_ul]:list-disc [&_ul_ul]:list-[circle] [&_ul_ul_ul]:list-[square]">
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkFrontmatter]} components={components}>{content}</ReactMarkdown>
  </div>
);

export default MarkdownContent;
