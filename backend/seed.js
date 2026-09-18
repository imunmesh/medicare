const mongoose = require("mongoose");
require("dotenv").config();

const Doctor = require("./models/Doctor");
const Appointment = require("./models/Appointment");

// Seed data — doctors from the original db.json, with email addresses for login
const doctors = [
  {
    name: "Dr. Sarah Johnson",
    email: "sarah@medicare.com",
    specialization: "Cardiologist",
    rating: 4.9,
    experience: 12,
    available: true,
  },
  {
    name: "Dr. Michael Chen",
    email: "michael@medicare.com",
    specialization: "Neurologist",
    rating: 4.8,
    experience: 15,
    available: true,
  },
  {
    name: "Dr. Emily Williams",
    email: "emily@medicare.com",
    specialization: "Pediatrician",
    rating: 4.9,
    experience: 8,
    available: false,
  },
  {
    name: "Dr. James Anderson",
    email: "james@medicare.com",
    specialization: "Orthopedic Surgeon",
    rating: 4.7,
    experience: 20,
    available: false,
  },
  {
    name: "Dr. Lisa Martinez",
    email: "lisa@medicare.com",
    specialization: "Dermatologist",
    rating: 4.8,
    experience: 10,
    available: true,
  },
  {
    name: "Dr. Robert Taylor",
    email: "robert@medicare.com",
    specialization: "General Physician",
    rating: 4.6,
    experience: 18,
    available: true,
  },
];

// Seed data — sample appointments from db.json
const appointments = [
  {
    patientId: "1",
    patientName: "John Doe",
    doctorId: "1",
    doctorName: "Dr. Sarah Johnson",
    date: "2024-08-27",
    time: "09:00 AM",
    status: "cancelled",
    reason: "Regular checkup",
  },
  {
    patientId: "1",
    patientName: "John Doe",
    doctorId: "2",
    doctorName: "Dr. Michael Chen",
    date: "2024-08-27",
    time: "10:30 AM",
    status: "cancelled",
    reason: "Follow-up consultation",
  },
  {
    patientId: "1",
    patientName: "John Doe",
    doctorId: "3",
    doctorName: "Dr. Emily Williams",
    date: "2024-08-27",
    time: "02:00 PM",
    status: "cancelled",
    reason: "Initial consultation",
  },
  {
    patientId: "1",
    patientName: "John Doe",
    doctorId: "1",
    doctorName: "Dr. Sarah Johnson",
    date: "2024-08-27",
    time: "03:30 PM",
    status: "cancelled",
    reason: "Prescription renewal",
  },
  {
    patientId: "1",
    patientName: "John Doe",
    doctorId: "2",
    doctorName: "Dr. Michael Chen",
    date: "2024-08-28",
    time: "11:00 AM",
    status: "cancelled",
    reason: "Lab results review",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding");

    // Clear existing data
    await Doctor.deleteMany({});
    console.log("Cleared existing doctors");

    await Appointment.deleteMany({});
    console.log("Cleared existing appointments");

    // Insert seed data
    const insertedDoctors = await Doctor.insertMany(doctors);
    console.log(`Inserted ${insertedDoctors.length} doctors`);

    const insertedAppointments = await Appointment.insertMany(appointments);
    console.log(`Inserted ${insertedAppointments.length} appointments`);

    console.log("\n--- Seeded Doctors ---");
    insertedDoctors.forEach((doc) => {
      console.log(`  ${doc.name} (${doc.email}) — ID: ${doc._id}`);
    });

    console.log("\n--- Seeded Appointments ---");
    insertedAppointments.forEach((appt) => {
      console.log(
        `  ${appt.patientName} → ${appt.doctorName} on ${appt.date} — ID: ${appt._id}`
      );
    });

    console.log("\nSeeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
