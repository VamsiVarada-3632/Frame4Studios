import mongoose from 'mongoose';

const homepageSchema = new mongoose.Schema(
  {
    featuredReel: {
      title: { type: String, default: 'The Signature Reel — 2024' },
      client: { type: String, default: 'Global Visionary Ltd.' },
      category: { type: String, default: 'Brand Narrative / Film' },
      year: { type: String, default: '2024' },
      thumbnail: { type: String, default: '' },
      videoUrl: { type: String, default: '' },
    },
    stats: {
      projectsDelivered: { type: String, default: '200+' },
      filmsShot: { type: String, default: '450+' },
      awardsWon: { type: String, default: '12' },
      clients: { type: String, default: '85' },
      years: { type: String, default: '04' },
    },
    quote: {
      type: String,
      default: '"We don\'t just capture motion; we curate the essence of a brand\'s pulse."',
    },
    services: {
      type: [String],
      default: [
        'Cinematography',
        'Show Reels',
        'Brand Videos',
        'Motion Graphics',
        'Post Production',
        'Color Grading',
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Homepage', homepageSchema);
