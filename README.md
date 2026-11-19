# Sanjana Tiwari - Portfolio (MongoDB)
React + Vite + Vercel serverless API + MongoDB Atlas.
`/#admin` se login -> Edit -> Save & publish. Default content `src/data.json` me hai.

Vercel > Settings > Environment Variables me ye 4 daalo:
- MONGODB_URI  (Atlas connection string)
- ADMIN_EMAIL  (sanjanat0609@gmail.com)
- ADMIN_PASSWORD  (jo password tum login ke liye rakhna chahti ho)
- AUTH_SECRET  (koi lamba random text)

`vercel.json` ka daily cron /api/site ko call karta hai, taaki Atlas free cluster inactive na ho.
Edit/login sirf deploy hui site par chalta hai (local `npm run dev` par /api nahi hota).
