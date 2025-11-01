// const nodemailer = require("nodemailer");
// const sgTransport = require("nodemailer-sendgrid-transport");

// // আপনার SendGrid API কী .env ফাইলে রাখুন
// const options = {
//   auth: {
//     api_key: process.env.SENDGRID_API_KEY,
//   },
// };

// const transporter = nodemailer.createTransport(sgTransport(options));

// const sendOrderConfirmationEmail = async (toEmail, userName, orderDetails) => {
//   const message = {
//     from: "beigelobd@gmail.com",
//     to: toEmail,
//     subject: "Beigelo - Your Order is Confirmed!",
//     html: `
//       <h1>Hi ${userName},</h1>
//       <p>Thanks for your order! We'll let you know when it ships.</p>
//       <p>Order ID: ${orderDetails.id}</p>
//       <p>Total Amount: ${orderDetails.amount}</p>
//       <p>- The Beigelo Team</p>
//     `,
//   };

//   try {
//     await transporter.sendMail(message);
//     console.log("Order confirmation email sent successfully.");
//   } catch (error) {
//     console.error("Error sending email:", error);
//     // এখানে ইমেইল ফেইল হলেও অর্ডার প্রসেস যেন না আটকায়, সেদিকে খেয়াল রাখুন
//   }
// };

// module.exports = sendOrderConfirmationEmail;
