import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import Service from '../src/models/Service.js';
import Project from '../src/models/Project.js';
import Blog from '../src/models/Blog.js';
import Testimonial from '../src/models/Testimonial.js';
import Career from '../src/models/Career.js';
import FAQ from '../src/models/FAQ.js';
import Technology from '../src/models/Technology.js';
import Category from '../src/models/Category.js';
import SiteSetting from '../src/models/SiteSetting.js';

dotenv.config();

export const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@sssgrowtech.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const name = process.env.ADMIN_NAME || 'SSS Grow Admin';

  const existing = await User.findOne({ email }).select('+password');
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
    }
    const matches = await bcrypt.compare(password, existing.password);
    if (!matches) {
      existing.password = password;
      await existing.save();
    }
    return;
  }
  await User.create({
    name,
    email,
    password,
    role: 'admin',
    isActive: true,
    isVerified: true,
  });
  // eslint-disable-next-line no-console
  console.log(`Admin user seeded: ${email}`);
};

const seedSampleData = async () => {
  await seedAdmin();

  await Promise.all([
    Category.deleteMany({}),
    Technology.deleteMany({}),
    Service.deleteMany({}),
    Project.deleteMany({}),
    Blog.deleteMany({}),
    Testimonial.deleteMany({}),
    Career.deleteMany({}),
    FAQ.deleteMany({}),
  ]);

  const [webCat, aiCat, mobileCat, cloudCat, marketingCat, designCat] = await Category.insertMany([
    { name: 'Web Development', slug: 'web-development', type: 'service', color: '#4f46e5', isActive: true, sortOrder: 1 },
    { name: 'AI Solutions', slug: 'ai-solutions', type: 'service', color: '#7c3aed', isActive: true, sortOrder: 2 },
    { name: 'Mobile Apps', slug: 'mobile-apps', type: 'service', color: '#059669', isActive: true, sortOrder: 3 },
    { name: 'Cloud Solutions', slug: 'cloud-solutions', type: 'service', color: '#d97706', isActive: true, sortOrder: 4 },
    { name: 'Digital Marketing', slug: 'digital-marketing', type: 'service', color: '#dc2626', isActive: true, sortOrder: 5 },
    { name: 'UI/UX Design', slug: 'ui-ux-design', type: 'service', color: '#db2777', isActive: true, sortOrder: 6 },
  ]);

  const [react, nextjs, node, mongo, ts, python, ai, cloud, tailwind, express] = await Technology.insertMany([
    { name: 'React', slug: 'react', category: 'Frontend', color: '#61dafb', proficiency: 95, featured: true, isActive: true, sortOrder: 1 },
    { name: 'Next.js', slug: 'next-js', category: 'Frontend', color: '#000000', proficiency: 95, featured: true, isActive: true, sortOrder: 2 },
    { name: 'Node.js', slug: 'node-js', category: 'Backend', color: '#339933', proficiency: 92, featured: true, isActive: true, sortOrder: 3 },
    { name: 'Express', slug: 'express', category: 'Backend', color: '#000000', proficiency: 90, featured: true, isActive: true, sortOrder: 4 },
    { name: 'MongoDB', slug: 'mongodb', category: 'Database', color: '#47a248', proficiency: 90, featured: true, isActive: true, sortOrder: 5 },
    { name: 'TypeScript', slug: 'typescript', category: 'Frontend', color: '#3178c6', proficiency: 94, featured: true, isActive: true, sortOrder: 6 },
    { name: 'Python', slug: 'python', category: 'Backend', color: '#3776ab', proficiency: 88, featured: true, isActive: true, sortOrder: 7 },
    { name: 'AI / ML', slug: 'ai-ml', category: 'AI', color: '#7c3aed', proficiency: 85, featured: true, isActive: true, sortOrder: 8 },
    { name: 'AWS', slug: 'aws', category: 'Cloud', color: '#ff9900', proficiency: 82, featured: true, isActive: true, sortOrder: 9 },
    { name: 'Tailwind CSS', slug: 'tailwind-css', category: 'Frontend', color: '#06b6d4', proficiency: 96, featured: true, isActive: true, sortOrder: 10 },
  ]);

  await Service.insertMany([
    {
      title: 'Web Development',
      slug: 'web-development',
      shortDescription: 'Fast, scalable and SEO-friendly websites and web applications built with modern frameworks.',
      description: 'We build high-performance websites and web applications using cutting-edge technologies. From marketing sites to complex SaaS platforms, our web development team delivers pixel-perfect, blazing-fast experiences that convert visitors into customers. We follow best practices in performance, accessibility and security.',
      category: webCat._id,
      features: ['Next.js & React builds', 'Progressive Web Apps', 'E-commerce solutions', 'CMS integration', 'Performance optimization'],
      technologies: [react._id, nextjs._id, ts._id, tailwind._id],
      featured: true,
      status: 'active',
      sortOrder: 1,
    },
    {
      title: 'Mobile App Development',
      slug: 'mobile-app-development',
      shortDescription: 'Native-quality iOS and Android apps delivered with React Native and Flutter.',
      description: 'Our mobile team designs and develops intuitive, high-performance mobile applications for iOS and Android. We build with React Native and Flutter to maximize code reuse while delivering native-quality experiences. From MVP to full product, we handle the entire mobile journey.',
      category: mobileCat._id,
      features: ['React Native development', 'Flutter development', 'App Store & Play Store launch', 'Push notifications', 'Offline-first architecture'],
      technologies: [react._id, node._id, cloud._id],
      featured: true,
      status: 'active',
      sortOrder: 2,
    },
    {
      title: 'AI Solutions',
      slug: 'ai-solutions',
      shortDescription: 'Custom AI and machine learning solutions that automate, predict and personalize.',
      description: 'We help businesses unlock the power of artificial intelligence. From chatbots and virtual assistants to predictive analytics and computer vision, our AI engineers build production-grade ML systems tailored to your business challenges. We integrate LLMs, custom models and automation into your workflows.',
      category: aiCat._id,
      features: ['LLM-powered chatbots', 'Predictive analytics', 'Computer vision', 'AI automation', 'Machine learning pipelines'],
      technologies: [python._id, ai._id, cloud._id],
      featured: true,
      status: 'active',
      sortOrder: 3,
    },
    {
      title: 'UI/UX Design',
      slug: 'ui-ux-design',
      shortDescription: 'Beautiful, user-centered interfaces that drive engagement and conversions.',
      description: 'Our designers combine aesthetics with usability to create interfaces users love. We follow a data-driven design process covering research, wireframing, prototyping and high-fidelity design. Every pixel is intentional, every interaction delightful.',
      category: designCat._id,
      features: ['Design systems', 'Wireframing & prototyping', 'User research', 'Accessibility (WCAG)', 'Interactive prototypes'],
      technologies: [ts._id, tailwind._id],
      featured: false,
      status: 'active',
      sortOrder: 4,
    },
    {
      title: 'Cloud Solutions',
      slug: 'cloud-solutions',
      shortDescription: 'Secure, scalable cloud architecture on AWS, Azure and GCP.',
      description: 'We architect, migrate and manage cloud infrastructure that scales with your business. Our cloud engineers optimize costs, harden security and ensure high availability. From CI/CD pipelines to serverless architectures, we modernize your infrastructure.',
      category: cloudCat._id,
      features: ['Cloud migration', 'DevOps & CI/CD', 'Serverless architecture', 'Cost optimization', 'Infrastructure as Code'],
      technologies: [cloud._id, node._id, mongo._id],
      featured: false,
      status: 'active',
      sortOrder: 5,
    },
    {
      title: 'Digital Marketing',
      slug: 'digital-marketing',
      shortDescription: 'Data-driven marketing that grows your traffic, leads and revenue.',
      description: 'We craft growth strategies across SEO, content, paid media and analytics. Our marketing team converts your digital presence into a lead generation machine. We measure everything, iterate constantly and scale what works.',
      category: marketingCat._id,
      features: ['SEO optimization', 'Content marketing', 'Paid advertising', 'Social media growth', 'Marketing analytics'],
      technologies: [],
      featured: false,
      status: 'active',
      sortOrder: 6,
    },
    {
      title: 'IT Consulting',
      slug: 'it-consulting',
      shortDescription: 'Strategic technology guidance from architecture to execution.',
      description: 'Leverage our senior engineering expertise to make confident technology decisions. We assess your systems, define roadmaps and guide your teams to deliver business value faster. Your CTO advisor on demand.',
      category: null,
      features: ['Technology audits', 'Architecture design', 'Digital transformation', 'Team augmentation', 'Technical due diligence'],
      technologies: [],
      featured: false,
      status: 'active',
      sortOrder: 7,
    },
  ]);

  await Project.insertMany([
    {
      title: 'Nova Commerce - Enterprise E-commerce Platform',
      slug: 'nova-commerce-enterprise-ecommerce-platform',
      description: 'A headless e-commerce platform handling 2M+ monthly users with real-time inventory, AI product recommendations and a fully customizable storefront. Built for scale with Next.js, Node.js and MongoDB.',
      client: 'Nova Retail Group',
      industry: 'E-commerce',
      location: 'San Francisco, USA',
      year: 2025,
      duration: '6 months',
      category: webCat._id,
      technologies: [nextjs._id, node._id, mongo._id, ts._id, tailwind._id],
      features: ['Headless commerce', 'AI recommendations', 'Real-time inventory', 'Secure payments', 'Sub-100ms page loads'],
      cover: '',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/sssgrowtech',
      featured: true,
      status: 'published',
    },
    {
      title: 'MediTrack - Healthcare Appointment Platform',
      slug: 'meditrack-healthcare-appointment-platform',
      description: 'A HIPAA-compliant healthcare platform connecting patients with doctors. Features video consultations, AI symptom checker and seamless EHR integration.',
      client: 'MediTrack Health',
      industry: 'Healthcare',
      location: 'London, UK',
      year: 2025,
      duration: '8 months',
      category: aiCat._id,
      technologies: [react._id, node._id, mongo._id, ai._id],
      features: ['Video consultations', 'AI symptom checker', 'EHR integration', 'HIPAA compliant', 'Multi-language support'],
      cover: '',
      featured: true,
      status: 'published',
    },
    {
      title: 'FinWise - Mobile Banking App',
      slug: 'finwise-mobile-banking-app',
      description: 'A modern mobile banking application with biometric login, real-time spending insights and AI-powered budgeting. Rated 4.8 on the App Store.',
      client: 'FinWise Bank',
      industry: 'Fintech',
      location: 'Singapore',
      year: 2024,
      duration: '10 months',
      category: mobileCat._id,
      technologies: [react._id, node._id, mongo._id, cloud._id],
      features: ['Biometric authentication', 'Real-time analytics', 'AI budgeting', 'Instant transfers', 'Offline transactions'],
      cover: '',
      featured: true,
      status: 'published',
    },
    {
      title: 'CloudScale - DevOps Platform',
      slug: 'cloudscale-devops-platform',
      description: 'An internal developer platform automating CI/CD, infrastructure provisioning and monitoring. Reduced deployment time by 80%.',
      client: 'CloudScale Inc',
      industry: 'Technology',
      location: 'Berlin, Germany',
      year: 2024,
      duration: '5 months',
      category: cloudCat._id,
      technologies: [cloud._id, node._id, mongo._id],
      features: ['Automated CI/CD', 'Infrastructure as Code', 'Centralized logging', 'Zero-downtime deploys'],
      cover: '',
      featured: false,
      status: 'published',
    },
  ]);

  await Blog.insertMany([
    {
      title: 'Why Next.js 16 Is the Future of Web Development',
      slug: 'why-nextjs-16-is-the-future-of-web-development',
      excerpt: 'Next.js 16 brings powerful new features that make building fast, scalable web applications easier than ever.',
      content: `<h2>The Next Generation of React Frameworks</h2><p>Next.js continues to dominate the React ecosystem with innovations in server components, caching and developer experience.</p><h3>Key Features</h3><ul><li>App Router with advanced routing</li><li>Automatic performance optimizations</li><li>Improved image handling</li></ul><p>Businesses that adopt modern frameworks ship faster and deliver better experiences.</p>`,
      thumbnail: '',
      banner: '',
      author: 'SSS Grow Tech Team',
      tags: ['Next.js', 'React', 'Web Development'],
      category: webCat._id,
      status: 'published',
      featured: true,
    },
    {
      title: 'How AI Is Transforming Customer Support',
      slug: 'how-ai-is-transforming-customer-support',
      excerpt: 'AI-powered chatbots and assistants are revolutionizing how businesses serve their customers around the clock.',
      content: `<h2>AI in Customer Support</h2><p>Modern AI assistants can handle 80% of routine support queries, freeing human agents to focus on complex issues.</p><h3>Implementation Strategies</h3><ul><li>Start with FAQ automation</li><li>Integrate with your knowledge base</li><li>Seamless handoff to humans</li></ul>`,
      thumbnail: '',
      banner: '',
      author: 'SSS Grow Tech Team',
      tags: ['AI', 'Automation', 'Customer Support'],
      category: aiCat._id,
      status: 'published',
      featured: true,
    },
    {
      title: 'The Complete Guide to Cloud Migration',
      slug: 'complete-guide-to-cloud-migration',
      excerpt: 'A practical step-by-step guide to moving your infrastructure to the cloud without downtime or surprises.',
      content: `<h2>Cloud Migration Done Right</h2><p>Cloud migration is a journey. Start with a thorough assessment and move workloads incrementally.</p><h3>Migration Phases</h3><ul><li>Assess and inventory</li><li>Design target architecture</li><li>Execute in waves</li><li>Optimize continuously</li></ul>`,
      thumbnail: '',
      banner: '',
      author: 'SSS Grow Tech Team',
      tags: ['Cloud', 'DevOps', 'AWS'],
      category: cloudCat._id,
      status: 'published',
      featured: false,
    },
  ]);

  await Testimonial.insertMany([
    {
      name: 'Sarah Mitchell',
      role: 'CTO',
      company: 'Nova Retail Group',
      content: 'SSS Grow Tech delivered our e-commerce platform ahead of schedule. The quality is outstanding and our conversion rate jumped 35%.',
      rating: 5,
      featured: true,
      status: 'active',
    },
    {
      name: 'James Chen',
      role: 'Product Director',
      company: 'FinWise Bank',
      content: 'The mobile app they built has been downloaded 500K times with a 4.8 rating. Truly world-class engineering team.',
      rating: 5,
      featured: true,
      status: 'active',
    },
    {
      name: 'Emma Wilson',
      role: 'Founder',
      company: 'MediTrack Health',
      content: 'From AI features to compliance, they handled everything. Professional, responsive and technically brilliant.',
      rating: 5,
      featured: true,
      status: 'active',
    },
  ]);

  await Career.insertMany([
    {
      title: 'Senior Full Stack Developer',
      slug: 'senior-full-stack-developer',
      department: 'Engineering',
      type: 'full-time',
      location: 'Remote',
      experience: '5+ years',
      salary: '$120k - $160k',
      description: 'We are looking for a senior full stack developer to lead the delivery of world-class web applications.',
      responsibilities: ['Build scalable web applications', 'Mentor junior developers', 'Own technical architecture decisions'],
      requirements: ['5+ years experience', 'Expert in React and Node.js', 'Strong TypeScript skills'],
      benefits: ['Competitive salary', 'Remote-friendly', 'Health insurance'],
      status: 'open',
      featured: true,
    },
    {
      title: 'AI/ML Engineer',
      slug: 'ai-ml-engineer',
      department: 'AI',
      type: 'full-time',
      location: 'Hybrid',
      experience: '3+ years',
      salary: '$130k - $170k',
      description: 'Join our AI team to build production-grade machine learning solutions for our clients.',
      responsibilities: ['Build and deploy ML models', 'Integrate LLMs into products', 'Optimize model performance'],
      requirements: ['3+ years ML experience', 'Python expertise', 'Experience with LLMs'],
      benefits: ['Competitive salary', 'Learning budget', 'Flexible hours'],
      status: 'open',
      featured: true,
    },
    {
      title: 'UI/UX Designer',
      slug: 'ui-ux-designer',
      department: 'Design',
      type: 'contract',
      location: 'Remote',
      experience: '3+ years',
      salary: '$60 - $80/hr',
      description: 'Design beautiful, user-centered digital products for our diverse client base.',
      responsibilities: ['Create wireframes and prototypes', 'Build design systems', 'Conduct user research'],
      requirements: ['3+ years design experience', 'Figma expertise', 'Portfolio required'],
      benefits: ['Flexible schedule', 'Global team', 'Creative freedom'],
      status: 'open',
      featured: false,
    },
  ]);

  await FAQ.insertMany([
    { question: 'What services does SSS Grow Tech offer?', answer: 'We offer web development, mobile app development, AI solutions, UI/UX design, cloud solutions, digital marketing and IT consulting.', category: 'General', status: 'active', sortOrder: 1 },
    { question: 'How long does a typical project take?', answer: 'Most projects range from 4 weeks for a landing page to 6-9 months for enterprise platforms. We provide a detailed timeline during the discovery phase.', category: 'General', status: 'active', sortOrder: 2 },
    { question: 'How much do your services cost?', answer: 'Pricing depends on project scope and complexity. We offer transparent fixed-price and time-and-materials models. Contact us for a free consultation and quote.', category: 'Pricing', status: 'active', sortOrder: 3 },
    { question: 'Do you provide post-launch support?', answer: 'Yes. Every project includes a warranty period and we offer flexible maintenance and support plans to keep your product healthy.', category: 'Support', status: 'active', sortOrder: 4 },
  ]);

  const settings = [
    { key: 'siteName', group: 'general', label: 'Site Name', value: 'SSS Grow Tech', type: 'text' },
    { key: 'tagline', group: 'general', label: 'Tagline', value: 'We Build, Grow & Scale Your Digital Presence', type: 'text' },
    { key: 'supportEmail', group: 'contact', label: 'Support Email', value: 'sssgrowtech@gmail.com', type: 'text' },
    { key: 'contactEmail', group: 'contact', label: 'Contact Email', value: 'sssgrowtech@gmail.com', type: 'text' },
    { key: 'phone', group: 'contact', label: 'Phone', value: '+91 70285 07985', type: 'text' },
    { key: 'phoneSecondary', group: 'contact', label: 'Alternate Phone', value: '+91 98342 32411', type: 'text' },
    { key: 'address', group: 'contact', label: 'Address', value: 'India · Serving clients worldwide', type: 'text' },
    { key: 'facebook', group: 'social', label: 'Facebook URL', value: 'https://facebook.com/sssgrowtech', type: 'text' },
    { key: 'linkedin', group: 'social', label: 'LinkedIn URL', value: 'https://linkedin.com/company/sssgrowtech', type: 'text' },
    { key: 'twitter', group: 'social', label: 'Twitter URL', value: 'https://twitter.com/sssgrowtech', type: 'text' },
    { key: 'instagram', group: 'social', label: 'Instagram URL', value: 'https://instagram.com/sssgrowtech', type: 'text' },
    { key: 'github', group: 'social', label: 'GitHub URL', value: 'https://github.com/sssgrowtech', type: 'text' },
    { key: 'heroTitle', group: 'hero', label: 'Hero Title', value: 'We Build Digital Products That Grow Your Business', type: 'text' },
    { key: 'heroSubtitle', group: 'hero', label: 'Hero Subtitle', value: 'SSS Grow Tech delivers world-class software, web, mobile, AI and cloud solutions to take your business to the next level.', type: 'textarea' },
    { key: 'stats', group: 'home', label: 'Stats (JSON)', value: { projects: 250, clients: 120, years: 10, awards: 15 }, type: 'json' },
    { key: 'footerText', group: 'footer', label: 'Footer Text', value: 'Premium IT services agency focused on helping businesses grow through technology.', type: 'textarea' },
    { key: 'copyright', group: 'footer', label: 'Copyright', value: '© 2026 SSS Grow Tech. All rights reserved.', type: 'text' },
    { key: 'description', group: 'seo', label: 'SEO Description', value: 'Premium IT services agency - software development, web development, mobile apps, AI solutions, UI/UX design, cloud solutions, digital marketing and IT consulting.', type: 'textarea' },
    { key: 'keywords', group: 'seo', label: 'SEO Keywords', value: 'IT services, software development, web development, mobile apps, AI solutions, UI UX design, cloud solutions, digital marketing', type: 'text' },
    { key: 'logo', group: 'branding', label: 'Logo URL', value: '', type: 'image' },
    { key: 'favicon', group: 'branding', label: 'Favicon URL', value: '', type: 'image' },
    { key: 'heroImage', group: 'hero', label: 'Hero Image URL', value: '', type: 'image' },
    { key: 'announcementBar', group: 'general', label: 'Announcement Bar', value: '', type: 'textarea' },
  ];

  await SiteSetting.bulkWrite(
    settings.map((s) => ({
      updateOne: { filter: { key: s.key }, update: { $setOnInsert: s }, upsert: true },
    }))
  );

  // eslint-disable-next-line no-console
  console.log('Sample data seeded successfully');
};

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  const run = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sss_grow_tech');
      await seedSampleData();
      process.exit(0);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Seeding failed:', error);
      process.exit(1);
    }
  };
  run();
}

export default seedSampleData;
