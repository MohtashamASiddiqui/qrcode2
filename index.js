if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const stripeSecretKey = process.env.STRIPE_SERCET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripe = require("stripe")(stripeSecretKey);
const express = require("express");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const qrcode = require("qrcode");
const exp = require("constants");
const bodyParser = require("body-parser");
// const path = require("path");
const mongoose = require("mongoose");
const app = express();

const port = process.env.port || 7070;

// var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/node-demo");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("static"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

// app.use(require("./routes/form"));

app.get("/", (req, res) => {
    res.render("index", {
        key: stripePublicKey,
    });
});

app.post("/scan", async(req, res, next) => {
    const input_text =
        "Name: " +
        req.body.firstname +
        " " +
        req.body.lastname +
        "\r\n" +
        "Phone: " +
        req.body.Phone +
        "\r\n" +
        "Email: " +
        req.body.email +
        "\r\n" +
        "Airport of Depart: " +
        req.body.Aird +
        "\r\n" +
        "Airport of Destination: " +
        req.body.Airds;
    console.log(input_text);

    try {
        let img = await qrcode.toDataURL(input_text);
        qrcode.toDataURL(input_text, async(err, src) => {
            if (err) res.send("Something went wrong!!");
            res.render("end");
            let mailTransporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "pubggamingpak2000@gmail.com",
                    pass: "zslkqmdqszgqjhio",
                },
            });
            let details = {
                from: "pubggamingpak2000@gmail.com",
                to: req.body.email,
                subject: "Here is your QRcode",
                // text: "Halo ini dari node js",
                attachDataUrls: true,
                html: ' <img src="' + img + '">',
            };
            mailTransporter.sendMail(details, (err, info) => {
                if (err) {
                    console.log("It has an Error", err);
                } else {
                    console.log("Email has been sent");
                }
            });
        });
    } catch {
        res.redirect("/");
    }
});

app.post("/payment", async(req, res, next) => {
    stripe.customers
        .create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: "Secrue Bagages",
        })

    .then((customer) => {
            return stripe.charges.create({
                amount: 100,
                description: "QRcode",
                currency: "USD",
                customer: customer.id,
            });
        })
        .then((charge) => {
            res.render("scan");
        })

    .catch((err) => {
        res.redirect("/");
    });
});

console.log(stripeSecretKey, stripePublicKey);
app.listen(port, console.log(`Listening on port ${port}`));