import React from "react";

const competitors = [
  "biddingo.png",
  "canada.png",
  "merx.png",
  "mississauga.png",
  "ontario.png",
  "toronto.png",
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 text-center">
      <div className="mb-8 flex flex-col items-center">
        <h2 className="text-4xl font-bold mb-6 text-text max-w-4xl">
          We know businesses are tired of looking for opportunities on sites
          like these.
        </h2>
        <p className="text-text-muted mb-12 text-xl">
          They're outdated, slow, ugly, and don't work.
        </p>
      </div>
      <div className="relative flex justify-center items-center -space-x-42 px-4 py-12">
        {competitors.map((file, idx) => (
          <div
            key={file}
            className={`relative w-96 h-96 rounded-lg border-4 border-white shadow-md overflow-hidden z-10 ${
              idx % 2 === 0 ? "translate-y-12" : "-translate-y-12"
            }`}
            style={{ zIndex: competitors.length - idx }}
          >
            <img
              src={`/competitors/${file}`}
              alt={file.replace(".png", "")}
              className="w-full h-full scale-200 object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
