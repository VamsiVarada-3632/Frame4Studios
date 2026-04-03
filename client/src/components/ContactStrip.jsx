import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ContactStrip() {
  return (
    <section className="py-40 px-8 text-center bg-[#080808] relative overflow-hidden">
      {/* Red radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c41e3a]/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <h2 className="font-serif text-[8vw] md:text-7xl italic leading-none mb-12">
          Have a vision?<br />
          <span className="text-[#c41e3a]">Let's Frame It.</span>
        </h2>

        <Link
          to="/contact"
          className="inline-block font-ui text-sm tracking-[0.4em] border-b-2 border-[#c41e3a] pb-4 transition-all duration-500 hover:tracking-[0.6em] hover:text-[#c41e3a]"
          data-cursor-hover
        >
          START A PROJECT
        </Link>
      </motion.div>
    </section>
  );
}
