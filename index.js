// Import the required modules
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";  // Needed for ES modules
import nodemailer from "nodemailer";




const PORT = process.env.PORT || 3000;


// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an instance of an Express app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serves static files from 'public' folder
app.use(express.static("pictures"));
app.use('/java_core', express.static(path.join(__dirname, 'java_core'))); // Serves JavaScript files

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));  // Ensure views are located correctly



app.get("/", (req, res) => {
    res.render("college");
});

app.get('/contact/:eventData', (req, res) => {
    let eventData = req.params.eventData.replace(/&/g, ' '); // Convert dashes back to spaces
    let parts = eventData.split(' '); // Split by space
    
    let eventDate = parts.splice(-3).join(' ');
    let college = parts.splice(-2).join(' ');
    let eventTitle = parts.join(' '); // Remaining part is the title

    res.render("contact", {
        date: eventDate,
        college: college,
        title: eventTitle,
    });
});

app.post("/send_mail", (req, res) => {
    let name = req.body.name;
    let ename = req.body.title;
    let company_name = req.body.company;
    let contact = req.body.contact;
    let text = req.body.collaboration;

    // Create a transporter for nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Or any other email service
        secure: true,
        port: 465,
        auth: {
          user: 'rishabhgarai7@gmail.com',
          pass: 'xgabndbrcfwliisj' // Use environment variables for production
        }
    });

    const mailOptions = {
        from: company_name,
        to: 'rishabhgarai7@gmail.com',
        subject: `Company collaboration for the fest ${ename} from ${company_name}`,
        text: `My name is ${name}, and I represent ${company_name}.\nWe are interested in collaborating for the ${ename} event.\nWe would like to express that ${text}.\nThank you very much. Please feel free to connect with us via ${contact}.`
    };

    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            console.log('Something went wrong, the error is ', error);
            res.render("college");
        } else {
            console.log('Mail sent: ' + info.response);
            res.render("college");
        }
    });
});

// New GET route to retrieve all college data
app.get("/get", async (req, res) => {
    try {
        const colleges = await College.find();
        res.json(colleges);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PING_URL = "https://event-page-1ppx.onrender.com/"; // Replace with your actual website URL

// Function to keep the server alive
const keepAlive = async () => {
    try {
      await axios.get(PING_URL);
      console.log("Pinged successfully!");
    } catch (error) {
      console.error("Ping failed:", error.message);
    }
  };
  const port=5055;
  // Ping the server every 10 minutes
  setInterval(keepAlive, 1000*60*5);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    keepAlive();
});
