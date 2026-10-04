const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const authRoutes = require("./routes/authRoutes");

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
  console.log("=== Starting MediCare Security & Auth Test Suite ===\n");
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

  const testEmail = `testpatient_${Date.now()}@medicare.com`;
  const testPassword = "securePassword123";

  // 1. Register a patient -> 201, "User registered successfully"
  console.log("--- Test 1: Register a Patient ---");
  const reg1 = await request("POST", "/api/auth/patients/register", {
    name: "Alice Test",
    email: testEmail,
    password: testPassword,
    phone: "1234567890",
  });
  assert(
    reg1.status === 201 && reg1.data.userId && reg1.data.message === "User registered successfully",
    "Register a patient returns 201 with userId",
    reg1
  );

  // 2. Register the same email again -> 409, "User already exists"
  console.log("\n--- Test 2: Register Duplicate Email ---");
  const reg2 = await request("POST", "/api/auth/patients/register", {
    name: "Alice Duplicate",
    email: testEmail,
    password: testPassword,
  });
  assert(
    reg2.status === 409 && reg2.data.message === "User already exists",
    "Register duplicate email returns 409 'User already exists'",
    reg2
  );

  // 2b. Register with invalid input (express-validator check)
  console.log("\n--- Test 2b: Input Validation (Short password & invalid email) ---");
  const regInvalid = await request("POST", "/api/auth/patients/register", {
    name: "",
    email: "not-an-email",
    password: "123",
  });
  assert(
    regInvalid.status === 400 && regInvalid.data.errors?.length > 0,
    "Invalid input returns 400 with validation errors",
    regInvalid
  );

  // 3. Login with correct credentials -> 200, returns a JWT token
  console.log("\n--- Test 3: Login with Correct Credentials ---");
  const loginSuccess = await request("POST", "/api/auth/patients/login", {
    email: testEmail,
    password: testPassword,
  });
  const token = loginSuccess.data.token;
  assert(
    loginSuccess.status === 200 &&
    typeof token === "string" &&
    token.length > 20 &&
    loginSuccess.data.user.email === testEmail &&
    loginSuccess.data.user.role === "patient",
    "Login with correct credentials returns 200 and valid JWT token",
    loginSuccess.data
  );

  // 4. Login with wrong password -> 401, "Invalid email or password"
  console.log("\n--- Test 4: Login with Wrong Password ---");
  const loginWrongPass = await request("POST", "/api/auth/patients/login", {
    email: testEmail,
    password: "WrongPassword999",
  });
  assert(
    loginWrongPass.status === 401 && loginWrongPass.data.message === "Invalid email or password",
    "Login with wrong password returns 401 'Invalid email or password'",
    loginWrongPass.data
  );

  // 5. GET /api/auth/patients/profile with Bearer <token> -> 200, returns user data WITHOUT password
  console.log("\n--- Test 5: GET Profile with Valid Token ---");
  const profileSuccess = await request("GET", "/api/auth/patients/profile", null, {
    Authorization: `Bearer ${token}`,
  });
  assert(
    profileSuccess.status === 200 &&
    profileSuccess.data.email === testEmail &&
    profileSuccess.data.password === undefined,
    "GET Profile with valid token returns 200 and password excluded",
    profileSuccess.data
  );

  // 6. GET /api/auth/patients/profile with no token -> 401 "Access denied"
  console.log("\n--- Test 6: GET Profile with No Token ---");
  const profileNoToken = await request("GET", "/api/auth/patients/profile");
  assert(
    profileNoToken.status === 401 && profileNoToken.data.message === "Access denied",
    "GET Profile with no token returns 401 'Access denied'",
    profileNoToken.data
  );

  // 7. GET /api/auth/patients/profile with garbage/invalid token -> 401 "Invalid or expired token"
  console.log("\n--- Test 7: GET Profile with Invalid Token ---");
  const profileInvalidToken = await request("GET", "/api/auth/patients/profile", null, {
    Authorization: "Bearer garbage_fake_token_12345",
  });
  assert(
    profileInvalidToken.status === 401 && profileInvalidToken.data.message === "Invalid or expired token",
    "GET Profile with invalid token returns 401 'Invalid or expired token'",
    profileInvalidToken.data
  );

  // 8. Doctor auth flow
  console.log("\n--- Test 8: Doctor Login & Profile ---");
  const docLogin = await request("POST", "/api/auth/doctors/login", {
    email: "sarah@medicare.com",
    password: "password123",
  });
  assert(
    docLogin.status === 200 &&
    docLogin.data.token &&
    docLogin.data.user.role === "doctor" &&
    docLogin.data.user.specialization === "Cardiologist",
    "Doctor login returns 200, JWT token, and doctor info",
    docLogin.data
  );

  const docProfile = await request("GET", "/api/auth/doctors/profile", null, {
    Authorization: `Bearer ${docLogin.data.token}`,
  });
  assert(
    docProfile.status === 200 &&
    docProfile.data.email === "sarah@medicare.com" &&
    docProfile.data.password === undefined,
    "Doctor profile returned with password excluded",
    docProfile.data
  );

  // 9. Protected Appointments Routes
  console.log("\n--- Test 9: Protected Appointment Route Validation ---");
  const createUnauthAppt = await request("POST", "/api/appointments", {
    patientId: "test",
    patientName: "Alice",
    doctorId: "doc1",
    doctorName: "Dr. Sarah",
    date: "2026-10-01",
    time: "10:00 AM",
  });
  assert(
    createUnauthAppt.status === 401 && createUnauthAppt.data.message === "Access denied",
    "POST /api/appointments without token returns 401",
    createUnauthAppt.data
  );

  const createAuthAppt = await request(
    "POST",
    "/api/appointments",
    {
      patientId: loginSuccess.data.user.id,
      patientName: "Alice Test",
      doctorId: docLogin.data.user.id,
      doctorName: "Dr. Sarah Johnson",
      date: "2026-10-01",
      time: "10:00 AM",
      reason: "Routine Checkup",
    },
    {
      Authorization: `Bearer ${token}`,
    }
  );
  assert(
    createAuthAppt.status === 201 && createAuthAppt.data._id,
    "POST /api/appointments with valid token creates appointment (201)",
    createAuthAppt.data
  );

  // 10. Rate Limiter Test (Send rapid requests)
  console.log("\n--- Test 10: Rate Limiting ---");
  let rateLimited = false;
  let requestsSent = 0;
  for (let i = 0; i < 110; i++) {
    const res = await request("GET", "/");
    requestsSent++;
    if (res.status === 429) {
      rateLimited = true;
      break;
    }
  }
  assert(
    rateLimited,
    `Rate limiter triggered 429 Too Many Requests after ${requestsSent} requests`,
    { requestsSent }
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
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});
app.use(limiter);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("MediCare API is Running"));
app.use("/api/auth", authRoutes);
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
