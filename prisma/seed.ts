import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@prathvigroup.edu.in";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.admin.create({
      data: {
        email: adminEmail,
        passwordHash,
      },
    });
    console.log(`✅ Admin created: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Admin already exists: ${adminEmail}`);
  }

  // Create default About content
  const aboutCount = await prisma.aboutContent.count();
  if (aboutCount === 0) {
    await prisma.aboutContent.create({
      data: {
        title: "About Prathvi Group of College",
        description:
          "Prathvi Group of College is a premier educational institution located in Gwalior, Madhya Pradesh. Established with a vision to provide quality education, we offer a wide range of professional and vocational courses across multiple disciplines. Our colleges are equipped with modern infrastructure, experienced faculty, and a student-centric learning environment that nurtures academic excellence and holistic development.",
        vision:
          "To be a leading educational institution in Central India, recognized for academic excellence, innovation, and producing socially responsible graduates who contribute meaningfully to society and the nation.",
        mission:
          "To provide accessible, affordable, and quality education through experienced faculty, modern infrastructure, and industry-relevant curricula. We are committed to the holistic development of students — academic, professional, and personal — preparing them for rewarding careers and responsible citizenship.",
      },
    });
    console.log("✅ Default About content created");
  }

  // Create default Contact Details
  const contactCount = await prisma.contactDetails.count();
  if (contactCount === 0) {
    await prisma.contactDetails.create({
      data: {
        address:
          "Vill. Khureri, Behind Devraj Hospital, Morar, Gwalior, Madhya Pradesh - 474006",
        phones: ["9826000001", "9826000002"],
        emails: ["info@prathvigroup.edu.in", "admissions@prathvigroup.edu.in"],
        whatsappNumber: "",
        whatsappGreeting:
          "Hello Prathvi Group of College! I would like to know more about your courses and admissions.",
        workingHours: "Monday - Saturday: 9:00 AM – 5:00 PM",
        mapEmbedUrl: "",
        facebook: "",
        instagram: "",
        youtube: "",
        twitter: "",
        linkedin: "",
      },
    });
    console.log("✅ Default Contact Details created");
  }

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
