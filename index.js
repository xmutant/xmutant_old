const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const lighthouse = require("@lighthouse-web3/sdk");
const app = express();
const PORT = process.env.PORT || 3027;
const AdmZip = require("adm-zip");

// Enable CORS for all domains
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(fileUpload());

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to the API home route!");
});

app.post("/upload", async (req, res) => {
  const file = req.files.files; // Access the file directly

  if (!file) {
    return res.status(400).send("No file was uploaded.");
  }

  if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads", { recursive: true });
  }
  const fileName = file.name;
  const filePath = path.join(__dirname, "./uploads", fileName);
  const extractionPath = path.join(__dirname, "./uploads");

  console.log(fileName);
  console.log(filePath);

  // Save file to the public directory
  file.mv(filePath, async (err) => {
    if (err) {
      console.log("Error saving file:", err);
      return res.status(500).send(err);
    }
    const apiKey = "9b83daf8.ccdb11e9c2aa4f2a86f5f771436c7cd2";

    // Extract the zip file contents
    try {
      const zip = new AdmZip(filePath);
      zip.extractAllTo(extractionPath, true);
      console.log("Extraction complete");

      console.log("File extracted successfully!");
      if (extractionPath) {
        const output = await lighthouse.upload("./uploads", apiKey);
        console.log("output cid", output);
        // Return the output
        res.json(output); // Assuming output is in JSON format
        // Remove the directory after sending the response
        fs.rmdirSync("./uploads", { recursive: true });
      }
    } catch (extractionError) {
      console.log("Error extracting file:", extractionError);
      res.status(500).send(extractionError);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
