const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const BASE_URL = "http://localhost:5001";

async function request(method, path, body = null, headers = {}) {
  const url = new URL(path, BASE_URL);
  const bodyString = body ? JSON.stringify(body) : null;
  const reqHeaders = { ...headers };
  if (bodyString) {
    reqHeaders["Content-Type"] = "application/json";
    reqHeaders["Content-Length"] = Buffer.byteLength(bodyString);
  }

  return new Promise((resolve, reject) => {
    const req = http.request(
      url,
      { method, headers: reqHeaders },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        });
      }
    );

    req.on("error", reject);
    if (bodyString) req.write(bodyString);
    req.end();
  });
}

async function runTests() {
  console.log("=== Starting MediCare Security & Auth Test Suite (Experiment 6 RBAC) ===\n");
  let passed = 0;
  let total = 0;

  function assert(condition, description, detail = "") {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${description}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${description} ${detail ? `-> Details: ${JSON.stringify(detail)}` : ""}`);
    }
  }

  const patientEmail1 = `patient1_${Date.now()}@medicare.com`;
  const patientEmail2 = `patient2_${Date.now()}@medicare.com`;
  const doctorEmail1 = `doctor1_${Date.now()}@medicare.com`;
  const doctorEmail2 = `doctor2_${Date.now()}@medicare.com`;
  const testPassword = "password123";

  // 1. Setup Test Users
  console.log("--- Test 1: Register Test Patients and Doctors ---");
  const p1Reg = await request("POST", "/api/auth/patients/register", {
    name: "Patient One",
    email: patientEmail1,
    password: testPassword,
  });
  const p2Reg = await request("POST", "/api/auth/patients/register", {
    name: "Patient Two",
    email: patientEmail2,
    password: testPassword,
  });
  const d1Reg = await request("POST", "/api/auth/doctors/register", {
    name: "Dr. One",
    email: doctorEmail1,
    password: testPassword,
    specialization: "Cardiology",
  });
  const d2Reg = await request("POST", "/api/auth/doctors/register", {
    name: "Dr. Two",
    email: doctorEmail2,
    password: testPassword,
    specialization: "Neurology",
  });

  assert(
    p1Reg.status === 201 && p2Reg.status === 201 && d1Reg.status === 201 && d2Reg.status === 201,
    "Registered 2 patients and 2 doctors successfully"
  );

  // 2. Logins
  const p1Login = await request("POST", "/api/auth/patients/login", { email: patientEmail1, password: testPassword });
  const p2Login = await request("POST", "/api/auth/patients/login", { email: patientEmail2, password: testPassword });
  const d1Login = await request("POST", "/api/auth/doctors/login", { email: doctorEmail1, password: testPassword });
  const d2Login = await request("POST", "/api/auth/doctors/login", { email: doctorEmail2, password: testPassword });

  const p1Token = p1Login.data.token;
  const p2Token = p2Login.data.token;
  const d1Token = d1Login.data.token;
  const d2Token = d2Login.data.token;

  assert(
    p1Token && p2Token && d1Token && d2Token,
    "Logged in all test users and obtained tokens"
  );

  // 3. User Routes Tests (/api/user)
  console.log("\n--- Test 2: /api/user Routes & RBAC Authorization ---");

  // Dashboard (Any logged-in user)
  const userDashP1 = await request("GET", "/api/user/dashboard", null, { Authorization: `Bearer ${p1Token}` });
  assert(
    userDashP1.status === 200 && userDashP1.data.message === "Welcome to the protected dashboard" && userDashP1.data.user.role === "patient",
    "GET /api/user/dashboard as patient returns 200 and user object"
  );

  const userDashD1 = await request("GET", "/api/user/dashboard", null, { Authorization: `Bearer ${d1Token}` });
  assert(
    userDashD1.status === 200 && userDashD1.data.message === "Welcome to the protected dashboard" && userDashD1.data.user.role === "doctor",
    "GET /api/user/dashboard as doctor returns 200 and user object"
  );

  const userDashNoToken = await request("GET", "/api/user/dashboard");
  assert(
    userDashNoToken.status === 401 && userDashNoToken.data.message === "Access denied",
    "GET /api/user/dashboard without token returns 401"
  );

  // Patient Area (Patient only)
  const patientAreaOk = await request("GET", "/api/user/patient-area", null, { Authorization: `Bearer ${p1Token}` });
  assert(
    patientAreaOk.status === 200 && patientAreaOk.data.message === "Welcome Patient! You can access this page.",
    "GET /api/user/patient-area as patient returns 200"
  );

  const patientAreaDocFail = await request("GET", "/api/user/patient-area", null, { Authorization: `Bearer ${d1Token}` });
  assert(
    patientAreaDocFail.status === 403 && patientAreaDocFail.data.message === "Access denied. You do not have permission.",
    "GET /api/user/patient-area as doctor returns 403 forbidden"
  );

  // Doctor Area (Doctor only)
  const doctorAreaOk = await request("GET", "/api/user/doctor-area", null, { Authorization: `Bearer ${d1Token}` });
  assert(
    doctorAreaOk.status === 200 && doctorAreaOk.data.message === "Welcome Doctor! You can access this page.",
    "GET /api/user/doctor-area as doctor returns 200"
  );

  const doctorAreaPatientFail = await request("GET", "/api/user/doctor-area", null, { Authorization: `Bearer ${p1Token}` });
  assert(
    doctorAreaPatientFail.status === 403 && doctorAreaPatientFail.data.message === "Access denied. You do not have permission.",
    "GET /api/user/doctor-area as patient returns 403 forbidden"
  );

  // 4. Appointment Routes & Role Rules
  console.log("\n--- Test 3: Appointment Routes & Role Rules ---");

  // POST /api/appointments -> patient only, patientId set from req.user.id
  const createByDocFail = await request("POST", "/api/appointments", {
    patientId: p1Login.data.user.id,
    patientName: "Patient One",
    doctorId: d1Login.data.user.id,
    doctorName: "Dr. One",
    date: "2026-10-10",
    time: "10:00 AM",
  }, { Authorization: `Bearer ${d1Token}` });
  assert(
    createByDocFail.status === 403 && createByDocFail.data.message === "Access denied. You do not have permission.",
    "POST /api/appointments as doctor returns 403 forbidden"
  );

  const createByPatient = await request("POST", "/api/appointments", {
    patientId: "FAKE_PATIENT_ID_IN_BODY",
    patientName: "Patient One",
    doctorId: d1Login.data.user.id,
    doctorName: "Dr. One",
    date: "2026-10-10",
    time: "10:00 AM",
    reason: "Checkup",
  }, { Authorization: `Bearer ${p1Token}` });

  assert(
    createByPatient.status === 201 &&
    createByPatient.data._id &&
    createByPatient.data.patientId === p1Login.data.user.id,
    "POST /api/appointments sets patientId from req.user.id and ignores fake body patientId"
  );

  const apptId = createByPatient.data._id;

  // GET /api/appointments -> filtered by role
  const getApptsP1 = await request("GET", "/api/appointments", null, { Authorization: `Bearer ${p1Token}` });
  assert(
    getApptsP1.status === 200 && Array.isArray(getApptsP1.data) && getApptsP1.data.every(a => a.patientId === p1Login.data.user.id),
    "GET /api/appointments as patient returns patient's own appointments"
  );

  const getApptsP2 = await request("GET", "/api/appointments", null, { Authorization: `Bearer ${p2Token}` });
  assert(
    getApptsP2.status === 200 && Array.isArray(getApptsP2.data) && getApptsP2.data.length === 0,
    "GET /api/appointments as another patient returns empty list"
  );

  const getApptsD1 = await request("GET", "/api/appointments", null, { Authorization: `Bearer ${d1Token}` });
  assert(
    getApptsD1.status === 200 && Array.isArray(getApptsD1.data) && getApptsD1.data.some(a => a._id === apptId),
    "GET /api/appointments as assigned doctor returns appointment"
  );

  const getApptsD2 = await request("GET", "/api/appointments", null, { Authorization: `Bearer ${d2Token}` });
  assert(
    getApptsD2.status === 200 && Array.isArray(getApptsD2.data) && getApptsD2.data.length === 0,
    "GET /api/appointments as unassigned doctor returns empty list"
  );

  // Confirm appointment -> doctor only, doctorId === req.user.id
  const confirmByPatientFail = await request("PATCH", `/api/appointments/${apptId}`, { status: "confirmed" }, { Authorization: `Bearer ${p1Token}` });
  assert(
    confirmByPatientFail.status === 403 && confirmByPatientFail.data.message === "Access denied. You do not have permission.",
    "Confirming appointment as patient returns 403"
  );

  const confirmByOtherDocFail = await request("PATCH", `/api/appointments/${apptId}`, { status: "confirmed" }, { Authorization: `Bearer ${d2Token}` });
  assert(
    confirmByOtherDocFail.status === 403 && confirmByOtherDocFail.data.message === "Access denied. You do not have permission.",
    "Confirming appointment as unassigned doctor returns 403"
  );

  const confirmByAssignedDoc = await request("PATCH", `/api/appointments/${apptId}`, { status: "confirmed" }, { Authorization: `Bearer ${d1Token}` });
  assert(
    confirmByAssignedDoc.status === 200 && confirmByAssignedDoc.data.status === "confirmed",
    "Confirming appointment as assigned doctor succeeds (200)"
  );

  // Cancel appointment -> owning patient or assigned doctor only
  const cancelByOtherPatientFail = await request("PATCH", `/api/appointments/${apptId}`, { status: "cancelled" }, { Authorization: `Bearer ${p2Token}` });
  assert(
    cancelByOtherPatientFail.status === 403,
    "Cancelling appointment as unassigned patient returns 403"
  );

  const cancelByOwnerPatient = await request("PATCH", `/api/appointments/${apptId}`, { status: "cancelled" }, { Authorization: `Bearer ${p1Token}` });
  assert(
    cancelByOwnerPatient.status === 200 && cancelByOwnerPatient.data.status === "cancelled",
    "Cancelling appointment as owning patient succeeds (200)"
  );

  // DELETE -> doctor only
  const deleteByPatientFail = await request("DELETE", `/api/appointments/${apptId}`, null, { Authorization: `Bearer ${p1Token}` });
  assert(
    deleteByPatientFail.status === 403,
    "Deleting appointment as patient returns 403"
  );

  const deleteByDocOk = await request("DELETE", `/api/appointments/${apptId}`, null, { Authorization: `Bearer ${d1Token}` });
  assert(
    deleteByDocOk.status === 200 && deleteByDocOk.data.message === "Appointment deleted successfully",
    "Deleting appointment as assigned doctor succeeds (200)"
  );

  console.log(`\n================================`);
  console.log(`RESULTS: ${passed}/${total} Tests Passed`);
  console.log(`================================`);

  return passed === total;
}

const app = express();
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});
app.use(limiter);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("MediCare API is Running"));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const server = app.listen(5001, async () => {
      console.log("Test Server running on port 5001");
      let allPassed = false;
      try {
        allPassed = await runTests();
      } catch (err) {
        console.error("Test execution failed:", err);
      } finally {
        server.close();
        await mongoose.disconnect();
        process.exit(allPassed ? 0 : 1);
      }
    });
  })
  .catch((err) => {
    console.error("Failed to connect MongoDB:", err);
    process.exit(1);
  });
