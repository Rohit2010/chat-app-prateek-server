import { Schema, model, Document, Types } from "mongoose";

interface IChat extends Document {
  participants: Types.ObjectId[];
  chatType: "individual" | "group";
  admins: Types.ObjectId[];
  // Add other chat-specific fields as needed
}

const chatSchema = new Schema<IChat>({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  chatType: {
    type: String,
    enum: ["individual", "group"],
    required: true,
  },
  admins: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // Define other fields here
});

const Chat = model<IChat>("Chat", chatSchema);

export default Chat;
