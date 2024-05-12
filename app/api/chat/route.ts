import { auth } from "@/auth";
import { ChatOpenAI } from "@langchain/openai";
import {
  LangChainStream,
  StreamingTextResponse,
  Message as VercelChatMessage,
} from "ai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { Stream } from "stream";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { getVectorStore } from "@/lib/vector-store";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

export const POST = auth(async function GET(req) {
  if (!req.auth || !req.auth.user || !req.auth.user.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const messages = body.messages;
    const docId = body.docId;

    const chatHistory = messages
      .slice(0, -1)
      .map((m: VercelChatMessage) =>
        m.role === "user"
          ? new HumanMessage(m.content)
          : new AIMessage(m.content)
      );

    const currentMessageContent = messages[messages.length - 1].content;

    const { stream, handlers } = LangChainStream();

    const chatModel = new ChatOpenAI({
      model: "gpt-3.5-turbo",
      streaming: true,
      callbacks: [handlers],
      verbose: true,
    });

    const rephrasingModel = new ChatOpenAI({
      model: "gpt-3.5-turbo",
    });

    const retriever = (await getVectorStore(docId)).asRetriever();

    const rephrasePrompt = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
      [
        "user",
        "Given the above conversation, generate a search query to look up in order to get information relevant to the current question. " +
          "Don't leave out any relevant keywords. Only return the query and no other text.",
      ],
    ]);

    const historyAwareRetrieverChain = await createHistoryAwareRetriever({
      llm: rephrasingModel,
      retriever,
      rephrasePrompt,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        'You are a chatbot for a note-taking website where users can discuss their currently opened document or notes, known as "NotePal". ' +
          "Your role is to assist the user by responding to queries about the content of their notes. When the notes provide enough information, generate an accurate response. " +
          "If the notes are sparse or unclear, explicitly state that you need more details to provide a helpful answer. " +
          "Use Markdown formatting when appropriate and use bullet points if it will make the response easier to read. Do not use nesting and avoid using headings larger than H3.\n\n" +
          "Here’s what you can consider when generating responses: \n" +
          "* If the provided notes or context are sufficient, use them to craft your response.\n" +
          "* If not, ask clarifying questions or inform the user that more information is needed to provide an accurate answer.\n" +
          "* Always stay relevant to the user’s current query and the context provided by the notes.\n\n" +
          "Based on the content below, answer the user’s questions. If there isn't enough content, let the user know you do not have enough information to answer their question effectively.\n\n" +
          "The relevant content is: \n{context}",
      ],
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
    ]);

    const combineDocsChain = await createStuffDocumentsChain({
      llm: chatModel,
      prompt,
    });

    const retrievalChain = await createRetrievalChain({
      combineDocsChain,
      retriever: historyAwareRetrieverChain,
    });

    retrievalChain.invoke({
      input: currentMessageContent,
      chat_history: chatHistory,
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
});

// export async function POST(req: Request) {

// }
