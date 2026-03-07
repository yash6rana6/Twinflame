export default function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#E91E63]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-20 w-[500px] h-[500px] bg-[#FFC1CC]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#FADADD]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );
}