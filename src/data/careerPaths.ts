/**
 * DreamSync — Curated Career Path Data
 * India-specific, structured career content for the AI Career Agent featured section.
 */

export type RoleCard = {
  title: string;
  salary: string;
  demand: 'High' | 'Medium' | 'Low';
  skills: string[];
  companies: string[];
  color: string; // Tailwind bg class
};

export type RoleGroup = {
  category: string;
  categoryColor: string;
  icon: string; // emoji
  roles: RoleCard[];
};

export type RoadmapNode = {
  id: number;
  title: string;
  timeline: string;
  desc: string;
  next: number[];
};

export type JobLink = {
  platform: string;
  url: string;
  label: string;
  color: string;
};

export type CareerPath = {
  id: string;
  title: string;
  overview: string;
  tags: string[];
  headerColor: string;
  roleGroups: RoleGroup[];
  roadmap: RoadmapNode[];
  jobs: JobLink[];
  tips: string[];
  tools: { name: string; category: string }[];
  portfolioPlatforms: { name: string; url: string; desc: string }[];
};

// ── GRAPHIC DESIGN ────────────────────────────────────────────────
export const graphicDesignPath: CareerPath = {
  id: 'graphic-design',
  title: 'Graphic & Visual Design',
  overview:
    'One of India\'s fastest-growing creative fields. From app interfaces to brand campaigns — designers are in demand across every industry. No engineering degree required.',
  tags: ['Creative', 'High Demand', 'Remote-Friendly', 'Freelance Possible'],
  headerColor: 'bg-[#2563EB]',

  roleGroups: [
    {
      category: 'Design Core',
      categoryColor: 'bg-yellow-100 text-yellow-900 border-yellow-400',
      icon: 'Palette',
      roles: [
        {
          title: 'Graphic Designer',
          salary: '₹3L – ₹9L/yr',
          demand: 'High',
          skills: ['Photoshop', 'Illustrator', 'Canva', 'Typography', 'Brand Identity'],
          companies: ['Zomato', 'Flipkart', 'Ogilvy', 'Leo Burnett', 'Dentsu'],
          color: 'bg-yellow-50',
        },
        {
          title: 'Motion Designer',
          salary: '₹4L – ₹14L/yr',
          demand: 'High',
          skills: ['After Effects', 'Premiere Pro', 'Lottie', '3D Basics', 'Storyboarding'],
          companies: ['upGrad', 'BYJU\'S', 'Hotstar', 'Zee5', 'Meesho'],
          color: 'bg-orange-50',
        },
      ],
    },
    {
      category: 'Product Design',
      categoryColor: 'bg-blue-100 text-blue-900 border-blue-400',
      icon: 'Laptop',
      roles: [
        {
          title: 'UI/UX Designer',
          salary: '₹5L – ₹22L/yr',
          demand: 'High',
          skills: ['Figma', 'Prototyping', 'User Research', 'Wireframing', 'Design Systems'],
          companies: ['Razorpay', 'PhonePe', 'CRED', 'Groww', 'Swiggy', 'Zepto'],
          color: 'bg-blue-50',
        },
        {
          title: 'Product Designer',
          salary: '₹8L – ₹30L/yr',
          demand: 'High',
          skills: ['Figma', 'User Testing', 'OKRs', 'A/B Testing', 'Design Thinking'],
          companies: ['Google India', 'Microsoft', 'Spotify', 'Atlassian', 'Freshworks'],
          color: 'bg-indigo-50',
        },
      ],
    },
    {
      category: 'Branding & Visual',
      categoryColor: 'bg-purple-100 text-purple-900 border-purple-400',
      icon: 'Layers',
      roles: [
        {
          title: 'Visual Designer',
          salary: '₹4L – ₹15L/yr',
          demand: 'Medium',
          skills: ['Brand Identity', 'Color Theory', 'InDesign', 'Figma', 'Illustration'],
          companies: ['Lenskart', 'Nykaa', 'Mamaearth', 'Boat', 'Sugar Cosmetics'],
          color: 'bg-purple-50',
        },
        {
          title: 'Brand Designer',
          salary: '₹5L – ₹18L/yr',
          demand: 'Medium',
          skills: ['Brand Strategy', 'Logo Design', 'Style Guides', 'Canva', 'Figma'],
          companies: ['WPP India', 'MullenLowe', 'Contract Advertising', 'Publicis'],
          color: 'bg-pink-50',
        },
      ],
    },
  ],

  roadmap: [
    {
      id: 1,
      title: 'Build Foundations',
      timeline: 'Month 0–1',
      desc: 'Learn Figma basics, color theory, typography. Watch free Canva & Figma tutorials.',
      next: [2],
    },
    {
      id: 2,
      title: 'Create Portfolio',
      timeline: 'Month 1–3',
      desc: 'Design 5–8 projects. Upload to Behance & Dribbble. Case studies are key.',
      next: [3],
    },
    {
      id: 3,
      title: 'Land Internship',
      timeline: 'Month 3–5',
      desc: 'Apply on Internshala & LinkedIn. Target D2C brands, agencies & startups.',
      next: [4],
    },
    {
      id: 4,
      title: 'Go Full-Time',
      timeline: 'Month 5–8',
      desc: 'Convert internship or apply for junior roles. Negotiate salary using AmbitionBox.',
      next: [5],
    },
    {
      id: 5,
      title: 'Specialize & Grow',
      timeline: '1–2 years',
      desc: 'Pick UI/UX or Motion. Build a niche. Freelance or move to product companies.',
      next: [],
    },
  ],

  jobs: [
    {
      platform: 'LinkedIn Jobs',
      url: 'https://www.linkedin.com/jobs/search/?keywords=graphic+designer+india',
      label: 'Find Design Jobs',
      color: 'bg-[#2563EB]',
    },
    {
      platform: 'Internshala',
      url: 'https://internshala.com/internships/graphic-design-internship',
      label: 'Design Internships',
      color: 'bg-black',
    },
    {
      platform: 'Naukri',
      url: 'https://www.naukri.com/graphic-designer-jobs',
      label: 'Search on Naukri',
      color: 'bg-[#2563EB]',
    },
    {
      platform: 'Freelancer',
      url: 'https://www.freelancer.in/jobs/graphic-design/',
      label: 'Freelance Gigs',
      color: 'bg-black',
    },
  ],

  tips: [
    'Quality over quantity — 5 great case studies beat 20 weak ones',
    'Add Behance & Dribbble links directly in your resume',
    'Learn to present your design decisions — not just show the result',
    'Study apps you use daily and redesign one for your portfolio',
    'Freelance on Fiverr/Upwork while job hunting — builds income + experience',
    'NIFT, NID grads get premium pay — but portfolio matters more than college',
  ],

  tools: [
    { name: 'Figma', category: 'UI/UX Design' },
    { name: 'Adobe Photoshop', category: 'Photo Editing' },
    { name: 'Adobe Illustrator', category: 'Vector Design' },
    { name: 'After Effects', category: 'Motion Design' },
    { name: 'Canva', category: 'Quick Design' },
    { name: 'Adobe InDesign', category: 'Print / Layout' },
    { name: 'Spline', category: '3D for Web' },
    { name: 'Lottie', category: 'Animations' },
  ],

  portfolioPlatforms: [
    {
      name: 'Behance',
      url: 'https://www.behance.net/',
      desc: 'Adobe\'s portfolio network — most popular for Indian designers',
    },
    {
      name: 'Dribbble',
      url: 'https://dribbble.com/',
      desc: 'Best for UI/UX work — gets you noticed by product companies',
    },
    {
      name: 'Notion Portfolio',
      url: 'https://notion.so/',
      desc: 'Free, fast to set up — great for case study presentations',
    },
  ],
};

// ── REGISTRY ──────────────────────────────────────────────────────
// Add more career paths here as they're built
export const CAREER_PATHS: CareerPath[] = [graphicDesignPath];

export function getCareerPath(id: string): CareerPath | undefined {
  return CAREER_PATHS.find((p) => p.id === id);
}
