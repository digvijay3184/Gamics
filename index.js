const { Database } = require("quickmongo");
const express = require("express");
const color = require("colors");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
//Cache Files
const cc = require("./config.json");

//URL
const domain = "45.55.195.4";

const transporter = nodemailer.createTransport({
  host: "smtp.skillssavvy.tech",
  port: 587,
  secure: false,
  auth: {
    user: "admin@skillssavvy.tech",
    pass: "e*u)s$yN0",
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
});





const db = new Database(cc.mongodb);
db.connect();
db.on("ready", async () => {
  console.log(color.bold.red("=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+="));
  console.log(
    color.bold.cyan(`---------------------------------------------------`)
  );
  console.log(color.bold.yellow(`Database Connected`));
  console.log(
    color.bold.cyan(`---------------------------------------------------`)
  );
  console.log(color.bold.red("=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+="));
  //Cron-Job
  cron.schedule("37 3 * * *", async () => {
    const getMails = await db.getArray("mail_slot_1");
    console.log(getMails);
    getMails.forEach(async (mail) => {
      const name = await db.get(`slot_1_${mail}.name`);
      const game = await db.get(`slot_1_${mail}.game`);
      const message = `Hi ${name}\nYou have registered for match the details are as follows :
      12 PM to 1 PM
      Game's name - ${game} 
      Gamer's name - ${name}`;
      await sendEmail(mail, "Remainder", message);
    });
  });
  cron.schedule("12 3 * * *", async () => {
    const getMails = await db.getArray("mail_slot_2");
    console.log(getMails);
    getMails.forEach(async (mail) => {
      const name = await db.get(`slot_2_${mail}.name`);
      const game = await db.get(`slot_2_${mail}.game`);
      const message = `Hi ${name}\nYou have registered for match the details are as follows :
      12 PM to 1 PM
      Game's name - ${game} 
      Gamer's name - ${name}`;
      await sendEmail(mail, "Remainder", message);
    });
  });

  cron.schedule("12 3 * * *", async () => {
    const getMails = await db.getArray("mail_slot_3");
    console.log(getMails);
    getMails.forEach(async (mail) => {
      const name = await db.get(`slot_3_${mail}.name`);
      const game = await db.get(`slot_3_${mail}.game`);
      const message = `Hi ${name}\nYou have registered for match the details are as follows :
      12 PM to 1 PM
      Game's name - ${game} 
      Gamer's name - ${name}`;
      await sendEmail(mail, "Remainder", message);
    });
  });

  cron.schedule("12 3 * * *", async () => {
    const getMails = await db.getArray("mail_slot_4");
    console.log(getMails);
    getMails.forEach(async (mail) => {
      const name = await db.get(`slot_4_${mail}.name`);
      const game = await db.get(`slot_4_${mail}.game`);
      const message = `Hi ${name}\nYou have registered for match the details are as follows :
      12 PM to 1 PM
      Game's name - ${game} 
      Gamer's name - ${name}`;
      await sendEmail(mail, "Remainder", message);
    });
  });
});

const app = new express();
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
//Login Form ------------------->>>>>>>>>>>>>>>>>>
port = 3000;
app.get("/api/login/:email/:password", async (req, res) => {
  console.warn(req.params.email);
  console.warn(req.params.password);
  const email = req.params.email;
  const password = req.params.password;
  try {
    const emails = await db.getArray("emails");
    if (emails.includes(email)) {
      const pass = await db.get(`all-mail.${email}.pass`);
      if (password == pass) {
        res.json({ success: true, message: "Login Successful" });
      } else {
        res.json({ success: false, message: "Incorrect Password" });
      }
    } else {
      res.json({ success: false, message: "Invalid Email or Password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//Sign UP------------------->>>>>>>>>>>>>>>>>>>
app.get("/api/continue/:email/:password", async (req, res) => {
  console.warn(req.params.email);
  console.warn(req.params.password);
  const email = req.params.email;
  const pass = req.params.password;
  try {
    const emails = await db.getArray("emails");
    console.log(emails);
    if (emails.includes(email)) {
      res.json({ success: false, message: "This Email is Already Used" });
    } else {
      await db.push(`emails`, email);
      await db.set(`all-mail.${email}.pass`, pass);
      res.json({ success: true, message: "Registration Successfull" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//register---------------->>>>>>>>>>>>>>>>>>>>>>

app.get("/api/regis/:slot/:game/:mail/:name", async (req, res) => {
  console.warn(req.params.name);
  console.warn(req.params.mail);
  console.warn(req.params.slot);
  console.warn(req.params.game);
  const mail = req.params.mail;
  const name = req.params.name;
  const slots = req.params.slot;
  const game = req.params.game;
  await db.push(`mail_${slots}`, mail);
  await db.set(`${slots}_${mail}.name`, name);
  await db.set(`${slots}_${mail}.game`, game);
  res.json({ success: true, message: "Successfull" });
});

app.listen(port, () => {
  console.log(`Server is running on http://${domain}:${port}`);
});

async function sendEmail(mail, subject, text) {
  console.log(mail, subject, text);
  const mailOptions = {
    from: `"Gamics Esports" <admin@skillssavvy.tech>`,
    to: mail,
    subject: subject,
    text: text,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Email sent: ${mail} | ${info.response}`);
    }
  });
}
