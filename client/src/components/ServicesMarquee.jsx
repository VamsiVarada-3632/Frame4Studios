export default function ServicesMarquee({ services = [] }) {
  const defaultServices = [
    'Cinematography', 'Show Reels', 'Brand Videos',
    'Motion Graphics', 'Post Production', 'Color Grading',
  ];
  const items = services.length ? services : defaultServices;
  const doubled = [...items, ...items];

  return (
    <div className="bg-[#c41e3a] overflow-hidden py-5">
      <div className="marquee-wrapper">
        <div className="marquee-track">
          {doubled.map((s, i) => (
            <span key={i} className="font-ui font-bold text-black text-2xl md:text-4xl tracking-tighter uppercase italic whitespace-nowrap">
              {s} <span className="mx-4 opacity-40">·</span>
            </span>
          ))}
        </div>
        <div className="marquee-track" aria-hidden="true">
          {doubled.map((s, i) => (
            <span key={i} className="font-ui font-bold text-black text-2xl md:text-4xl tracking-tighter uppercase italic whitespace-nowrap">
              {s} <span className="mx-4 opacity-40">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
