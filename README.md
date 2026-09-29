# Prathvi Group of College - Full Stack Web Application

This is a complete, production-ready, fully responsive web application for **Prathvi Group of College**. Built using Next.js 15 (App Router), Tailwind CSS, TypeScript, and Prisma (PostgreSQL).

## Project Features

- **Dynamic Public Pages:** Home, About, Colleges & Courses, Gallery, Contact.
- **Admin Panel:** Complete CMS to manage Colleges, Courses, About content, Contact details, Gallery images/videos, and incoming Enquiries.
- **Real-time Updates:** Uses Next.js Server Actions with `revalidatePath` to instantly update the public site when the admin makes changes—no redeploys required.
- **WhatsApp Integration:** Floating WhatsApp button for direct enquiries with pre-filled messages dynamically constructed based on user interest.
- **Image Uploads:** Cloudinary integration for secure, signed uploads directly from the client.
- **Stateless Authentication:** JWT-based secure authentication for the admin panel.

## Tech Stack

- **Framework:** Next.js 15.2 (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom UI components
- **Database ORM:** Prisma
- **Database:** PostgreSQL (Neon)
- **File Storage:** Cloudinary
- **Form Handling & Validation:** React Hook Form + Zod
- **Icons:** Lucide React

## Setup & Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in your actual credentials.
   ```bash
   cp .env.example .env
   ```
   **Required variables:**
   - `DATABASE_URL`: PostgreSQL connection string (e.g., Neon).
   - `JWT_SECRET`: A secure random string for signing admin tokens.
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name.
   - `CLOUDINARY_API_KEY`: Cloudinary API key.
   - `CLOUDINARY_API_SECRET`: Cloudinary API secret.

3. **Database Setup**
   Push the schema to your database:
   ```bash
   npx prisma db push
   ```

4. **Seed the Database**
   This creates the default Admin account and initial About/Contact structures.
   ```bash
   npx prisma db seed
   ```
   *Default Admin Credentials:*
   - **Email:** admin@prathvigroup.edu.in
   - **Password:** admin123

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Access the public site at `http://localhost:3000` and the admin panel at `http://localhost:3000/admin`.

## Deployment (Vercel)

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repository.
4. **Important Configuration in Vercel:**
   - Framework Preset: **Next.js**
   - Build Command: `npx prisma db push && npm run build` (This ensures the database schema is pushed during deployment).
5. **Environment Variables:**
   Add all variables from your `.env` file to the Vercel project settings.
6. Click **Deploy**.

*Note: Once deployed, log in to the admin panel and change the default admin password (or delete the seed file and manually insert a secure hashed password using the `bcryptjs` structure).*

## Notes on the Implementation

- **No Placeholders or Mock Data:** The application fetches all data dynamically from the database. The admin must populate colleges, courses, gallery, and about information via the admin dashboard. Until data is added, pages will gracefully show empty states.
- **Aesthetics & UI/UX:** The design utilizes a premium Blue and Orange theme, reflecting the educational identity of Prathvi Group of College. It includes dynamic hover effects, masonry layouts, and responsive components.
- **Enquiry System:** When users submit an enquiry via the website form, it is saved in the database for the admin to review. Alternatively, they can send the enquiry directly via WhatsApp, which also logs the enquiry.

---

*Built for Prathvi Group of College.*
