const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const lighthouse = require("@lighthouse-web3/sdk");
const app = express();
const PORT = process.env.PORT || 3027;
const AdmZip = require("adm-zip");
const puppeteer = require("puppeteer");

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
app.use(express.json());
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

// Route for rendering HTML page, capturing screenshot, and saving as image
app.post("/render-and-save", async (req, res) => {
  console.log(req.body);
  const {
    cid,
    mode,
    triggerMode,
    resX,
    resY,
    delay,
    gpu,
    withFeatures,
    priority,
  } = req.body;

  if (!cid) {
    return res.status(400).send("CID not provided.");
  }

  const url = `https://gateway.lighthouse.storage/ipfs/${cid}`;

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Set viewport size based on mode
    if (mode === "VIEWPORT") {
      await page.setViewport({ width: resX, height: resY });
    }

    await page.goto(url);

    // Wait for delay if provided
    if (delay) {
      // await page.waitForTimeout(delay);
      await new Promise((r) => setTimeout(r, delay));
    }

    // Capture screenshot
    const screenshotPath = path.join(
      __dirname,
      "screenshots",
      "screenshot.png"
    );
    await page.screenshot({
      path: screenshotPath,
      fullPage: mode === "FULL_PAGE",
    });

    // Close the browser
    await browser.close();

    // Send back the URL of the uploaded image
    // const imageUrl = `/uploads/screenshot.png`;
    res.json({ screenshotPath });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send(error.message);
  }
});

app.get("/screenshot.png", (req, res) => {
  const imagePath = path.join(__dirname, "screenshots", "screenshot.png");
  console.log(imagePath);
  // Check if the image file exists
  if (fs.existsSync(imagePath)) {
    // Read the image file and send it in the response
    fs.readFile(imagePath, (err, data) => {
      if (err) {
        console.error("Error reading image:", err);
        res.status(500).send("Error reading image");
      } else {
        res.setHeader("Content-Type", "image/png");
        res.send(data);
      }
    });
  } else {
    res.status(404).send("Image not found");
  }
});

app.post("/preview", async (req, res) => {
  const {
    cidParams,
    mode,
    triggerMode,
    resX,
    resY,
    delay,
    gpu,
    canvasSelector,
    previewHash,
    previewIteration,
    previewMinter,
    previewInputBytes,
    authHash,
    snippetVersion,
  } = req.body;

  if (!previewHash) {
    return res.status(400).send("Preview hash not provided.");
  }

  // Construct URL with cid and additional parameters
  const cid = `${cidParams}/?xmhash=${previewHash}&xmiteration=${previewIteration}&xmminter=${previewMinter}`;

  const url = `https://gateway.lighthouse.storage/ipfs/${cid}`;

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Set viewport size based on mode
    if (mode === "VIEWPORT") {
      await page.setViewport({ width: resX, height: resY });
    }

    await page.goto(url);

    // Wait for delay if provided
    if (delay) {
      await new Promise((r) => setTimeout(r, delay));
    }

    // Capture screenshot with provided resolution
    const screenshotPath = path.join(
      __dirname,
      "screenshots",
      "screenshot.png"
    );
    await page.screenshot({
      path: screenshotPath,
      fullPage: mode === "FULL_PAGE",
    });

    // Capture screenshot with resolution 300x300
    const screenshot300Path = path.join(
      __dirname,
      "screenshots",
      "screenshot_300.png"
    );
    await page.setViewport({ width: 300, height: 300 });
    await page.goto(url);
    if (delay) {
      await new Promise((r) => setTimeout(r, delay));
    }
    await page.screenshot({
      path: screenshot300Path,
      fullPage: mode === "FULL_PAGE",
    });

    // Close the browser
    await browser.close();

    // Upload images to Lighthouse
    const apiKey = "9b83daf8.ccdb11e9c2aa4f2a86f5f771436c7cd2"; // Replace with your actual API key
    const thumbnail = await lighthouse.upload(
      "./screenshots/screenshot_300.png",
      apiKey
    );
    const preview = await lighthouse.upload(
      "./screenshots/screenshot.png",
      apiKey
    );
    console.log("preview", preview);
    // Return the CIDs of the uploaded images
    res.json({
      cidPreview: preview.data.Hash,
      cidThumbnail: thumbnail.data.Hash,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
