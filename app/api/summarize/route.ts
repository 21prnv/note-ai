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

    const prompt = `Create a concise summary of the following text following these strict guidelines:
    1. Maximum 3-4 sentences
    2. Focus only on the most important facts and key points
    3. Maintain objective tone
    4. Remove any redundant information
    5. Use clear and simple language
    6. Preserve critical details and main arguments

    Text to summarize:
    ${content}

    Concise Summary:`;

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
