const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Doctor = require("./models/Doctor");
const Patient = require("./models/Patient");
const Appointment = require("./models/Appointment");

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding");

    // Clear existing data
    await Doctor.deleteMany({});
    console.log("Cleared existing doctors");

    await Patient.deleteMany({});
    console.log("Cleared existing patients");

    await Appointment.deleteMany({});
    console.log("Cleared existing appointments");

    // Hash default password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Seed sample Patient
    const samplePatient = await Patient.create({
      name: "John Doe",
      email: "john@email.com",
      password: hashedPassword,
      phone: "1234567890",
      role: "patient",
    });
    console.log(`Created sample patient: ${samplePatient.name} (${samplePatient.email}) — ID: ${samplePatient._id}`);

    // Seed doctors
    const doctorsData = [
      {
        name: "Dr. Sarah Johnson",
        email: "sarah@medicare.com",
        password: hashedPassword,
        specialization: "Cardiologist",
        rating: 4.9,
        experience: 12,
        available: true,
        role: "doctor",
      },
      {
        name: "Dr. Michael Chen",
        email: "michael@medicare.com",
        password: hashedPassword,
        specialization: "Neurologist",
        rating: 4.8,
        experience: 15,
        available: true,
        role: "doctor",
      },
      {
        name: "Dr. Emily Williams",
        email: "emily@medicare.com",
        password: hashedPassword,
        specialization: "Pediatrician",
        rating: 4.9,
        experience: 8,
        available: false,
        role: "doctor",
      },
      {
        name: "Dr. James Anderson",
        email: "james@medicare.com",
        password: hashedPassword,
        specialization: "Orthopedic Surgeon",
        rating: 4.7,
        experience: 20,
        available: false,
        role: "doctor",
      },
      {
        name: "Dr. Lisa Martinez",
        email: "lisa@medicare.com",
        password: hashedPassword,
        specialization: "Dermatologist",
        rating: 4.8,
        experience: 10,
        available: true,
        role: "doctor",
      },
      {
        name: "Dr. Robert Taylor",
        email: "robert@medicare.com",
        password: hashedPassword,
        specialization: "General Physician",
        rating: 4.6,
        experience: 18,
        available: true,
        role: "doctor",
      },
    ];

    const insertedDoctors = await Doctor.insertMany(doctorsData);
    console.log(`Inserted ${insertedDoctors.length} doctors`);

    // Create appointments mapped to the created patient and doctors
    const appointmentsData = [
      {
        patientId: samplePatient._id.toString(),
        patientName: samplePatient.name,
        doctorId: insertedDoctors[0]._id.toString(),
        doctorName: insertedDoctors[0].name,
        date: "2024-08-27",
        time: "09:00 AM",
        status: "confirmed",
        reason: "Regular checkup",
      },
      {
        patientId: samplePatient._id.toString(),
        patientName: samplePatient.name,
        doctorId: insertedDoctors[1]._id.toString(),
        doctorName: insertedDoctors[1].name,
        date: "2024-08-27",
        time: "10:30 AM",
        status: "pending",
        reason: "Follow-up consultation",
      },
      {
        patientId: samplePatient._id.toString(),
        patientName: samplePatient.name,
        doctorId: insertedDoctors[2]._id.toString(),
        doctorName: insertedDoctors[2].name,
        date: "2024-08-27",
        time: "02:00 PM",
        status: "cancelled",
        reason: "Initial consultation",
      },
      {
        patientId: samplePatient._id.toString(),
        patientName: samplePatient.name,
        doctorId: insertedDoctors[0]._id.toString(),
        doctorName: insertedDoctors[0].name,
        date: "2024-08-27",
        time: "03:30 PM",
        status: "confirmed",
        reason: "Prescription renewal",
      },
      {
        patientId: samplePatient._id.toString(),
        patientName: samplePatient.name,
        doctorId: insertedDoctors[1]._id.toString(),
        doctorName: insertedDoctors[1].name,
        date: "2024-08-28",
        time: "11:00 AM",
        status: "pending",
        reason: "Lab results review",
      },
    ];

    const insertedAppointments = await Appointment.insertMany(appointmentsData);
    console.log(`Inserted ${insertedAppointments.length} appointments`);

    console.log("\n--- Seeded Patient ---");
    console.log(`  ${samplePatient.name} (${samplePatient.email}) — ID: ${samplePatient._id}`);

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
