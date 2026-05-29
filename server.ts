import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable JSON request body parsing
  app.use(express.json());

  // API Route for Riktaz AI Assistant (Server-Proxy to secure Gemini API key)
  app.post("/api/riktaz-ai", async (req, res) => {
    try {
      const { type, prompt, context } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({ 
          text: "⚠️ **এডমিন নোটিশ:** আপনার সার্ভারে `GEMINI_API_KEY` সেট করা নেই। দয়া করে AI Studio সেটিংসে আপনার এপিআই কী যুক্ত করুন। \n\n*সিমুলেটেড ডেমো উত্তর:* আপনার পণ্যটি চমৎকার! এটি ঢাকার বাজারে ১০০% সুস্বাদু ও ভেজালমুক্ত হিসেবে অত্যন্ত পরিচিতি লাভ করবে।"
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Dedicated system instruction designed for beautiful Bangladeshi agro assistance
      let systemInstruction = "You are 'Riktaz AI' (রিকতাজ এআই), a highly helpful, professional, and friendly Bangladeshi Agricultural AI Assistant featured exclusively on the 'Krishok Bazar' (কৃষক বাজার) platform. ";
      systemInstruction += "You always communicate in warm, encouraging, fluent, and grammatical Bangla. Your goal is to support local marginal farmers and city safe-food consumers. ";

      let query = prompt;

      if (type === 'suggest_title') {
        systemInstruction += "Your task is to suggest Exactly 5 high-converting, realistic, and premium Bangla product titles for the agricultural marketplace. Examples: 'রাজশাহী আমগাছের পাকা গোপালভোগ আম', 'যশোরের তাল বেগুন (চকচকে তাজা)'. They must appeal to middle and upper-class city consumers looking for safe, chemical-free food. Keep the layout nicely bulletin graded with newline breaks.";
        query = `সবজি/ফল/পণ্যের নাম: ${prompt}. ${context ? `অতিরিক্ত তথ্য: ${context}` : ''}`;
      } else if (type === 'write_description') {
        systemInstruction += "Your task is to write a wonderfully enticing, emotional, safe-food story-based product description in grammatical Bangla. Mention how it was produced with organic organic fertilizers by small-holder farmers, completely free of formalin or harmful pesticides. Emphasize health, nutrition, and immediate kitchen delivery. Keep it around 100-150 words maximum.";
        query = `পণ্যের বিবরণ লিখুন: ${prompt}. ${context ? `খামার বা উৎপাদন পদ্ধতি: ${context}` : ''}`;
      } else if (type === 'suggest_price') {
        systemInstruction += "Your task is to provide realistic, fair-retail agriculture market price estimations in Bangladeshi Taka (BDT - ৳). Explain what a farmer should charge matching quality standards, offer tips on packaging/shipping to reduce wastage, and suggest negotiation strategies for maximum benefit in Bangla.";
        query = `পণ্য এবং বাজার মূল্য পরামর্শ দিন: ${prompt}. ${context ? `মান বা চাষ ধরন: ${context}` : ''}`;
      } else if (type === 'grocery_estimation') {
        systemInstruction += "Your task is to provide a comprehensive weekly organic grocery budget estimation in BDT (৳) for a Bangladeshi family. Suggest a complete food breakdown of leafy greens, fresh fish, native poultry/meat, pure honey, farm fresh milk, and grains. Estimate individual item pricing realistically and offer helpful savings hacks while keeping diet nutritional. Use Markdown tables or clean bullet points in Bangla.";
        query = `সাপ্তাহিক বাজার হিসাব করুন। পরিবারের সদস্য সংখ্যা: ${prompt} জন। ${context ? `বিশেষ চাহিদা বা বাজেট: ${context}` : ''}`;
      } else if (type === 'healthy_suggestions') {
        systemInstruction += "Your task is to provide nutritional value facts and healthy recipes/food suggestions using pure, natural, safe items found in Krishok Bazar. Promote immunity-boosting ingredients like organic honey, home-cooked ready-to-cook vegetables, pure spices, and low-carb red rice. Format with clear headers and simple cooking instructions in Bangla.";
        query = `স্বাস্থ্যকর খাবারের পরামর্শ: ${prompt}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: query,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.75,
        }
      });

      const text = response.text || "দুঃখিত, এআই কোনো উত্তর তৈরি করতে পারেনি। দয়া করে আবার চেষ্টা করুন।";
      res.json({ text });
    } catch (err: any) {
      console.error("Gemini API backend error:", err);
      res.status(500).json({ error: err?.message || "সার্ভার এআই রিকোয়েস্ট প্রসেস করতে ব্যর্থ হয়েছে।" });
    }
  });

  // Serve static files to the browser or hook Vite development server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: any, res: any) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
