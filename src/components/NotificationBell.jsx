// "use client";

// import { useState, useEffect } from "react";
// import { Bell, X, Check } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function NotificationBell() {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [isOpen, setIsOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Fetch notifications
//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/notifications");
//       const data = await res.json();

//       if (data.success) {
//         setNotifications(data.notifications || []);
//         setUnreadCount(data.unreadCount || 0);
//       }
//     } catch (err) {
//       console.error("Failed to fetch notifications", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Mark as Read
//   const markAsRead = async (id) => {
//     try {
//       await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
//       setNotifications(prev =>
//         prev.map(notif =>
//           notif._id === id ? { ...notif, isRead: true } : notif
//         )
//       );
//       setUnreadCount(prev => Math.max(0, prev - 1));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const markAllAsRead = async () => {
//     try {
//       await fetch("/api/notifications/mark-all-read", { method: "PATCH" });
//       setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
//       setUnreadCount(0);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//     // Har 30 seconds mein refresh (simple polling)
//     const interval = setInterval(fetchNotifications, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="relative">
//       {/* Bell Icon */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="relative p-2.5 rounded-full hover:bg-[#FADADD]/50 transition-colors"
//       >
//         <Bell size={22} className="text-[#4A2C2C]" />
//         <AnimatePresence>
//           {unreadCount > 0 && (
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white"
//             >
//               {unreadCount > 99 ? "99+" : unreadCount}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </button>

//       {/* Dropdown */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: 10, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 10, scale: 0.95 }}
//             className="absolute right-0 mt-2 w-96 bg-white rounded-3xl shadow-2xl border border-[#FADADD] overflow-hidden z-50"
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between px-6 py-4 border-b border-[#FADADD]">
//               <h3 className="font-serif font-bold text-xl text-[#4A2C2C]">Notifications</h3>
//               {unreadCount > 0 && (
//                 <button
//                   onClick={markAllAsRead}
//                   className="text-xs font-bold text-[#E91E63] hover:underline"
//                 >
//                   Mark all read
//                 </button>
//               )}
//             </div>

//             {/* Notifications List */}
//             <div className="max-h-[420px] overflow-y-auto">
//               {loading && notifications.length === 0 ? (
//                 <div className="p-8 text-center text-[#8B5E66]">Loading...</div>
//               ) : notifications.length === 0 ? (
//                 <div className="p-12 text-center">
//                   <div className="text-5xl mb-4">🔔</div>
//                   <p className="text-[#8B5E66]">No notifications yet</p>
//                 </div>
//               ) : (
//                 notifications.map((notif) => (
//                   <div
//                     key={notif._id}
//                     className={`px-6 py-4 border-b border-[#FADADD] hover:bg-[#FFF5F7] transition-colors ${
//                       !notif.isRead ? "bg-[#FFF0F4]" : ""
//                     }`}
//                   >
//                     <div className="flex gap-4">
//                       <div className="text-2xl flex-shrink-0 mt-1">
//                         {notif.type === "timeline_invite" && "💌"}
//                         {notif.type === "new_event" && "❤️"}
//                         {notif.type === "level_up" && "🎉"}
//                         {notif.type === "quiz_completed" && "📝"}
//                       </div>

//                       <div className="flex-1">
//                         <p className="font-semibold text-[#4A2C2C]">{notif.title}</p>
//                         <p className="text-sm text-[#8B5E66] mt-1 leading-relaxed">
//                           {notif.message}
//                         </p>
//                         <p className="text-[10px] text-[#8B5E66]/70 mt-2">
//                           {new Date(notif.createdAt).toLocaleDateString('en-IN', {
//                             day: 'numeric',
//                             month: 'short',
//                             hour: '2-digit',
//                             minute: '2-digit'
//                           })}
//                         </p>
//                       </div>

//                       {!notif.isRead && (
//                         <button
//                           onClick={() => markAsRead(notif._id)}
//                           className="self-start mt-1 text-[#E91E63]"
//                         >
//                           <Check size={18} />
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             {/* Footer */}
//             <div className="p-4 border-t border-[#FADADD] text-center">
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="text-xs font-bold text-[#8B5E66] hover:text-[#E91E63]"
//               >
//                 Close
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

import React from 'react'

const NotificationBell = () => {
  return (
    <div>N</div>
  )
}

export default NotificationBell