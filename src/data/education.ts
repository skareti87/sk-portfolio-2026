/**
 * =============================================================================
 * EDUCATION DATA - Academic History & Certifications
 * =============================================================================
 *
 * AI CUSTOMIZATION INSTRUCTIONS:
 * This file contains education, certifications, and awards data.
 *
 * TO CUSTOMIZE:
 * 1. Replace example entries with your actual education
 * 2. List education in reverse chronological order (newest first)
 * 3. Add certifications if you have any professional certifications
 * 4. Include relevant awards and honors
 *
 * TO ADD A NEW EDUCATION ENTRY:
 * Copy an existing entry and modify all fields. Make sure to:
 * - Use a unique ID (e.g., 'edu-3', 'edu-4')
 * - Include start and end years
 * - GPA is optional (omit if you prefer not to share)
 *
 * TO REMOVE AN ENTRY:
 * Delete the entire object from the array including its curly braces and comma.
 * =============================================================================
 */

/**
 * Education entry type definition
 */
export interface Education {
  /** Unique identifier (e.g., 'edu-1', 'edu-2') */
  id: string;

  /**
   * Degree type
   * Examples: "Bachelor of Science", "Master of Arts", "Ph.D.", "Associate's"
   */
  degree: string;

  /**
   * Field of study
   * Examples: "Computer Science", "Business Administration", "Design"
   */
  field: string;

  /** School/University name */
  school: string;

  /**
   * School logo path (optional)
   * - Use '/logos/school.png' for local image
   * - Use full URL for external image
   */
  schoolLogo?: string;

  /** Location (City, State/Country) (optional) */
  location?: string;

  /** Start year (optional)*/
  startYear?: number;

  /** End year (or expected graduation year) */
  endYear: number;

  /**
   * GPA (optional)
   * Format: "3.8/4.0" or "First Class Honours"
   */
  gpa?: string;

  /**
   * Academic honors (optional)
   * Examples: ["Magna Cum Laude", "Dean's List", "Valedictorian"]
   */
  honors?: string[];

  /**
   * Relevant courses (optional)
   * List courses relevant to your career
   */
  relevantCourses?: string[];
}

/**
 * Certification entry type definition
 */
export interface Certification {
  /** Unique identifier (e.g., 'cert-1', 'cert-2') */
  id: string;

  /** Certification name */
  name: string;

  /** Issuing organization */
  issuer: string;

  /**
   * Issuer logo path (optional)
   * - Use '/logos/issuer.png' for local image
   * - Use full URL for external image
   */
  issuerLogo?: string;

  /**
   * Date obtained in YYYY-MM format
   * Example: '2023-06'
   */
  date: string;

  /**
   * Expiration date in YYYY-MM format (optional)
   * Omit for certifications that don't expire
   */
  expirationDate?: string;

  /**
   * Credential ID (optional)
   * The unique identifier from the issuing organization
   */
  credentialId?: string;

  /**
   * Verification URL (optional)
   * Link to verify the certification
   */
  credentialUrl?: string;
}

/**
 * =============================================================================
 * YOUR EDUCATION - CUSTOMIZE BELOW
 * =============================================================================
 *
 * Replace these example entries with your actual education.
 * List in reverse chronological order (most recent first).
 */
export const education: Education[] = [
  // ---------------------------------------------------------------------------
  // HIGHEST DEGREE
  // ---------------------------------------------------------------------------
  {
    id: "edu-1",
    degree: "Master of Science",
    field: "Bioinformatics",
    school: "University of Texas",
    endYear: 2015,
  },
];

/**
 * =============================================================================
 * YOUR CERTIFICATIONS - CUSTOMIZE BELOW
 * =============================================================================
 *
 * Add your professional certifications here.
 * Remove this array or leave empty if you have no certifications.
 */
export const certifications: Certification[] = [
  {
    id: "cert-1",
    name: "Microsoft Certified: Azure Developer Associate",
    issuer: "Microsoft",
    // issuerLogo: '/logos/microsoft.png',  // Uncomment if you have a logo
    date: "2024-05",
    expirationDate: "2027-05",
    credentialId: "AZ-204",
    credentialUrl: "https://aka.ms/az-204",
  },
  {
    id: "cert-2",
    name: "AWS Certified SysOps Administrator – Associate",
    issuer: "Amazon Web Services",
    // issuerLogo: '/logos/aws.png',  // Uncomment if you have a logo
    date: "2024-03",
    expirationDate: "2027-03",
    credentialUrl:
      "https://www.credly.com/badges/f29ff8f9-33d0-4701-8276-ca0cf3c98c65",
  },
  {
    id: "cert-3",
    name: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    // issuerLogo: '/logos/aws.png',  // Uncomment if you have a logo
    date: "2024-02",
    expirationDate: "2027-02",
    credentialUrl:
      "https://www.credly.com/badges/52e5159d-cdd2-4e42-ac5c-5c09b1533364",
  },
  {
    id: "cert-4",
    name: "Oracle Database SQL Certified Expert",
    issuer: "Oracle Corporation",
    // issuerLogo: '/logos/oracle.png',  // Uncomment if you have a logo
    date: "2014-06",
    credentialUrl:
      "https://www.credly.com/badges/7d63b6f3-4b94-415a-9207-f07590713836",
  },
  {
    id: "cert-5",
    name: "Oracle Certified Professional, Java SE 6 Programmer",
    issuer: "Oracle Corporation",
    // issuerLogo: '/logos/oracle.png',  // Uncomment if you have a logo
    date: "2013-06",
    credentialUrl:
      "https://www.credly.com/badges/1a98b626-82a5-4f53-b548-c850d1a5f67d",
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get highest/most recent education
 */
export function getLatestEducation(): Education | undefined {
  return education.length > 0 ? education[0] : undefined;
}

/**
 * Get active (non-expired) certifications
 */
export function getActiveCertifications(): Certification[] {
  const now = new Date();
  return certifications.filter((cert) => {
    if (!cert.expirationDate) return true;
    const expDate = new Date(cert.expirationDate + "-01");
    return expDate > now;
  });
}

/**
 * Get expired certifications
 */
export function getExpiredCertifications(): Certification[] {
  const now = new Date();
  return certifications.filter((cert) => {
    if (!cert.expirationDate) return false;
    const expDate = new Date(cert.expirationDate + "-01");
    return expDate <= now;
  });
}

/**
 * Check if any certifications exist
 */
export function hasCertifications(): boolean {
  return certifications.length > 0;
}

/**
 * Format education as a string
 */
export function formatEducation(edu: Education): string {
  return `${edu.degree} in ${edu.field} from ${edu.school} (${edu.endYear})`;
}

/**
 * Check if certification is expiring soon (within 6 months)
 */
export function isCertificationExpiringSoon(cert: Certification): boolean {
  if (!cert.expirationDate) return false;

  const now = new Date();
  const expDate = new Date(cert.expirationDate + "-01");
  const sixMonthsFromNow = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);

  return expDate <= sixMonthsFromNow && expDate > now;
}
