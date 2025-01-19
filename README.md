# TaskForce Wallet Web Application

A comprehensive web application for tracking personal finances across multiple accounts, built with React + Vite and integrated with a Spring Boot backend.

## 🚀 Live Demo

- Frontend: [TaskForce Wallet](https://taskforce-wallet.vercel.app)
- Backend API:
  - Primary: [Render](https://wallet-jxd5.onrender.com)
  - Secondary: [AWS EC2](http://ec2-13-60-163-227.eu-north-1.compute.amazonaws.com)

## ✨ Features

- **Multi-Account Transaction Tracking**

  - Monitor transactions across various accounts (bank, mobile money, cash)
  - Real-time transaction updates and balance tracking

- **Budget Management**

  - Set spending limits with customizable thresholds
  - Receive notifications when approaching or exceeding budget limits

- **Expense Categorization**

  - Create and manage expense categories and subcategories
  - Link transactions to specific categories for better organization
  - Intuitive category management interface

- **Reporting & Analytics**

  - Generate detailed financial reports for any time period
  - Visualize spending patterns through interactive charts
  - Track spending trends across different categories

- **Secure Authentication**
  - User registration and login functionality
  - Protected routes and secure API integration

## 🛠️ Built With

- [React](https://reactjs.org/) - Frontend framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Spring Boot](https://spring.io/projects/spring-boot) - Backend API

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- npm or yarn package manager
- Git

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/kirengamartial/Taskforce-wallet.git
   cd Taskforce-wallet
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=Your_backend_url
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## 🔗 Related Repositories

- Backend Repository: [Taskforce-wallet-bn](https://github.com/kirengamartial/Taskforce-wallet-bn)

## 📱 Application Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable UI components
├── pages/          # Application pages/routes
├── services/       # API integration services
├── store/          # State management
├── styles/         # Global styles and Tailwind config
└── utils/          # Helper functions and utilities
```

## 👨‍💻 Author

Martial Kirenga - [GitHub Profile](https://github.com/kirengamartial)
