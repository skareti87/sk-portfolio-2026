import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import type { BlogPostMeta } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPostMeta;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group border-b border-gray-200 dark:border-gray-800 py-6 last:border-0">
      <div className="flex flex-col gap-2">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="default" size="sm">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <Link
          href={`/blog/${post.slug}`}
          className="group/link inline-block"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors leading-snug">
            {post.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
          {post.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-1">
          <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.date)}
          </span>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Read more
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
