import { motion } from "framer-motion";
import Card from "../Card";

export default function ProductsSection() {
  return (
    <section
      id="vault"
      className="relative py-32 px-6 bg-white rounded-t-[5rem] shadow-[0_-50px_100px_rgba(233,30,99,0.1)] z-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="inline-block text-[10px] font-black text-[#E91E63] uppercase tracking-[0.4em] mb-6">
            The Magic Trio
          </span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tighter mb-6">
            Pick Your{" "}
            <span className="relative inline-block text-[#E91E63]">
              Magic
              <span className="absolute -bottom-2 left-0 w-full h-3 bg-[#FFC1CC]/30 -z-10" />
            </span>
          </h2>
          <p className="text-lg text-[#8B5E66] italic max-w-2xl mx-auto">
            Three digital experiences to make your love even more special
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card
              title="Couple Quiz"
              description="See who remembers more — from your first date to your favorite Maggi flavor!"
              icon="💞"
              badge="Free to Play"
              price="₹0"
              href="/quiz"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card
              title="Love Timeline"
              description="A beautiful, scrollable story of your best memories — photos, notes, and emotions."
              icon="🌹"
              badge="Most Popular"
              price="₹49/week"
              featured={true}
              href="/timeline"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card
              title="WhatsApp Bot"
              description="Automatic daily 'I love you' messages — a small reminder of your love, every day."
              icon="💌"
              badge="Automated Love"
              price="₹49/week"
              href="/whatsapp-bot"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
