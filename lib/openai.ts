import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error(
    "Missing OPENAI_API_KEY - make sure to add it to your .env file."
  );
}

const openai = new OpenAI({ apiKey });

export default openai;

export async function getEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });

  const embedding = response.data[0].embedding;

  if (!embedding) {
    throw new Error("Failed to get embedding");
  }

  console.log(embedding);

  return embedding;
}
