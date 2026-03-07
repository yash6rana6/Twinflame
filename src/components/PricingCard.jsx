export default function PricingCard({ title, price, features, recommended }) {
  return (
    <div className={`relative p-8 rounded-[3rem] transition-all duration-500 ${recommended ? 'bg-[#36454F] text-[#F5F5DC] scale-105 shadow-2xl' : 'bg-white text-[#36454F] border border-[#B2AC88]/30'}`}>
      {recommended && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#B2AC88] text-[#36454F] px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">Most Loved</div>}
      <h4 className="text-2xl font-serif font-bold mb-1">{title}</h4>
      <div className="flex items-baseline gap-1 mb-6 text-4xl font-serif font-bold italic">₹{price}</div>
      <ul className="space-y-4 mb-8 text-sm opacity-90">
        {features.map((f, i) => <li key={i} className="flex items-center gap-2">✓ {f}</li>)}
      </ul>
      <button className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-xs active:scale-95 transition-all ${recommended ? 'bg-[#B2AC88] text-[#36454F]' : 'bg-[#36454F] text-[#F5F5DC]'}`}>Buy Now</button>
    </div>
  );
}