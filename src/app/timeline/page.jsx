// "use client";

// import { useRouter } from "next/navigation";

// export default function TimelineHomePage() {
//   const router = useRouter();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-purple-200 flex flex-col">

//       {/* Hero Section */}
//       <div className="flex-1 flex items-center justify-center px-6">
//         <div className="max-w-3xl text-center">

//           <h1 className="text-5xl font-bold text-gray-800 leading-tight">
//             Preserve Your <span className="text-pink-600">Love Story</span> Forever 💕
//           </h1>

//           <p className="mt-6 text-lg text-gray-600">
//             Create a private timeline with your partner.  
//             Add memories, photos, daily moments and build your beautiful journey together.
//           </p>

//           <div className="mt-10 flex justify-center gap-4">

//             <button
//               onClick={() => router.push("/timeline/create")}
//               className="px-8 py-3 bg-pink-600 text-white rounded-xl text-lg hover:bg-pink-700 transition shadow-lg"
//             >
//               Create Timeline
//             </button>

//             <button
//               onClick={() => router.push("/")}
//               className="px-8 py-3 bg-white text-gray-800 rounded-xl text-lg hover:bg-gray-100 transition shadow"
//             >
//               Learn More
//             </button>

//           </div>

//         </div>
//       </div>

//       {/* Feature Section */}
//       <div className="bg-white py-16 px-6">
//         <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center">

//           <div>
//             <div className="text-4xl mb-4">📸</div>
//             <h3 className="text-xl font-semibold mb-2">Upload Memories</h3>
//             <p className="text-gray-600">
//               Add photos and videos powered by Cloudinary storage.
//             </p>
//           </div>

//           <div>
//             <div className="text-4xl mb-4">🔥</div>
//             <h3 className="text-xl font-semibold mb-2">Daily Streak</h3>
//             <p className="text-gray-600">
//               Stay consistent and grow your love streak together.
//             </p>
//           </div>

//           <div>
//             <div className="text-4xl mb-4">🎁</div>
//             <h3 className="text-xl font-semibold mb-2">Export Memories</h3>
//             <p className="text-gray-600">
//               Download your love story as a PDF or recap video.
//             </p>
//           </div>

//         </div>
//       </div>

//       {/* Footer */}
//       <div className="text-center py-6 text-sm text-gray-500">
//         © {new Date().getFullYear()} Love Timeline SaaS ❤️
//       </div>

//     </div>
//   );
// }

"use client";

import { useRouter } from "next/navigation";

export default function TimelineComingSoon() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex flex-col items-center justify-center px-6">

      {/* Main Content - Centered */}
      <div className="max-w-3xl text-center space-y-8">

        {/* Cute coming soon icon */}
        <div className="text-8xl md:text-9xl mb-6 animate-pulse">
          💕✨
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
          Love Timeline
          <br />
          <span className="text-pink-600">Coming Soon</span> ❤️
        </h1>

        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          Humari taraf se ek private aur pyara sa space ban raha hai jaha tum apni love story ko photos, moments aur daily yaadein save kar sakte ho.  
          Abhi thoda sa wait karo, jaldi hi launch ho jayega! 💌
        </p>

        {/* Countdown vibe (static for now, chahiye to real timer add kar denge) */}
        <div className="flex justify-center gap-6 my-10">
          <div className="bg-white/60 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-md">
            <div className="text-3xl font-bold text-pink-600">Soon</div>
            <div className="text-sm text-gray-600">Days</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-md">
            <div className="text-3xl font-bold text-pink-600">Soon</div>
            <div className="text-sm text-gray-600">Hours</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-5 mt-8">
          <button
            onClick={() => router.push("/")}
            className="px-10 py-4 bg-pink-600 text-white font-medium rounded-full text-lg hover:bg-pink-700 transition shadow-lg hover:shadow-xl"
          >
            Back to Home
          </button>

          <button
            onClick={() => router.push("/contact")} // ya /waitlist agar bana hai
            className="px-10 py-4 bg-white text-pink-600 font-medium rounded-full text-lg border-2 border-pink-300 hover:bg-pink-50 transition shadow"
          >
            Get Notified on Launch
          </button>
        </div>

        {/* Small teaser */}
        <p className="text-sm text-gray-500 mt-12">
          Private • Secure • Only for you and your partner
        </p>

      </div>

      {/* Footer */}
      <div className="mt-auto py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Love Timeline • Made with ❤️
      </div>

    </div>
  );
}