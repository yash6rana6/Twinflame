import Link from "next/link";
import { motion } from "framer-motion";

export default function Card({ title, description, icon, badge, price, featured = false, href = "#" }) {
  return (
    <Link href={href} className="block h-full group">
      <motion.div
        whileHover={{ y: -10, scale: featured ? 1.05 : 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`
          relative h-full flex flex-col p-8 rounded-3xl overflow-hidden
          ${featured 
            ? 'bg-gradient-to-br from-[#b3365c] via-[#d81b60] to-[#ff80ab] text-white shadow-[0_45px_110px_rgba(179,54,92,0.55),inset_0_0_30px_rgba(255,255,255,0.15)] ring-1 ring-white/20' 
            : 'bg-white/95 backdrop-blur-md border border-[#FFD1DC]/60 shadow-[0_30px_80px_rgba(233,30,99,0.2)] hover:shadow-[0_55px_130px_rgba(233,30,99,0.35)] hover:border-[#E91E63]/50'
          }
          transition-all duration-500 ease-out
        `}
      >
        {/* Rose Pink Orb + Glow */}
        <div className={`
          absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-50
          ${featured ? 'bg-white/18' : 'bg-[#FF80AB]/12'}
          group-hover:scale-130 group-hover:opacity-70 transition-all duration-1000 ease-out
        `} />

        {/* Icon - Compact with micro sparkles */}
        <div className="relative mb-8">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.12 }}
            transition={{ duration: 0.7 }}
            className={`
              relative w-20 h-20 rounded-2xl flex items-center justify-center text-5xl
              ${featured 
                ? 'bg-white/22 backdrop-blur-lg border border-white/30 shadow-[0_10px_30px_rgba(255,255,255,0.3)]' 
                : 'bg-gradient-to-br from-[#FFF0F5] to-[#FFD1DC] border-2 border-[#E91E63]/25 shadow-[0_8px_25px_rgba(233,30,99,0.2)]'
              }
            `}
          >
            {icon || "💖"}
            {/* Micro sparkles */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full animate-ping opacity-70" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#FF80AB] rounded-full animate-pulse delay-200" />
          </motion.div>
        </div>

        {/* Badge */}
        <div className="flex items-center gap-2.5 mb-5">
          <span className={`w-2.5 h-2.5 rounded-full ${featured ? 'bg-white animate-ping' : 'bg-[#E91E63] animate-pulse'}`} />
          <span className={`
            text-[10px] md:text-xs font-black uppercase tracking-[0.35em]
            ${featured ? 'text-white/95' : 'text-[#E91E63]'}
          `}>
            {badge || "Rose Edition"}
          </span>
        </div>

        {/* Title */}
        <h3 className={`
          text-3xl md:text-4xl font-serif font-extrabold mb-4 leading-tight
          ${featured 
            ? 'bg-gradient-to-r from-white via-[#FFCDD2] to-white bg-clip-text text-transparent drop-shadow-sm' 
            : 'text-[#4A2C2C] group-hover:text-[#E91E63]'
          }
          transition-colors duration-400
        `}>
          {title}
        </h3>

        {/* Description - safe height */}
        <p className={`
          text-base leading-relaxed mb-6 flex-grow line-clamp-4
          ${featured ? 'text-white/95' : 'text-[#8B5E66]'}
        `}>
          {description}
        </p>

        {/* Price */}
        {price && (
          <div className="mb-8">
            <div className={`
              inline-flex items-baseline gap-2.5 px-5 py-2.5 rounded-2xl
              ${featured 
                ? 'bg-white/25 backdrop-blur-md border border-white/20' 
                : 'bg-[#FFF0F5] border border-[#E91E63]/30'
              }
            `}>
              <span className={`
                text-2xl md:text-3xl font-black
                ${featured ? 'text-white' : 'text-[#E91E63]'}
              `}>
                {price}
              </span>
              {price !== "₹0" && (
                <span className={`
                  text-[10px] md:text-xs uppercase tracking-wider font-semibold
                  ${featured ? 'text-white/80' : 'text-[#8B5E66]'}
                `}>
                  onwards
                </span>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-6 border-t border-white/15">
          <div className="flex items-center justify-between group/btn">
            <span className={`
              text-xs md:text-sm font-black uppercase tracking-[0.25em]
              ${featured ? 'text-white' : 'text-[#4A2C2C] group-hover/btn:text-[#E91E63]'}
              group-hover/btn:tracking-[0.4em] transition-all duration-500
            `}>
              {featured ? 'Get Started' : 'Explore'}
            </span>
            
            <motion.div
              whileHover={{ x: 8, scale: 1.15 }}
              className={`
                relative w-12 h-12 rounded-full flex items-center justify-center shadow-xl
                ${featured 
                  ? 'bg-white text-[#b3365c]' 
                  : 'bg-gradient-to-r from-[#E91E63] to-[#FF80AB] text-white'
                }
                group-hover/btn:shadow-[0_0_30px_rgba(233,30,99,0.6)] transition-all
              `}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover/btn:opacity-60 transition-opacity" />
            </motion.div>
          </div>
        </div>

        {/* Floating "Most Loved" Tag */}
        {featured && (
          <div className="absolute top-6 right-6 z-20">
            <motion.div
              animate={{
                y: [0, -12, 0],          
                rotate: [0, 3, -3, 0],  
              }}
              transition={{
                y: { 
                  repeat: Infinity, 
                  repeatType: "mirror", 
                  duration: 3.5, 
                  ease: "easeInOut" 
                },
                rotate: { 
                  repeat: Infinity, 
                  duration: 6, 
                  ease: "easeInOut" 
                }
              }}
              className="relative"
            >
              {/* Glow behind */}
              <div className="absolute inset-0 bg-white blur-xl opacity-40 animate-pulse-slow" />
              
              {/* Main Tag */}
              <div className="relative bg-gradient-to-r from-white to-[#FFCDD2] backdrop-blur-md text-[#b3365c] px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl border border-white/40 ring-1 ring-white/30">
                Most Loved
              </div>
            </motion.div>
          </div>
        )}

      </motion.div>
    </Link>
  );
}