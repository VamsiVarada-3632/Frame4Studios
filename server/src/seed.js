import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import Category from './models/Category.js';
import Work from './models/Work.js';
import Homepage from './models/Homepage.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Create admin
  const adminExists = await Admin.findOne({ email: 'admin@frame4studios.com' });
  if (!adminExists) {
    await Admin.create({ username: 'admin', email: 'admin@frame4studios.com', password: 'Frame4Studios@2024' });
    console.log('✅ Admin created: admin@frame4studios.com / Frame4Studios@2024');
  }

  // Create categories
  await Category.deleteMany({});
  await Category.insertMany([
    { name: 'Fashion', slug: 'fashion', description: 'Couture, editorial, and style in motion.', icon: 'apparel', order: 1 },
    { name: 'Events', slug: 'events', description: 'Galas, premieres, and live moments.', icon: 'celebration', order: 2 },
    { name: 'Bikes', slug: 'bikes', description: 'Machine aesthetics and speed culture.', icon: 'two_wheeler', order: 3 },
    { name: 'Portrait', slug: 'portrait', description: 'Faces, stories, and expressions.', icon: 'face_retouching_natural', order: 4 },
    { name: 'Videography', slug: 'videography', description: 'Cinematic narratives and brand films.', icon: 'movie', order: 5 },
  ]);
  console.log('✅ Categories seeded');

  // Create works
  await Work.deleteMany({});
  await Work.insertMany([
    {
      title: 'The Crimson Silence',
      category: 'fashion',
      description: 'A dramatic noir fashion editorial shot in a single-source studio.',
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      videoUrl: '',
      featured: true,
      year: 2024,
      client: 'Noir Magazine',
      order: 1,
    },
    {
      title: 'Velocity Noir',
      category: 'bikes',
      description: 'Custom vintage motorcycle in a dark industrial setting.',
      thumbnail: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      featured: true,
      year: 2024,
      client: 'Iron Horse Customs',
      order: 2,
    },
    {
      title: 'Midnight Gala',
      category: 'events',
      description: 'Luxury event coverage — Noir Nights 2023 gala evening.',
      thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
      videoUrl: '',
      featured: false,
      year: 2023,
      client: 'The Noir Foundation',
      order: 3,
    },
    {
      title: 'Urban Rhythms',
      category: 'videography',
      description: 'Abstract motion study of city life after dark.',
      thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      featured: false,
      year: 2024,
      client: 'City Arts Council',
      order: 4,
    },
    {
      title: 'Veiled Intentions',
      category: 'portrait',
      description: 'A striking portrait series shot through silk veils.',
      thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
      videoUrl: '',
      featured: false,
      year: 2024,
      client: 'Private Commission',
      order: 5,
    },
    {
      title: 'Noir Elegance',
      category: 'fashion',
      description: 'Avant-garde editorial with concrete architecture.',
      thumbnail: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800',
      videoUrl: '',
      featured: false,
      year: 2023,
      client: 'Vogue India',
      order: 6,
    },
  ]);
  console.log('✅ Works seeded');

  // Create homepage singleton
  await Homepage.deleteMany({});
  await Homepage.create({
    featuredReel: {
      title: 'The Signature Reel — 2024',
      client: 'Global Visionary Ltd.',
      category: 'Brand Narrative / Film',
      year: '2024',
      thumbnail: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1200',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    stats: { projectsDelivered: '200+', filmsShot: '450+', awardsWon: '12', clients: '85', years: '04' },
    quote: '"We don\'t just capture motion; we curate the essence of a brand\'s pulse."',
    services: ['Cinematography', 'Show Reels', 'Brand Videos', 'Motion Graphics', 'Post Production', 'Color Grading'],
  });
  console.log('✅ Homepage data seeded');

  await mongoose.disconnect();
  console.log('🎬 Seed complete!');
};

seed().catch((err) => { console.error(err); process.exit(1); });
