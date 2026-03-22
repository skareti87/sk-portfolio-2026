import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui';
import { BlogCard } from './BlogCard';
import { getAllBlogPosts } from '@/lib/blog';

interface BlogSectionProps {
  /** Number of posts to show (default: show all) */
  limit?: number;
  /** Show "View all" link */
  showViewAll?: boolean;
}

export function BlogSection({ limit, showViewAll = false }: BlogSectionProps) {
  const allPosts = getAllBlogPosts();
  const posts = limit ? allPosts.slice(0, limit) : allPosts;

  return (
    <Section
      id="blog"
      title="Blog"
      subtitle="Articles on JavaScript, React, Java, Spring, Kubernetes, and AWS"
    >
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      {showViewAll && allPosts.length > (limit ?? 0) && (
        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </Section>
  );
}
