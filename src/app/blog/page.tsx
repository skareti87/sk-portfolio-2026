import type { Metadata } from 'next';
import { Container } from '@/components/ui';
import { BlogSection } from '@/components/blog';
import { profile } from '@/data/profile';

export const metadata: Metadata = {
  title: `Blog | ${profile.name}`,
  description: `Articles on JavaScript, React, Java, Spring, Kubernetes, and AWS by ${profile.name}`,
};

export default function BlogPage() {
  return (
    <Container size="lg" className="py-12">
      <BlogSection />
    </Container>
  );
}
