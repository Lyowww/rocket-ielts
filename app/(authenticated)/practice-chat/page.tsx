import { Chat } from "@/components/organisms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice Chat",
  description: "Practice chat page for users to interact with the AI",
};

const PracticeChatpage = () => {
  return <Chat />;
};

export default PracticeChatpage;
