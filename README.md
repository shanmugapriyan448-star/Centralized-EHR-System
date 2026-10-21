# Centralized Electronic Health Record (EHR) System

A robust, full-stack MERN (MongoDB, Express.js, React 19 + Vite, Node.js) Electronic Health Record platform that provides role-tailored clinical and administrative workflows for Administrators, Doctors, and Patients.

---

## 🌟 Key Features

* **Role-Based Access Control (RBAC):** Three distinct portals for `admin`, `doctor`, and `patient` roles.
* **Authentication & Security:** JWT-based stateless authentication with bcrypt password hashing (10 salt rounds) and server-side route guards.
* **Administrator Portal:** System statistics, user directory management, patient profiles, doctor records, and compliance audit trail logging.
* **Doctor Clinical Portal:** Real-time appointment management, medical records viewing, digital prescriptions, and patient records.
* **Patient Portal:** Personal health records, clinical prescriptions, diagnostic reports, and appointment booking.
* **Audit Trail:** Automatic background logging of authentication events and data-modifying actions.

---

## 🛠️ Technology Stack

* **Frontend:** React 19, React Router DOM v7, Lucide React, Vite
* **Backend:** Node.js, Express.js, Mongoose ODM
* **Database:** MongoDB Community Server / MongoDB Atlas
* **Security:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, CORS

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher)
* [MongoDB](https://www.mongodb.com/try/download/community) running locally on port 27017

### 1. Backend Setup

```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000` (Health check: `http://localhost:5000/api/health`).*

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🔐 Default Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@ehr.com` | `Admin@123` |
| **Doctor** | `doctor@ehr.com` | `Doctor@123` |
| **Patient** | `patient@ehr.com` | `Patient@123` |

---

## 📄 Documentation

The complete project report and academic documentation are included:
* **Word Document:** `Centralized_EHR_Project_Report_Shanmugapriyan_S.docx`
* **PDF Report:** `Centralized_EHR_Project_Report_Shanmugapriyan_S.pdf`
