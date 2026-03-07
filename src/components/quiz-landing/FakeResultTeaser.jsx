function FakeResultTeaser() {
  return (
    <section className="py-20 px-6 md:px-16 relative">

      {/* Background image band */}
      <div className="absolute inset-0 overflow-hidden">
        <img src={IMG.candle} alt="" className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter:"brightness(0.08) saturate(0.5)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5F7] via-transparent to-[#FFF5F7]" />
        <div className="absolute inset-0 bg-[#FFF5F7]/70" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#E91E63]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E91E63]">Real Results</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#E91E63]" />
          </div>
          <h2 className="font-serif font-bold text-[#4A2C2C] leading-tight"
            style={{ fontSize:"clamp(1.8rem,4vw,3rem)" }}>
            Couples Are Getting Results{" "}
            <span className="italic text-[#E91E63]">Like This...</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {RESULTS.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay: i*0.15 }}
              whileHover={{ y:-10, scale: r.featured ? 1.04 : 1.03 }}
              className={`relative bg-white rounded-[2.5rem] overflow-hidden transition-all duration-500
                ${r.featured
                  ? "border-2 border-[#E91E63]/40 shadow-[0_30px_80px_rgba(233,30,99,0.3)] md:scale-[1.04]"
                  : "border-2 border-[#FADADD] shadow-[0_15px_50px_rgba(233,30,99,0.12)]"
                }`}
            >
              {/* Couple photo top */}
              <div className={`relative h-44 overflow-hidden ${r.tilt}`}>
                <img src={r.img} alt="" className="absolute inset-0 w-full h-full object-cover object-top"
                  style={{ filter:"brightness(0.78) saturate(1.2)" }} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#E91E63]/15 to-transparent" />

                {/* Score pill floating on image */}
                <motion.div
                  initial={{ scale:0 }} whileInView={{ scale:1 }}
                  viewport={{ once:true }} transition={{ delay: 0.4 + i*0.15, type:"spring", stiffness:200 }}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border border-[#FADADD]"
                >
                  <span className="text-sm font-black text-[#E91E63]">{r.score}</span>
                </motion.div>
              </div>

              {/* Card content */}
              <div className="p-6 text-center relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#FADADD]/30 rounded-bl-[2.5rem]" />

                <div className="relative z-10">
                  {/* MacOS dots — styled nicely */}
                  <div className="flex items-center gap-2 justify-center mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FADADD]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E91E63]/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E91E63]/60" />
                  </div>

                  <div className="text-4xl mb-3">{r.emoji}</div>
                  <h4 className="text-lg font-serif font-bold text-[#E91E63] mb-2">{r.label}</h4>
                  <p className="text-sm text-[#8B5E66] leading-relaxed">{r.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}