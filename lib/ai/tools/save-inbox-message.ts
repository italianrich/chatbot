import { tool } from "ai";
import { z } from "zod";
import { addMessage } from "@/lib/storage";

export const saveInboxMessage = tool({
  description:
    "Saves a contact message from a visitor to the inbox. Use this when a visitor wants to send a message or inquiry via the contact form.",
  inputSchema: z.object({
    visitorName: z.string().describe("The name of the visitor"),
    visitorEmail: z.string().email().describe("The email address of the visitor"),
    message: z.string().describe("The content of the visitor's message"),
  }),
  execute: async (input) => {
    console.log("[tool] save_inbox_message called", {
      visitorName: input.visitorName,
      visitorEmail: input.visitorEmail,
      message: input.message,
    });

    const savedMessage = await addMessage({
      sender: input.visitorName,
      subject: `Message from ${input.visitorName}`,
      body: input.message,
    });

    return savedMessage;
  },
});
