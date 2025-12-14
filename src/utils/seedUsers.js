const bcrypt = require("bcrypt");
const User = require("../models/user.model");

async function seedDefaultUsers() {
  const users = [
    {
      name: "Demo Seeker",
      email: "seeker@test.com",
      password: "12345",
      role: "SEEKER",
    },
    {
      name: "Demo Employer",
      email: "employer@test.com",
      password: "12345",
      role: "EMPLOYER",
    },
    {
      name: "Demo Admin",
      email: "admin@test.com",
      password: "12345",
      role: "ADMIN",
    },
  ];

  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`✔ ${u.role} already exists`);
      continue;
    }

    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({
      name: u.name,
      email: u.email,
      password: hashed,
      role: u.role,
    });

    console.log(`✅ Created ${u.role}`);
  }
}

module.exports = seedDefaultUsers;
