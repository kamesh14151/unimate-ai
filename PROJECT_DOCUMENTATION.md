# Meow University Admission Assistant - Project Documentation

## 1. Project Overview
The **Meow University Admission Assistant** is a comprehensive web-based platform designed to streamline the university enquiry process. At its core, the project addresses the challenge of high-volume, repetitive admission queries by integrating a specialized AI-driven chatbot. This solution provides students with 24/7 access to critical information regarding courses, fees, eligibility, and application procedures, thereby reducing the administrative burden on faculty and staff.

### 1.1 Problem Statement
Prospective students often face delays in receiving answers to common questions, such as:
- What are the admission deadlines?
- What is the fee structure for B.Tech?
- Which documents are required for enrollment?
- Am I eligible for the MBA program?

Manual handling of these repetitive enquiries is time-consuming for university administration and can lead to inconsistent information delivery.

### 1.2 Solution
The project implements a modern, responsive university portal with a persistent **AI Admission Assistant**. The chatbot uses a dual-response strategy:
1. **Deterministic Path:** Instant, structured responses for core admission topics based on a verified local dataset.
2. **AI Path:** A fallback mechanism using a Supabase Edge Function and Large Language Model (LLM) to handle broader natural language queries while remaining within the admission domain.

---

## 2. Technical Architecture

### 2.1 Frontend Stack
The frontend is built with a focus on performance, type safety, and modern user experience:
- **Framework:** React with TypeScript for robust, maintainable code.
- **Build Tool:** Vite for fast development and optimized production builds.
- **Styling:** Tailwind CSS for a utility-first, responsive design.
- **Animations:** Framer Motion for smooth UI transitions and chat interactions.
- **Navigation:** React Router for multi-page routing (`/`, `/programs`, `/admissions`, `/campus`).
- **Icons:** Lucide React for consistent, high-quality iconography.

### 2.2 Backend & Infrastructure
The project leverages a serverless architecture for scalability and ease of deployment:
- **Supabase:** Used as the primary Backend-as-a-Service (BaaS) provider.
- **Edge Functions:** A Deno-based Supabase Edge Function (`chat`) handles AI logic and communicates with the AI Gateway.
- **Database:** A PostgreSQL table `chat_history` logs all interactions for later analysis and improvement.
- **AI Gateway:** Connects to the `google/gemini-3-flash-preview` model (via Lovable AI Gateway) to process complex queries.

---

## 3. Features and Functionality

### 3.1 Multi-Page University Portal
The website includes several dedicated sections to provide a realistic university experience:
| Page | Description |
| :--- | :--- |
| **Home** | Overview of university achievements, accreditation (NAAC A+), and quick links. |
| **Programs** | Detailed listing of available courses across various schools (Engineering, Computing, Management). |
| **Admissions** | Central hub for admission requirements, required documents, and the application timeline. |
| **Campus** | Highlights of university infrastructure, student life, and key statistics. |

### 3.2 Intelligent Chatbot Assistant
The chatbot is the project's standout feature, accessible via a floating widget on every page.
- **Context-Aware Responses:** Grounded in a central JSON dataset (`admissionData.json`).
- **Quick Questions:** One-tap buttons for the most common queries (Procedure, Documents, Eligibility, Dates).
- **Theme Support:** Fully compatible with light and dark modes.
- **Conversation Logging:** Automatically saves user messages and assistant replies to Supabase.
- **Streaming UI:** Includes a typing indicator and smooth message rendering for a natural feel.

---

## 4. Data Model & Knowledge Base
The chatbot's knowledge is primarily derived from a structured JSON configuration. This ensures that the information provided is always accurate and easy for university staff to update without modifying code.

### 4.1 Admission Dataset Structure
```json
{
  "university": "Meow University",
  "courses": [
    {
      "name": "B.Tech",
      "duration": "4 years",
      "eligibility": "12th with Physics, Chemistry, Mathematics",
      "fees": "₹1,20,000 per year"
    }
    // ... other courses
  ],
  "admission": {
    "start_date": "May 1",
    "end_date": "July 31",
    "mode": "Online"
  },
  "contact": {
    "phone": "+91 9876543210",
    "email": "admissions@meowuniversity.edu"
  }
}
```

---

## 5. Development and Deployment

### 5.1 Prerequisites
- Node.js (v18+)
- Supabase Account and CLI
- Lovable/OpenAI API Key (for AI features)

### 5.2 Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/kamesh14151/ai-rtps-clg-project.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

### 5.3 Database Migration
The `chat_history` table can be initialized using the provided migration script:
```sql
CREATE TABLE public.chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_message TEXT NOT NULL,
    bot_reply TEXT NOT NULL,
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. Future Roadmap
- **Document Pre-check:** Implement file upload handling for initial document verification.
- **Admin Dashboard:** Create a CMS for real-time updates to admission data.
- **Analytics:** Integrate a dashboard to track common student concerns and enquiry trends.
- **Multilingual Support:** Expand chatbot capabilities to support regional languages.

---

## 7. Conclusion
The **Meow University Admission Assistant** demonstrates a practical application of AI in higher education. By combining a robust React frontend with a serverless AI backend, the project provides a scalable, user-friendly solution to a real-world administrative challenge.
