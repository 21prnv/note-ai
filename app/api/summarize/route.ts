import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Initialize Google AI with your API key
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

    // Use Gemini Pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Summarize the following text in a concise way, preserving the key points and main ideas:

    ${content}

    Summary:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ summary: text });
  } catch (error) {
    console.error("Error summarizing note:", error);
    return NextResponse.json(
      { error: "Failed to summarize note" },
      { status: 500 }
    );
  }
}
