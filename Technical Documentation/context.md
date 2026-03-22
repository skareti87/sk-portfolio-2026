# Active Context: Live Resume Template

## Current State

**Template Status**: ✅ Complete and production-ready

The template is fully implemented with all core sections working. Portfolio section has been replaced with a file-based Markdown blog system.

## Recently Completed

- [x] Profile header with photo support
- [x] Professional summary section
- [x] Experience timeline with animations
- [x] Skills section with visual progress bars
- [x] Education section with certifications and awards
- [x] Contact section with form
- [x] Print-optimized view
- [x] Side navigation for desktop
- [x] Dark mode support
- [x] Centralized configuration in site.config.ts
- [x] Memory bank migrated to .kilocode/rules/memory-bank/
- [x] **Portfolio section removed; replaced with file-based Markdown Blog**
- [x] 10 blog articles added (JavaScript/React, Java/Spring, Kubernetes, AWS topics)
- [x] Blog list on homepage (5 most recent, with "View All" link)
- [x] Full blog article pages at `/blog/[slug]` with back-to-home link
- [x] `@tailwindcss/typography` plugin added for blog prose styling

## Components Implemented

| Component | File | Status |
|-----------|------|--------|
| Profile Header | `src/components/resume/ProfileHeader.tsx` | ✅ Complete |
| Summary | `src/components/resume/Summary.tsx` | ✅ Complete |
| Experience Timeline | `src/components/resume/ExperienceTimeline.tsx` | ✅ Complete |
| Skills Section | `src/components/resume/SkillsSection.tsx` | ✅ Complete |
| Education Section | `src/components/resume/EducationSection.tsx` | ✅ Complete |
| Certifications | `src/components/resume/CertificationsSection.tsx` | ✅ Complete |
| Languages | `src/components/resume/LanguagesSection.tsx` | ✅ Complete |
| Blog Section | `src/components/blog/BlogSection.tsx` | ✅ Complete |
| Blog Card | `src/components/blog/BlogCard.tsx` | ✅ Complete |
| Blog Article | `src/components/blog/BlogArticle.tsx` | ✅ Complete |
| Contact Form | `src/components/contact/ContactForm.tsx` | ✅ Complete |
| Header | `src/components/layout/Header.tsx` | ✅ Complete |
| Footer | `src/components/layout/Footer.tsx` | ✅ Complete |
| Side Nav | `src/components/layout/SideNav.tsx` | ✅ Complete |

## Blog System Architecture

- **Markdown files**: `content/blog/*.md` (front matter: title, date, description, tags)
- **Blog lib**: `src/lib/blog.ts` — server-side `fs`/`gray-matter` reader (Server Components only)
- **Blog routes**: `src/app/blog/page.tsx` (list), `src/app/blog/[slug]/page.tsx` (article)
- **Rendering**: `react-markdown` + `remark-gfm` in `BlogArticle` (Client Component, receives post as prop)
- **Static generation**: All blog pages use `generateStaticParams` for SSG

### Blog Articles (10 total)
| Slug | Topic |
|------|-------|
| `react-hooks-deep-dive` | React: useCallback, useMemo, useRef |
| `javascript-async-patterns` | JS: Promises, async/await, concurrency |
| `react-server-components` | React/Next.js: Server Components |
| `spring-boot-rest-api` | Java/Spring: REST API patterns |
| `spring-data-jpa-performance` | Java/Spring: N+1 queries, JPA performance |
| `kubernetes-deployments-guide` | K8s: Rolling updates, health checks |
| `kubernetes-networking` | K8s: Services, Ingress, Network Policies |
| `aws-lambda-best-practices` | AWS: Lambda cold starts, memory tuning |
| `aws-ecs-vs-eks` | AWS: ECS vs EKS comparison |
| `java-virtual-threads` | Java 21: Virtual Threads / Project Loom |

## Current Focus

1. Blog content is in place — ready for user to add their own articles
2. Add new blog posts by creating `.md` files in `content/blog/`
3. Profile/resume data still needs real user content

## Quick Customization Guide

### To add a blog article:
Create `content/blog/your-slug.md` with front matter:
```markdown
---
title: "Your Article Title"
date: "2024-12-01"
description: "Short description shown in the list."
tags: ["Tag1", "Tag2"]
---

# Your Article Title
...markdown content...
```

### To change personal info:
Edit `src/data/profile.ts`:
- `profile.name` - Full name
- `profile.title` - Job title
- `profile.email` - Contact email
- `profile.summary` - Professional summary

### To change work experience:
Edit `src/data/experience.ts`

### To change skills:
Edit `src/data/skills.ts`

### To change theme color:
Edit `src/config/site.config.ts` → `theme.primaryColor`

### To toggle features:
Edit `src/config/site.config.ts` → `features`:
- `blog: boolean` - Show/hide blog section
- `skillBars: boolean` - Show/hide skill bars
- `certifications: boolean` - Show/hide certifications
- `sideNav: boolean` - Show/hide side navigation

## Known Considerations

- Profile image expects `/images/profile.jpg` → Add real photo
- Contact form needs backend integration for email
- Blog article thumbnails/images not implemented (text-only articles)

## Session History

| Date | Activity |
|------|----------|
| 2026-01-22 | Memory bank updated to match .kilocode standard structure |
| 2026-03-22 | Replaced portfolio with file-based Markdown blog system; added 10 articles |
