'use client'
import { motion } from "framer-motion";
import { useState } from "react";

const images = [
  <img
    key="1"
    src="https://source.unsplash.com/random/1600x400?sig=1"
    alt="Slide 1"
    className="w-full h-[150px] object-cover"
  />,
  <img
    key="2"
    src="https://source.unsplash.com/random/1600x400?sig=2"
    alt="Slide 2"
    className="w-full h-[150px] object-cover"
  />,
  <img
    key="3"
    src="https://source.unsplash.com/random/1600x400?sig=3"
    alt="Slide 3"
    className="w-full h-[150px] object-cover"
  />,
];

export default function SimpleCarousel() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="relative w-full overflow-hidden h-[150px] rounded-lg shadow-lg">
      <motion.div
        key={index}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {images[index]}
      </motion.div>

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-90"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-90"
      >
        ›
      </button>
    </div>
  );
}
