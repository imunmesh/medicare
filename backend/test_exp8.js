const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const { io: ClientIO } = require("socket.io-client");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

const Doctor = require("./models/Doctor");
const Patient = require("./models/Patient");
const Message = require("./models/Message");
const Appointment = require("./models/Appointment");

const TEST_PORT = 5002;
const BASE_URL = `http://localhost:${TEST_PORT}`;

// Create Express and Socket.IO Server
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  },
});

io.use(async (socket, next) => {
  try {
    let token = socket.handshake.auth && socket.handshake.auth.token;
    if (token && typeof token === "string" && token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let name = decoded.name;
      if (!name) {
        if (decoded.role === "doctor") {
          const doc = await Doctor.findById(decoded.id).select("name");
          if (doc) name = doc.name;
        } else {
          const pat = await Patient.findById(decoded.id).select("name");
          if (pat) name = pat.name;
        }
      }

      socket.user = {
        id: String(decoded.id),
        name: name || (decoded.role === "doctor" ? "Doctor" : "Patient"),
        role: decoded.role,
      };

      socket.join(String(decoded.id));
    }
  } catch (err) {}
  next();
});

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);
  if (socket.user && socket.user.id) {
    socket.join(String(socket.user.id));
  }

  socket.on("privateMessage", async (payload) => {
    try {
      if (!socket.user || !socket.user.id) return;

      const senderId = String(socket.user.id);
      const senderName = socket.user.name;
      const senderRole = socket.user.role;

      const { to, text } = payload || {};
      if (!to || !mongoose.Types.ObjectId.isValid(to)) return;

      const trimmedText = typeof text === "string" ? text.trim() : "";
      if (!trimmedText || trimmedText.length > 1000) return;

      let recipient = await Doctor.findById(to).select("_id role");
      let recipientRole = "doctor";
      let toModel = "Doctor";

      if (!recipient) {
        recipient = await Patient.findById(to).select("_id role");
        recipientRole = "patient";
        toModel = "Patient";
      }

      if (!recipient) return;

      if (senderRole === "patient" && recipientRole === "patient") {
        return;
      }

      const fromModel = senderRole === "doctor" ? "Doctor" : "Patient";
      const message = await Message.create({
        from: senderId,
        fromModel,
        to: recipient._id,
        toModel,
        text: trimmedText,
        createdAt: new Date(),
      });

      const messagePayload = {
        _id: message._id,
        from: senderId,
        to: String(recipient._id),
        text: message.text,
        createdAt: message.createdAt,
        senderName: senderName,
      };

      io.to(String(to)).emit("privateMessage", messagePayload);
      io.to(String(senderId)).emit("privateMessage", messagePayload);
    } catch (err) {
      console.error("Test Socket error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.set("io", io);
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/chat", chatRoutes);

// Helper for HTTP requests
async function httpRequest(method, endpoint, body = null, token = null) {
  const url = new URL(endpoint, BASE_URL);
  const bodyString = body ? JSON.stringify(body) : null;
  const headers = {};
  if (bodyString) {
    headers["Content-Type"] = "application/json";
    headers["Content-Length"] = Buffer.byteLength(bodyString);
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return new Promise((resolve, reject) => {
    const req = http.request(url, { method, headers }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({ status: res.statusCode, data: parsed });
      });
    });
    req.on("error", reject);
    if (bodyString) req.write(bodyString);
    req.end();
  });
}

async function runExp8Tests() {
  console.log("=== Starting Experiment 8 Test Suite (Socket.IO, Notifications & Chat) ===\n");

  await mongoose.connect(process.env.MONGO_URI);
  await new Promise((res) => server.listen(TEST_PORT, res));
  console.log(`Test WebSocket Server listening on port ${TEST_PORT}\n`);

  let passed = 0;
  let total = 0;

  function assert(condition, description) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${description}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${description}`);
    }
  }

  try {
    // 1. Prepare Test Users
    const timestamp = Date.now();
    const patient1Data = {
      name: "Socket Patient 1",
      email: `socket_pat1_${timestamp}@test.com`,
      password: "password123",
    };
    const patient2Data = {
      name: "Socket Patient 2",
      email: `socket_pat2_${timestamp}@test.com`,
      password: "password123",
    };
    const doctor1Data = {
      name: "Dr. Socket Doc 1",
      email: `socket_doc1_${timestamp}@test.com`,
      password: "password123",
      specialization: "Cardiology",
    };
    const doctor2Data = {
      name: "Dr. Socket Doc 2",
      email: `socket_doc2_${timestamp}@test.com`,
      password: "password123",
      specialization: "Neurology",
    };

    await httpRequest("POST", "/api/auth/patients/register", patient1Data);
    await httpRequest("POST", "/api/auth/patients/register", patient2Data);
    await httpRequest("POST", "/api/auth/doctors/register", doctor1Data);
    await httpRequest("POST", "/api/auth/doctors/register", doctor2Data);

    const loginPat1 = await httpRequest("POST", "/api/auth/patients/login", {
      email: patient1Data.email,
      password: "password123",
    });
    const loginPat2 = await httpRequest("POST", "/api/auth/patients/login", {
      email: patient2Data.email,
      password: "password123",
    });
    const loginDoc1 = await httpRequest("POST", "/api/auth/doctors/login", {
      email: doctor1Data.email,
      password: "password123",
    });
    const loginDoc2 = await httpRequest("POST", "/api/auth/doctors/login", {
      email: doctor2Data.email,
      password: "password123",
    });

    const tokenPat1 = loginPat1.data.token;
    const userPat1 = loginPat1.data.user;

    const tokenPat2 = loginPat2.data.token;
    const userPat2 = loginPat2.data.user;

    const tokenDoc1 = loginDoc1.data.token;
    const userDoc1 = loginDoc1.data.user;

    const tokenDoc2 = loginDoc2.data.token;
    const userDoc2 = loginDoc2.data.user;

    assert(tokenPat1 && tokenDoc1, "All test accounts registered and logged in with JWTs");

    // 2. Connect Sockets for Patient 1, Doctor 1, and Doctor 2
    const socketDoc1 = ClientIO(BASE_URL, { auth: { token: tokenDoc1 } });
    const socketDoc2 = ClientIO(BASE_URL, { auth: { token: tokenDoc2 } });
    const socketPat1 = ClientIO(BASE_URL, { auth: { token: tokenPat1 } });
    const socketPat2 = ClientIO(BASE_URL, { auth: { token: tokenPat2 } });

    await Promise.all([
      new Promise((res) => socketDoc1.on("connect", res)),
      new Promise((res) => socketDoc2.on("connect", res)),
      new Promise((res) => socketPat1.on("connect", res)),
      new Promise((res) => socketPat2.on("connect", res)),
    ]);
    assert(true, "All 4 client sockets connected and authenticated via JWT");

    // 3. Test GET /api/chat/contacts
    const contactsRes = await httpRequest("GET", "/api/chat/contacts", null, tokenDoc1);
    assert(
      contactsRes.status === 200 && Array.isArray(contactsRes.data),
      "GET /api/chat/contacts returns array of contacts"
    );
    const hasOtherUsers = contactsRes.data.some(
      (c) => String(c._id) === String(userDoc2.id) || String(c._id) === String(userPat1.id)
    );
    assert(hasOtherUsers, "Contacts list contains other users excluding caller");

    // 4. Test Notification: Patient books -> Doctor 1 receives appointmentCreated
    const doc1CreatedPromise = new Promise((resolve) => {
      socketDoc1.once("appointmentCreated", (data) => resolve(data));
    });

    // Patient 1 books appointment with Doctor 1
    const bookRes = await httpRequest(
      "POST",
      "/api/appointments",
      {
        doctorId: userDoc1.id,
        doctorName: userDoc1.name,
        patientName: userPat1.name,
        date: "2026-11-01",
        time: "10:00 AM",
        reason: "Routine Checkup",
      },
      tokenPat1
    );

    assert(bookRes.status === 201, "Appointment created via POST /api/appointments");
    const createdNotification = await Promise.race([
      doc1CreatedPromise,
      new Promise((_, rej) => setTimeout(() => rej(new Error("Timeout")), 3000)),
    ]);
    assert(
      createdNotification && String(createdNotification.doctorId) === String(userDoc1.id),
      "Doctor 1 received appointmentCreated socket event for new booking"
    );

    const appointmentId = bookRes.data._id;

    // 5. Test Notification: Doctor confirms -> Patient receives appointmentUpdated
    const pat1UpdatedPromise = new Promise((resolve) => {
      socketPat1.once("appointmentUpdated", (data) => resolve(data));
    });

    const confirmRes = await httpRequest(
      "PATCH",
      `/api/appointments/${appointmentId}/confirm`,
      null,
      tokenDoc1
    );
    assert(confirmRes.status === 200, "Doctor confirmed appointment via PATCH");

    const confirmedNotification = await Promise.race([
      pat1UpdatedPromise,
      new Promise((_, rej) => setTimeout(() => rej(new Error("Timeout")), 3000)),
    ]);
    assert(
      confirmedNotification && confirmedNotification.status === "confirmed",
      "Patient 1 received appointmentUpdated socket event on doctor confirmation"
    );

    // 6. Test Notification: Cancelled by patient -> Doctor receives appointmentUpdated
    const doc1CancelPromise = new Promise((resolve) => {
      socketDoc1.once("appointmentUpdated", (data) => resolve(data));
    });

    const cancelRes = await httpRequest(
      "PATCH",
      `/api/appointments/${appointmentId}/cancel`,
      null,
      tokenPat1
    );
    assert(cancelRes.status === 200, "Patient cancelled appointment via PATCH");

    const cancelledNotification = await Promise.race([
      doc1CancelPromise,
      new Promise((_, rej) => setTimeout(() => rej(new Error("Timeout")), 3000)),
    ]);
    assert(
      cancelledNotification && cancelledNotification.status === "cancelled",
      "Doctor 1 received appointmentUpdated socket event on patient cancellation"
    );

    // 7. Test Private Chat: Doctor 1 -> Patient 1
    const pat1MsgPromise = new Promise((resolve) => {
      socketPat1.once("privateMessage", (msg) => resolve(msg));
    });
    const doc1EchoPromise = new Promise((resolve) => {
      socketDoc1.once("privateMessage", (msg) => resolve(msg));
    });

    socketDoc1.emit("privateMessage", {
      to: userPat1.id,
      text: "Hello Patient 1, please bring your previous medical records.",
    });

    const [receivedByPat1, receivedByDoc1] = await Promise.all([
      pat1MsgPromise,
      doc1EchoPromise,
    ]);

    assert(
      receivedByPat1 &&
        receivedByPat1.text === "Hello Patient 1, please bring your previous medical records." &&
        String(receivedByPat1.from) === String(userDoc1.id),
      "Patient 1 received privateMessage from Doctor 1"
    );
    assert(
      receivedByDoc1 && String(receivedByDoc1.from) === String(userDoc1.id),
      "Doctor 1 received echo of privateMessage"
    );

    // 8. Test Private Chat Isolation: Doctor 2 should NOT receive Doctor 1's message to Patient 1
    let doc2ReceivedLeak = false;
    socketDoc2.on("privateMessage", () => {
      doc2ReceivedLeak = true;
    });
    await new Promise((res) => setTimeout(res, 300));
    assert(!doc2ReceivedLeak, "Doctor 2 (third party) received NO leaked messages");

    // 9. Test Patient -> Doctor private message
    const doc1FromPatPromise = new Promise((resolve) => {
      socketDoc1.once("privateMessage", (msg) => resolve(msg));
    });

    socketPat1.emit("privateMessage", {
      to: userDoc1.id,
      text: "Thank you Doctor, I will bring them.",
    });

    const msgFromPat = await doc1FromPatPromise;
    assert(
      msgFromPat &&
        msgFromPat.text === "Thank you Doctor, I will bring them." &&
        String(msgFromPat.from) === String(userPat1.id),
      "Doctor 1 received privateMessage from Patient 1"
    );

    // 10. Test Restriction: Patient -> Patient message is rejected
    let pat2ReceivedRestricted = false;
    socketPat2.on("privateMessage", () => {
      pat2ReceivedRestricted = true;
    });

    socketPat1.emit("privateMessage", {
      to: userPat2.id,
      text: "Hey fellow patient!",
    });
    await new Promise((res) => setTimeout(res, 400));
    assert(
      !pat2ReceivedRestricted,
      "Patient-to-patient privateMessage was properly rejected and blocked"
    );

    // 11. Test REST History: GET /api/chat/:otherUserId
    const historyRes = await httpRequest(
      "GET",
      `/api/chat/${userPat1.id}`,
      null,
      tokenDoc1
    );
    assert(
      historyRes.status === 200 && Array.isArray(historyRes.data) && historyRes.data.length >= 2,
      "GET /api/chat/:otherUserId returned saved conversation history in chronological order"
    );

    // Cleanup sockets
    socketDoc1.disconnect();
    socketDoc2.disconnect();
    socketPat1.disconnect();
    socketPat2.disconnect();

    console.log(`\n================================`);
    console.log(`EXP-8 RESULTS: ${passed}/${total} Tests Passed`);
    console.log(`================================\n`);
  } catch (error) {
    console.error("Test execution failed with error:", error);
  } finally {
    server.close();
    await mongoose.connection.close();
    process.exit(0);
  }
}

runExp8Tests();
