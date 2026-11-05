import { useEffect, useState } from 'react';

const slides = [
  { title: 'Welcome to ShopHub', subtitle: 'Best deals of the season!', bg: 'linear-gradient(135deg, #0077ff, #00c6ff)' },
  { title: 'Free Shipping', subtitle: 'On orders above $50', bg: 'linear-gradient(135deg, #28a745, #7ed957)' },
  { title: 'New Arrivals', subtitle: 'Check out our latest collection', bg: 'linear-gradient(135deg, #ff6f00, #ffb347)' },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="hero-slider" style={{ background: slides[index].bg }}>
      <h1>{slides[index].title}</h1>
      <p>{slides[index].subtitle}</p>
      <div className="dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={i === index ? 'dot active' : 'dot'}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}