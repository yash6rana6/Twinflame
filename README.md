love-timeline-app/
│
├── app/
│   ├── layout.js                 # Root layout (common header/footer)
│   ├── page.js                   # Homepage (landing page)
│   │
│   ├── quiz/
│   │   ├── page.js               # Quiz landing
│   │   ├── play/page.js          # Quiz questions page
│   │   └── result/[id]/page.js   # Quiz result page
│   │
│   ├── timeline/
│   │   ├── page.js               # Timeline landing
│   │   ├── create/page.js        # Create timeline form
│   │   ├── preview/[id]/page.js  # Preview before payment
│   │   └── view/[id]/page.js     # Final timeline (shareable link)
│   │
│   ├── whatsapp-bot/
│   │   ├── page.js               # Bot landing
│   │   ├── setup/page.js         # Setup messages
│   │   └── success/page.js       # Payment success
│   │
│   ├── pricing/
│   │   └── page.js               # Pricing page (all products)
│   │
│   ├── payment/
│   │   ├── checkout/page.js      # Payment gateway
│   │   └── success/page.js       # Payment success (all products)
│   │
│   └── api/
│       ├── quiz/
│       │   ├── submit/route.js   # Submit quiz answers
│       │   └── result/route.js   # Get quiz result
│       │
│       ├── timeline/
│       │   ├── create/route.js   # Create timeline
│       │   ├── extend/route.js   # Extend validity
│       │   └── get/route.js      # Fetch timeline data
│       │
│       ├── whatsapp/
│       │   ├── schedule/route.js # Schedule messages
│       │   └── send/route.js     # Send message (cron job)
│       │
│       └── payment/
│           ├── create-order/route.js  # Razorpay order
│           └── verify/route.js        # Verify payment
│
├── components/
│   ├── Navbar.js
│   ├── Footer.js
│   ├── QuizCard.js
│   ├── TimelineBuilder.js
│   ├── PricingCard.js
│   └── PaymentModal.js
│
├── lib/
│   ├── db.js                     # MongoDB connection
│   ├── razorpay.js               # Razorpay config
│   └── whatsapp.js               # WhatsApp API (Twilio/WATI)
│
├── models/
│   ├── User.js
│   ├── Quiz.js
│   ├── Timeline.js
│   └── WhatsAppBot.js
│
├── utils/
│   ├── generateLink.js           # Unique link generator
│   ├── checkExpiry.js            # Check timeline expiry
│   └── emailSender.js            # Send emails
│
├── public/
│   ├── images/
│   └── icons/
│
├── .env.local                    # Environment variables
├── package.json
└── next.config.js