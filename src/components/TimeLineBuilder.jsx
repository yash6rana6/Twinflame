'use client';
import { useState } from 'react';

export default function TimelineBuilder() {
  const [moments, setMoments] = useState([{ id: 1 }]);

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="relative border-l-2 border-[#B2AC88]/20 ml-4 pl-10 space-y-16">
        {moments.map((m) => (
          <div key={m.id} className="relative group">
            <div className="absolute -left-[51px] top-6 w-5 h-5 rounded-full bg-[#B2AC88] border-[4px] border-[#FDFDF5] shadow-sm group-hover:scale-125 transition-transform" />
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-[#B2AC88]/10">
              <input type="text" placeholder="Title: Our First Date" className="w-full text-xl font-serif mb-4 outline-none border-b border-transparent focus:border-[#B2AC88]/30 pb-2" />
              <div className="h-52 bg-[#F5F5DC]/40 border-2 border-dashed border-[#B2AC88]/20 rounded-3xl flex items-center justify-center mb-4 cursor-pointer hover:bg-[#F5F5DC]/60">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B2AC88]">Upload Photo</span>
              </div>
              <textarea placeholder="Write a note..." className="w-full bg-[#F9F9F4] p-4 rounded-2xl text-sm outline-none italic text-gray-500 resize-none" rows="2" />
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setMoments([...moments, { id: Date.now() }])} className="w-full mt-8 py-4 border-2 border-dashed border-[#B2AC88] rounded-[2rem] text-[#B2AC88] font-bold text-xs uppercase tracking-widest">+ Add Moment</button>
    </div>
  );
}