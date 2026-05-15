import * as math from 'mathjs';
import { askTSolver } from './gemini';

class LocalAI {
  private initialized = false;

  async init() {
    this.initialized = true;
    console.log("Local AI Ready");
  }

  async process(prompt: string, category: 'math' | 'education' | 'business' | 'general' = 'general', useThinking: boolean = false, userLevel?: string): Promise<string> {
    const p = prompt.trim();
    if (!p) return "";
    const lang = localStorage.getItem('tsolver-lang') || 'bn';

    // Try Gemini First if available
    try {
      const result = await askTSolver(prompt, undefined, useThinking, category, userLevel);
      if (result) return result;
    } catch (err: any) {
      // If it's a missing API key, we fallback to local logic
      // Otherwise, log it and fallback
      if (err.message !== "API_KEY_MISSING") {
        console.error("Gemini failed, falling back to Local AI:", err);
      }
    }

    // Local Fallback Logic (Smarter Educational Engine)
    const lowerP = p.toLowerCase();
    
    // 0. Subject Detection
    let detectedSubject = category;
    if (lowerP.includes("geometry") || lowerP.includes("জ্যামিতি")) detectedSubject = 'math';
    if (lowerP.includes("physics") || lowerP.includes("পদার্থবিজ্ঞান")) detectedSubject = 'education';
    if (lowerP.includes("grammar") || lowerP.includes("ব্যাকরণ")) detectedSubject = 'education';

    // 1. Formula Matching
    const formulaDB: Record<string, string> = {
      "gravity": "F = G * (m1 * m2) / r^2",
      "pythagoras": "a^2 + b^2 = c^2",
      "quadratic": "x = [-b ± sqrt(b^2 - 4ac)] / 2a",
      "force": "F = m * a",
      "energy": "E = m * c^2",
      "circle area": "A = π * r^2",
    };

    for (const [name, formula] of Object.entries(formulaDB)) {
      if (lowerP.includes(name)) {
        return lang === 'bn' 
          ? `### সূত্র অনুসন্ধান (লোকাল):\n**${name.toUpperCase()}** এর সূত্রটি হলো: \`${formula}\`।\n\n*আপনি এটি জ্যামিতি বা বীজগণিত সমাধানকারী টুলে ব্যবহার করতে পারেন।*`
          : `### Formula Match (Local):\nThe formula for **${name.toUpperCase()}** is: \`${formula}\`.\n\n*You can use this in the Algebra or Graphing tools.*`;
      }
    }

    // 2. Math solving (Advanced with Math.js)
    if (detectedSubject === 'math' || lowerP.match(/[0-9+*/-]/)) {
      try {
        // Clean expression for mathjs
        const expression = prompt.replace(/[^\d+\-*/().^]/g, '').trim();
        if (expression.length >= 3) {
          const res = math.evaluate(expression);
          return lang === 'bn' 
            ? `### গাণিতিক সমাধান (লোকাল এআই):\nটি-সলভার লোকাল লজিক ইঞ্জিন ব্যবহার করে সমাধান করা হয়েছে।\n\n**সমীকরণ:** ${expression}\n**ফলাফল: ${res}**\n\n*সঠিক ধাপগুলোর জন্য এআই মোড ব্যবহার করুন।*` 
            : `### Math Solution (Local AI):\nSolved using T-Solver Local Logic Engine.\n\n**Equation:** ${expression}\n**Result: ${res}**\n\n*For detailed steps, please use AI Mode.*`;
        }
      } catch (e) {
        // Fallback for math error
      }
    }

    // 3. Local Knowledge Responses (Expanded)
    const knowledgeBase: Record<string, string> = {
      "hi": lang === 'bn' ? "হ্যালো! আমি টি-সলভার। আমি আপনাকে কিভাবে সাহায্য করতে পারি?" : "Hello! I am T-Solver. How can I help you today?",
      "hello": lang === 'bn' ? "নমস্কার/সালাম! আপনার পড়াশোনা বা ব্যবসার কি অবস্থা?" : "Greetings! How is your study or business going?",
      "who are you": lang === 'bn' ? "আমি টি-সলভার, তাছিন আহমেদ রিয়ন দ্বারা তৈরি একটি লোকাল ইন্টেলিজেন্ট এসিস্ট্যান্ট যা অফলাইনেও কাজ করতে সক্ষম।" : "I am T-Solver, a local intelligent assistant created by Tachin Ahmed Rion, capable of working offline.",
      "tachin": lang === 'bn' ? "তাছিন আহমেদ রিয়ন টি-সলভার এর প্রতিষ্ঠাতা এবং একজন এআই আর্কিটেক্ট।" : "Tachin Ahmed Rion is the founder of T-Solver and an AI Architect.",
      "ssc": lang === 'bn' ? "এসএসসি প্রস্তুতির জন্য নিয়মিত সূত্র এবং গ্রামার প্র্যাকটিস করুন। আমাদের কুইজ এবং এনালিটিক্স টুলটি আপনার দুর্বলতা খুঁজে বের করতে সাহায্য করবে।" : "For SSC prep, practice formulas and grammar regularly. Our Quiz and Analytics tools help identify weak areas.",
      "hsc": lang === 'bn' ? "এইচএসসি এর জন্য ফিজিক্স এবং ম্যাথ এর উপর বিশেষ গুরুত্ব দিন। আমাদের স্মার্ট নোটস ব্যবহার করে গুরুত্বপূর্ণ পয়েন্টগুলো লিখে রাখুন।" : "For HSC, focus heavily on Physics and Math. Use Smart Notes to capture key points.",
      "assignment": lang === 'bn' ? "অ্যাসাইনমেন্ট তৈরি করতে আমাদের 'স্মার্ট সাজেস্ট' ফিচারটি ব্যবহার করুন যা আপনার দক্ষতা অনুযায়ী কাজের পরামর্শ দেয়।" : "To manage assignments, use our 'Smart Suggest' feature which recommends tasks based on your skill level.",
    };

    for (const [key, val] of Object.entries(knowledgeBase)) {
      if (lowerP.includes(key)) return val;
    }

    // Default Fallback
    return lang === 'bn'
      ? "আমি টি-সলভার লোকাল এআই। ইন্টারনেট সংযোগ না থাকায় আমি এখন সীমিত উত্তরে কাজ করছি। সম্পূর্ণ বুদ্ধিমত্তার জন্য এপিআই কি দিন।"
      : "I am T-Solver Local AI. Since I'm in local mode, my responses are limited. Please provide an API key for full intelligence.";
  }
}

export const localAI = new LocalAI();
