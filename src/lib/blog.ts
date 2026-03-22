import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
}

function parseBlogFile(filename: string): BlogPost {
  const slug = filename.replace(/\.md$/, '');
  const filePath = path.join(BLOG_DIR, filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    description: data.description as string,
    tags: (data.tags as string[]) ?? [],
    content,
  };
}

export function getAllBlogPosts(): BlogPostMeta[] {
  const filenames = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));

  const posts = filenames.map((filename) => {
    const { slug, title, date, description, tags } = parseBlogFile(filename);
    return { slug, title, date, description, tags };
  });

  // Sort by date descending (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(slug: string): BlogPost | null {
  const filename = `${slug}.md`;
  const filePath = path.join(BLOG_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return parseBlogFile(filename);
}

export function getAllBlogSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

export function formatBlogDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
