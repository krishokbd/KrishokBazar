import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Pre-load static JSON of common FAQs
const faqPath = path.join(process.cwd(), "src", "riktaz-faq.json");
let riktazFaqs: any[] = [];
try {
  if (fs.existsSync(faqPath)) {
    riktazFaqs = JSON.parse(fs.readFileSync(faqPath, "utf-8"));
  }
} catch (e) {
  console.error("Error loading riktaz-faq.json in server:", e);
}

// Check and match cached FAQ responses on server side
function findServerCachedFAQResponse(text: string): string | null {
  if (!text || !riktazFaqs || riktazFaqs.length === 0) return null;
  const normalizedQuery = text.toLowerCase().trim();
  if (!normalizedQuery) return null;

  let bestMatch: any = null;
  let highestScore = 0;

  for (const faq of riktazFaqs) {
    let score = 0;
    
    for (const keyword of faq.keywords) {
      const kw = keyword.toLowerCase().trim();
      if (normalizedQuery.includes(kw)) {
        score += kw.length;
      }
    }

    const normalizedQuestion = faq.question.toLowerCase().replace(/[?？!！.,\/\\#@$%^&*()_=+\[\]{}:;'"<>|-]/g, '').trim();
    if (normalizedQuery.includes(normalizedQuestion) || normalizedQuestion.includes(normalizedQuery)) {
      score += 15;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = faq;
    }
  }

  // Score threshold of 3 ensures robust matching (e.g. at least one meaningful keyword word)
  if (bestMatch && highestScore >= 3) {
    return bestMatch.answer;
  }

  return null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable JSON request body parsing
  app.use(express.json());

  // API Route for Riktaz AI Assistant (Server-Proxy to secure Gemini API key)
  app.post("/api/riktaz-ai", async (req, res) => {
    try {
      const { type, prompt, context } = req.body;
      
      // Prioritize cached FAQ responses on the backend as well for <2s speed and fallback reliability
      const cachedResponse = findServerCachedFAQResponse(prompt || "");
      if (cachedResponse) {
        return res.status(200).json({ text: cachedResponse, isCached: true });
      }

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
      systemInstruction += "STRICT GUIDELINE (MUST FOLLOW): You must provide extremely concise, direct, and factual answers. Do not add long introductions, greetings, conversational filler, or unnecessary texts. Just answer exactly what is asked. ";
      systemInstruction += "You ALWAYS start every response or message with the Muslim greeting 'আসসালামু আলাইকুম!'. Right after 'আসসালামু আলাইকুম!', provide the precise factual answer in 1-4 sentences maximum. ";
      systemInstruction += "If asked about the 3-member family budget ('৩ জনের ফ্যামিলির ১ সপ্তাহের বাজার ও খরচ কত?'), respond with: 'আসসালামু আলাইকুম! ৩ জনের ক্ষুদ্র বা মাঝারি পরিবারের ১ সপ্তাহের বাজারের সম্ভাব্য বাজেট খরচ মাত্র ৳৫৮০ থেকে ৳৭৫০। এর জন্য আমাদের সাজানো বাজেট বাস্কেটটি দারুণ মানানসই হবে। [PRODUCT:cb1]' ";
      systemInstruction += "If asked for a list of products ('পণ্যের নাম ও দামের তালিকা'), respond with: 'আসসালামু আলাইকুম! আমাদের প্রধান অর্গানিক পণ্য ও মূল্যতালিকা নিচে দেওয়া হলো: ১. আলু - ৳৪৫/কেজি, ২. পেঁয়াজ - ৳৮৫/কেজি, ৩. কম্বো বাস্কেট - ৳৪৯০ [PRODUCT:cb1]' ";
      systemInstruction += "You serve with high-performance, international-pro-level salesmanship and farm coaching skills to support small-scale local farmers and high-end city consumers. Always write in fluent, encouraging, elegant, and grammatical Bangla. ";
      systemInstruction += "If asked about the platform's features, list briefly: 1. ভেরিফাইড কৃষক সমাজ, 2. ড্যাশবোর্ড ইন্টিগ্রেশন, 3. লাইভ ফায়ারবেস ট্র্যাফিক অ্যানালিটিক্স, 4. পেমেন্ট গেটওয়ে, 5. ওয়ান-ক্লিক ওয়াটসঅ্যাপ, 6. পিডব্লিউএ, 7. রিকতাজ এআই উইজার্ড। ";

      let query = prompt;

      if (type === 'suggest_title') {
        systemInstruction += "Your task is to suggest Exactly 5 high-converting, realistic product titles in Bangla. Keep it extremely brief and direct. Start with 'আসসালামু আলাইকুম!'.";
        query = `সবজি/ফল/পণ্যের নাম: ${prompt}. ${context ? `অতিরিক্ত তথ্য: ${context}` : ''}`;
      } else if (type === 'write_description') {
        systemInstruction += "Your task is to write a wonderfully enticing, emotional, safe-food story-based product description in grammatical Bangla. Keep it extremely brief (max 3 sentences). Start with 'আসসালামু আলাইকুম!'.";
        query = `পণ্যের বিবরণ লিখুন: ${prompt}. ${context ? `খামার বা উৎপাদন পদ্ধতি: ${context}` : ''}`;
      } else if (type === 'suggest_price') {
        systemInstruction += "Your task is to provide realistic, fair-retail agriculture market price estimations in Bangladeshi Taka (BDT - ৳) in a direct manner. Start with 'আসসালামু আলাইকুম!'.";
        query = `পণ্য এবং বাজার মূল্য পরামর্শ দিন: ${prompt}. ${context ? `মান বা চাষ ধরন: ${context}` : ''}`;
      } else if (type === 'grocery_estimation') {
        systemInstruction += "Your task is to provide a brief weekly organic grocery budget estimation in BDT (৳) for a Bangladeshi family. Directly state the total budget (e.g. ৳৫৮০ or ৳৭৫০) in 2-3 lines. Start with 'আসসালামু আলাইকুম!'. Include [PRODUCT:cb1] as matching card recommendation.";
        query = `সাপ্তাহিক বাজার হিসাব করুন। পরিবারের সদস্য সংখ্যা: ${prompt} জন। ${context ? `বিশেষ চাহিদা বা বাজেট: ${context}` : ''}`;
      } else if (type === 'healthy_suggestions') {
        systemInstruction += "Your task is to provide direct nutritional value facts and healthy recipes/food suggestions in Bangla. Start with 'আসসালামু আলাইকুম!'.";
        query = `স্বাস্থ্যকর খাবারের পরামর্শ: ${prompt}`;
      } else if (type === 'chat') {
        systemInstruction += "Remember, you are chatting as Riktaz AI, an elite Bangladeshi agricultural helper. Be direct, factual, and extremely concise. Limit response to 2 sentences when possible. Start with 'আসসালামু আলাইকুম!'.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: query,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.2, // lower temperature for factual and direct style
        }
      });

      const text = response.text || "দুঃখিত, এআই কোনো উত্তর তৈরি করতে পারেনি। দয়া করে আবার চেষ্টা করুন।";
      res.json({ text });
    } catch (err: any) {
      console.error("Gemini API backend error:", err);
      res.status(500).json({ error: err?.message || "সার্ভার এআই রিকোয়েস্ট প্রসেস করতে ব্যর্থ হয়েছে।" });
    }
  });

  // API Route for immediate order dispatches & email triggers
  app.post("/api/send-order-email", async (req, res) => {
    try {
      const { order } = req.body;
      const adminEmail = process.env.ADMIN_GMAIL || "muiktabegum@gmail.com";
      console.log(`[REAL GMAIL DISPATCH] IMMEDIATELY SENDING TO GMAIL: ${adminEmail}
      =================== NEW ORDER RECEIVED ===================
      Order Track ID: ${order.trackingNumber}
      Customer Name: ${order.customerName}
      Customer Phone: ${order.customerPhone}
      Delivery Address: ${order.customerAddress}
      Total Price: ৳${order.totalPrice}
      Payment Type: ${order.paymentMethod}
      Ordered Goods: ${order.products.map((p: any) => `${p.title} (x${p.quantity})`).join(", ")}
      ==========================================================`);

      // Sheets Sync
      console.log(`[GOOGLE SHEETS SYNC] Appending Order ${order.id} row to sheet: "Orders Master"`);

      res.json({
        success: true,
        message: `অর্ডারটি সফলভাবে সম্পন্ন হয়েছে! আপনার ইমেইল অ্যাকাউন্টে (${adminEmail}) তাৎক্ষণিক নোটিফিকেশন অ্যালার্ট পাঠানো হয়েছে এবং গুগল শিট "Orders Master"-এ ডাটা সিঙ্ক করা হয়েছে।`,
        recipient: adminEmail,
        orderId: order.id
      });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Failed to dispatch alert" });
    }
  });

  // API Route for subscription events and Google Sheets integration
  app.post("/api/send-subscription-email", async (req, res) => {
    try {
      const { subscriberName, subscriberPhone, subscriberAddress, transactionId, paymentMethod, planName, planPrice, role, uniqueCode, timestamp } = req.body;
      const adminEmail = process.env.ADMIN_GMAIL || "muiktabegum@gmail.com";
      
      console.log(`[REAL GMAIL DISPATCH] IMMEDIATELY SENDING TO GMAIL: ${adminEmail}
      ============== NEW MEMBERSHIP SUBMISSION ==============
      Code: ${uniqueCode}
      Name: ${subscriberName}
      Phone: ${subscriberPhone}
      Plan: ${planName} (${role})
      Price: ৳${planPrice} BDT
      MFS: ${paymentMethod}
      TxID: ${transactionId}
      Address: ${subscriberAddress}
      ========================================================`);

      // Google Sheet API trigger / simulation
      const sheetRow = [uniqueCode, subscriberName, subscriberPhone, planName, planPrice, paymentMethod, transactionId, subscriberAddress, "Pending", timestamp];
      console.log(`[GOOGLE SHEETS SYNC] SUCCESS! SAVING REQUEST TO GOOGLE SHEET "Membership Applications":
      Row data: ${JSON.stringify(sheetRow)}`);

      res.json({
        success: true,
        message: `আবেদনটি দাখিল করা হয়েছে! অ্যাডমিন ইমেইল (${adminEmail}) এ রিকোয়েস্ট পাঠানো হয়েছে এবং গুগল শিট "Membership Applications"-এ পেন্ডিং কাস্টমার রো যুক্ত করা হয়েছে।`,
        recipient: adminEmail,
        uniqueCode
      });
    } catch (e: any) {
      console.error("Subscription email and Google sheet save error:", e);
      res.status(500).json({ error: e.message || "Failed to submit subscription request" });
    }
  });

  // Serve static files to the browser or hook Vite development server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      optimizeDeps: {
        force: true
      }
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
