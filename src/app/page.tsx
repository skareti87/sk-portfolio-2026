import { Container } from '@/components/ui';
import {
  ProfileHeader,
  Summary,
  ExperienceTimeline,
  SkillsSection,
  EducationSection,
  CertificationsSection,
} from '@/components/resume';
import { ContactSection } from '@/components/contact';
import { BlogSection } from '@/components/blog';

export default function HomePage() {
  return (
    <Container size="lg" className="py-12">
      {/* About Section */}
      <section id="about" className="mb-16">
        <ProfileHeader />
        <Summary />
      </section>

      {/* Experience Section */}
      <ExperienceTimeline />

      {/* Skills Section */}
      <SkillsSection />

      {/* Education Section */}
      <EducationSection />

      {/* Certifications Section */}
      <CertificationsSection />

      {/* Blog Section */}
      <BlogSection limit={5} showViewAll />

      {/* Contact Section */}
      <ContactSection />
    </Container>
  );
}
