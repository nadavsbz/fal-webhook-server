const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const FAL_KEY = process.env.FAL_KEY;
const FAL_API_URL = "https://api.fal.ai/v1/predict/fal-ai/flux-pro/kontext";

app.post("/api/edit-image", async (req, res) => {
  const { image, prompt } = req.body;
  if (!image || !prompt) {
    return res.status(400).json({ error: "Missing image or prompt" });
  }

  try {
    const falRes = await axios.post(
      FAL_API_URL,
      {
        input: {
          prompt,
          image_url: image,
          guidance_scale: 3.5,
          output_format: "jpeg",
          num_images: 1,
          safety_tolerance: "2"
        }
      },
      {
        headers: {
          Authorization: `Key ${FAL_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const editedImageUrl = falRes.data?.images?.[0]?.url;
    if (!editedImageUrl) {
      return res.status(500).json({ error: "No image returned from FAL" });
    }

    return res.json({ output: editedImageUrl });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ error: "Image processing failed" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));