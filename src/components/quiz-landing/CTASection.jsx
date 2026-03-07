function CTASection() {
  return (
    <section className="relative py-32 px-6 md:px-16 overflow-hidden">

      {/* Full-bleed bg image */}
      <div className="absolute inset-0">
        <img src={IMG.couple4} alt="" className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter:"brightness(0.45) saturate(1.3)" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#E91E63]/55 via-[#D81B60]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5F7] via-transparent to-[#FFF5F7]" />
      </div>

      <motion.div
        initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true }}
        className="relative z-10 text-center max-w-3xl mx-auto"
      >
        {/* Floating photo */}
        <motion.div
          initial={{ opacity:0, scale:0.8 }} whileInView={{ opacity:1, scale:1 }}
          viewport={{ once:true }} transition={{ delay:0.2, type:"spring" }}
          className="mx-auto mb-10 w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
        >
          <img src={IMG.couple3} alt="" className="w-full h-full object-cover object-top" />
        </motion.div>

        <motion.h2
          initial={{ opacity:0, y:25 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ delay:0.3 }}
          className="font-serif font-bold text-[#4A2C2C] leading-tight mb-6"
          style={{ fontSize:"clamp(2rem,5vw,4rem)" }}
        >
          Ready to Find Out{" "}
          <span className="italic text-[#E91E63]">The Truth?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity:0 }} whileInView={{ opacity:1 }}
          viewport={{ once:true }} transition={{ delay:0.4 }}
          className="text-base md:text-xl text-[#8B5E66] mb-12 leading-relaxed italic"
        >
          It's free, it's fun, and the results will give you even more reasons to love each other 💕
        </motion.p>

        <motion.div
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ delay:0.5 }}
          className="flex flex-col sm:flex-row gap-5 justify-center"
        >
          <Link href="/quiz/play">
            <motion.button
              whileHover={{ scale:1.05, y:-5 }} whileTap={{ scale:0.96 }}
              className="group relative px-12 py-5 bg-gradient-to-r from-[#c2185b] via-[#d81b60] to-[#e91e63] text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_20px_60px_rgba(194,24,91,0.55)] hover:shadow-[0_30px_80px_rgba(194,24,91,0.7)] transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
              <span className="relative z-10 flex items-center gap-3">
                <motion.span animate={{ rotate:[0,15,-15,0] }} transition={{ repeat:Infinity, duration:2 }}>🔥</motion.span>
                Start Quiz — It's Free
              </span>
            </motion.button>
          </Link>

          <Link href="/">
            <button className="px-12 py-5 rounded-2xl border-2 border-[#E91E63]/30 text-[#4A2C2C] font-bold uppercase tracking-widest text-sm hover:bg-white hover:border-[#E91E63] hover:shadow-xl transition-all duration-300">
              Back to Home
            </button>
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.div
          initial={{ opacity:0 }} whileInView={{ opacity:1 }}
          viewport={{ once:true }} transition={{ delay:0.7 }}
          className="mt-12 flex items-center justify-center gap-8 flex-wrap"
        >
          {["No Ads","No Data Saved","100% Private","Made with ❤️ in India"].map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[#E91E63] text-lg">✓</span>
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#4A2C2C]/60">{t}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}