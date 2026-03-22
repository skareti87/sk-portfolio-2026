'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import type { BlogPost } from '@/lib/blog';

interface BlogArticleProps {
  post: BlogPost;
}

export function BlogArticle({ post }: BlogArticleProps) {
  return (
    <article className="max-w-3xl mx-auto">
      {/* Back link */}
      <div className="mb-8">
        <Link
          href="/#blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="default" size="sm">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
          {post.title}
        </h1>

        <p className="text-lg text-gray-800 dark:text-gray-300 mb-4 leading-relaxed">
          {post.description}
        </p>

        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-500">
          <Calendar className="w-4 h-4" />
          {formatDate(post.date)}
        </div>
      </header>

      {/* Divider */}
      <hr className="border-gray-200 dark:border-gray-800 mb-10" />

      {/* Markdown content */}
      <div className="blog-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Footer back link */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <Link
          href="/#blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </article>
  );
}
