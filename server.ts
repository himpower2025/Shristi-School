import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Set payload limit higher for base64 images
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Initialize Gemini SDK with User-Agent header for telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API Routes
app.post("/api/parse-calendar", async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 in request body" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY is not configured on the server. Please check Settings > Secrets." 
      });
    }

    // Clean up base64 prefix if present
    let cleanBase64 = imageBase64;
    let mimeType = "image/png";
    
    if (imageBase64.includes(";base64,")) {
      const parts = imageBase64.split(";base64,");
      const match = parts[0].match(/data:(.*)/);
      if (match) {
        mimeType = match[1];
      }
      cleanBase64 = parts[1];
    }

    const currentYear = new Date().getFullYear();

    const prompt = `You are an expert academic registrar. Analyze this uploaded school academic calendar document (image or PDF).
Extract all key events, holidays, vacation periods, recess breaks, examinations, sports days, cultural festivals, parent meetings, and other important calendar items for the entire academic year across all months.

Parse each event into the following structure:
- title: string (clear, descriptive name of the event, e.g., "First Terminal Examinations", "Dashain Vacation Recess")
- date: string (Start date format strictly as "Month Day, Year", e.g., "July 28, 2026" or "August 15, 2026". Use full English month names: January, February, March, April, May, June, July, August, September, October, November, December. Default year to ${currentYear} if not specified)
- endDate: string (Optional. If the event or vacation/exam/recess spans multiple days, specify the end date in "Month Day, Year" format e.g. "August 28, 2026". Leave empty if single-day)
- time: string (e.g. "10:00 AM - 1:00 PM" or "All Day" or "9:30 AM onwards")
- location: string (e.g., "School Premises", "Auditorium", "Sports Ground". Default to "School Premises" if not mentioned)
- description: string (brief description of what happens, max 120 chars)
- type: string (must be strictly one of: "Sports", "Academic", "Excursion", "Ceremony")

Return the extracted list as a JSON array of events. Do not write any markdown wrappers or comments, just valid JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { data: cleanBase64, mimeType: mimeType } }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              date: { type: Type.STRING },
              endDate: { type: Type.STRING, description: "Optional end date if multi-day vacation or exam period" },
              time: { type: Type.STRING },
              location: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { 
                type: Type.STRING,
                description: "Must be exactly 'Sports' or 'Academic' or 'Excursion' or 'Ceremony'"
              },
            },
            required: ["title", "date", "description", "type"],
          },
        },
      }
    });

    const parsedEventsText = response.text?.trim() || "[]";
    const parsedEvents = JSON.parse(parsedEventsText);

    return res.json({ events: parsedEvents });
  } catch (error: any) {
    console.error("Error parsing calendar:", error);
    return res.status(500).json({ error: error.message || "Failed to parse calendar image using AI" });
  }
});

// Vite middleware for dev / static build for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
