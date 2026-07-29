# MERN Basic E-commerce — Bangla Setup Guide

এই project-এ আছে:

- User registration, login, logout
- JWT authentication
- Product list, details, search, category filter, price sorting
- LocalStorage cart
- Cash on Delivery checkout
- User order history
- Admin product add/edit/delete
- Admin order status update
- Responsive basic UI

## 1) যেসব software লাগবে

1. Node.js (supported LTS version)
2. VS Code
3. MongoDB Atlas account অথবা local MongoDB
4. একটি browser

Node.js ঠিকমতো install হয়েছে কি না Terminal-এ দেখুন:

```bash
node -v
npm -v
```

## 2) Project folder খুলুন

ZIP extract করে VS Code-এ `mern-basic-ecommerce` folder খুলুন।

VS Code menu:

```text
File > Open Folder > mern-basic-ecommerce
```

## 3) Dependencies install করুন

Root folder-এর terminal-এ:

```bash
npm install
npm run install-all
```

## 4) Backend environment file তৈরি করুন

`server/.env.example` copy করে একই folder-এ `.env` নামে save করুন।

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Local MongoDB ব্যবহার করলে:

```env
MONGO_URI=mongodb://127.0.0.1:27017/mern_basic_shop
```

MongoDB Atlas ব্যবহার করলে Atlas connection string বসান। Password-এ special character থাকলে URL encode করতে হতে পারে।

## 5) Sample data এবং admin তৈরি করুন

```bash
npm run seed
```

Sample login:

```text
Admin: admin@example.com / Admin123!
User:  user@example.com / User123!
```

এগুলো শুধু development-এর জন্য। পরে password বদলাবেন।

## 6) Project চালান

Root terminal-এ:

```bash
npm run dev
```

তারপর browser-এ:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000/api/health
```

## 7) Project বন্ধ করুন

Terminal-এ:

```text
Ctrl + C
```

## 8) Folder structure

```text
mern-basic-ecommerce/
├── package.json
├── README_BN.md
├── server/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── config/db.js
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── utils/
│       └── server.js
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── .env.example
    └── src/
        ├── api/
        ├── components/
        ├── context/
        ├── pages/
        ├── App.jsx
        ├── main.jsx
        └── styles.css
```

## 9) Backend file-এর কাজ

- `server/src/server.js`: Express server start করে এবং routes connect করে।
- `config/db.js`: MongoDB connection।
- `models/`: MongoDB collection-এর structure।
- `controllers/`: প্রতিটি API কী কাজ করবে।
- `routes/`: API URL define করে।
- `middleware/authMiddleware.js`: JWT check এবং admin check।
- `utils/seed.js`: sample users/products তৈরি করে।

## 10) Frontend file-এর কাজ

- `main.jsx`: React application start করে।
- `App.jsx`: সব page route।
- `context/AuthContext.jsx`: logged-in user manage করে।
- `context/CartContext.jsx`: shopping cart manage করে।
- `api/axios.js`: backend-এর সঙ্গে request করে।
- `pages/`: আলাদা screen।
- `components/`: reusable UI parts।

## 11) API list

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products          Admin
PUT    /api/products/:id      Admin
DELETE /api/products/:id      Admin
```

### Orders

```text
POST /api/orders
GET  /api/orders/my
GET  /api/orders             Admin
PUT  /api/orders/:id/status  Admin
```

### Users

```text
GET /api/users                Admin
```

## 12) নিজের product image ব্যবহার

এই basic version-এ product model-এ image URL রাখা হয়। Admin panel থেকে public image URL দিতে পারবেন। পরে Cloudinary বা অন্য upload service যোগ করা যাবে।

## 13) Common errors

### MongoDB connection error

- `MONGO_URI` ঠিক আছে কি না দেখুন।
- Atlas Network Access-এ আপনার IP allow করুন।
- Database user/password ঠিক আছে কি না দেখুন।

### Port already in use

`server/.env`-এ port বদলাতে পারেন:

```env
PORT=5001
```

তখন `client/vite.config.js`-এর proxy target-ও 5001 করুন।

### Unauthorized

Logout করে আবার login করুন। JWT secret বদলালে পুরোনো token আর কাজ করবে না।

### Admin panel দেখা যাচ্ছে না

Admin account দিয়ে login করুন। Seed command আবার চালালে development database reset হবে।

## 14) Production build test

প্রথমে `server/.env`-এ লিখুন:

```env
NODE_ENV=production
```

তারপর:

```bash
npm run build
npm start
```

Browser-এ `http://localhost:5000` খুলুন। Production deployment করার আগে environment variables, CORS URL, secure secrets এবং database access ঠিকভাবে configure করতে হবে।
