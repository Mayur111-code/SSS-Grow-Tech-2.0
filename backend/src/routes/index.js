import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import serviceRoutes from './service.routes.js';
import projectRoutes from './project.routes.js';
import blogRoutes from './blog.routes.js';
import testimonialRoutes from './testimonial.routes.js';
import careerRoutes from './career.routes.js';
import applicationRoutes from './application.routes.js';
import contactRoutes from './contact.routes.js';
import faqRoutes from './faq.routes.js';
import technologyRoutes from './technology.routes.js';
import categoryRoutes from './category.routes.js';
import settingsRoutes from './settings.routes.js';
import uploadRoutes from './upload.routes.js';
import notificationRoutes from './notification.routes.js';

const router = Router();

const routes = [
  { path: '/auth', route: authRoutes },
  { path: '/users', route: userRoutes },
  { path: '/services', route: serviceRoutes },
  { path: '/projects', route: projectRoutes },
  { path: '/blogs', route: blogRoutes },
  { path: '/testimonials', route: testimonialRoutes },
  { path: '/careers', route: careerRoutes },
  { path: '/applications', route: applicationRoutes },
  { path: '/contacts', route: contactRoutes },
  { path: '/faqs', route: faqRoutes },
  { path: '/technologies', route: technologyRoutes },
  { path: '/categories', route: categoryRoutes },
  { path: '/settings', route: settingsRoutes },
  { path: '/upload', route: uploadRoutes },
  { path: '/notifications', route: notificationRoutes },
];

routes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;

