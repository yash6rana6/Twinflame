export default function WatchroomLayout({ children }) {
  return (
    <main className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden">
      {children}
    </main>
  );
}