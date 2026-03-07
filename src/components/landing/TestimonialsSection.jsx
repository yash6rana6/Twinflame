"use client";

import { motion } from "framer-motion";
const testimonials = [
  {
    name: "Raj & Priya",
    location: "Mumbai",
    quote: "She cried after seeing the timeline… happy tears. Best anniversary gift ever! 💕",
    initial: "R"
  },
  {
    name: "Vikram & Neha",
    location: "Bangalore",
    quote: "The bot literally saved our long-distance relationship. We wait for the daily messages every day! ❤️",
    initial: "V"
  }
];


export default function TestimonialsSection() {
  return (
    <section className="relative py-32 px-6 bg-[#FFF5F7] z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-[#4A2C2C] mb-6">
            Real Love,{" "}
            <span className="italic text-[#E91E63]">Real Stories</span>
          </h2>
          <p className="text-lg text-[#8B5E66] italic">
            Suniye unki kahani jinki shaadi timeline ne karwayi
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              whileHover={{ y: -5 }}
              className="relative p-10 bg-white rounded-[3rem] border border-[#FADADD] shadow-lg"
            >
              {/* Quote Mark */}
              <div className="absolute top-8 right-8 text-8xl font-serif text-[#E91E63]/10 leading-none">"</div>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#E91E63] to-[#FF6F91] rounded-full flex items-center justify-center text-white font-serif font-bold text-2xl shadow-lg">
                  {testimonial.initial}
                </div>
                <div>
                  <h4 className="font-bold text-[#4A2C2C] text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-[#8B5E66] uppercase tracking-widest">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#E91E63] text-2xl">★</span>
                ))}
              </div>

              <p className="text-lg text-[#8B5E66] leading-relaxed italic">
                {testimonial.quote}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}