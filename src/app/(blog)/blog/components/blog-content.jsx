"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import Image from "next/image";
import remarkBreaks from "remark-breaks";

export function BlogContent({ content }) {

  return (
    <>
      <div className="">
        <div className="flex-1 min-w-0">
          <article className="prose dark:prose-invert max-w-none">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw, rehypeSlug]}
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                img: function ({ ...props }) {
                  return (
                    <Image
                      className={`rounded-xl object-cover w-full max-w-[960px]`}
                      src={props.src}
                      alt={props.alt ? props.alt : "arynecabatan.com image"}
                      width="960"
                      height="640"
                    />
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </>
  );
}
