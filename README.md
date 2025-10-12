# 🛍️ Matjar

**Matjar** is a modern e-commerce web application that provides a smooth, responsive, and user-friendly online shopping experience.  
Built with **React**, **Tailwind CSS**, **Framer Motion**, and **Axios**, Matjar integrates full user authentication, cart management, and secure payment processing to deliver a real-world shopping experience.

---

## 🚀 Live Demo

🔗 [Visit Matjar Live Demo](https://am-mar7.github.io/Matjar/)

---

## ✨ Features

### 👤 User Authentication & Profile
- Full signup, login, and logout system using **JWT authentication**.
- Secure **password reset** and **forgot password** functionality.
- Editable **user profile** — users can update their name, email, and password.
- Authentication persistence using local storage and route protection.

---

## 🧠 Admin Dashboard (New)

A powerful **Admin Dashboard** has been added to manage and monitor all aspects of the application.

### 🧾 Dashboard Features
- **Overview cards** showing:
  - Total Revenue
  - Paid Orders
  - Users Count  
  *(all calculated dynamically for the latest 40 orders)*  
- **Orders Management**
  - View all orders with customer info, payment type, and status.
  - Inspect full order details including items, address, and payment data.
- **Users Management**
  - View all registered users.
  - Open each user to see their profile details and all their placed orders.
- **Charts & Insights**
  - Monthly orders visualization using **Recharts**.
- **Error Handling & Refresh**
  - Automatic background refetch and error fallback UI.
- **Responsive UI**
  - Optimized for both desktop and mobile.
  - Light theme built with `slate-50` and soft contrast colors.

---


### 🌍 Multi-language Support
- Built-in **Arabic / English language switcher** powered by **i18next**.

### 🛒 Shopping & Orders
- Fully functional **shopping cart** with quantity management.
- Two payment methods:
  - 💳 **Stripe** integration for online payments.
  - 🚚 **Cash on Delivery** option for local orders.
- **Orders Page** — users can track all placed orders with live status updates.

### ❤️ Favorites
- Users can add/remove products to a **favorites page** for easy access later.

### 📱 Responsive UI & Animations
- Fully responsive design optimized for all devices.
- Elegant, modern animations using **Framer Motion**.
- Clean, minimal UI powered by **Tailwind CSS** and modern layout practices.

### 🧭 Navigation & Routing
- Built using **React Router (Routes API)** for clean and intuitive navigation.
- Includes protected routes for authenticated pages.

---

## 🧰 Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Frontend** | React.js, React Router (Routes API) |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **HTTP Client** | Axios |
| **State & Data Fetching** | React Query |
| **Internationalization** | i18next |
| **Charts** | Recharts |
| **Payments** | Stripe |
| **Deployment** | GitHub Pages |

---

## 🧑‍💻 Developer

**Ammar Alaa Omar**  
📧 [ammaralaa470@gmail.com](mailto:ammaralaa470@gmail.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/ammar-alaa-am77)  
💻 [GitHub](https://github.com/am-mar7)

---

## 🏗️ Setup & Run Locally

```bash
git clone https://github.com/am-mar7/Matjar.git
cd Matjar
npm install
npm run dev
