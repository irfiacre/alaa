import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import AttachButton from "./buttons/AttachButton";
import SelectModeButton from "./buttons/SelectModeButton";

const ChatComponent = ({
  handleSend,
}: {
  handleSend: (message: string, file: File | null) => void;
}) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };
  const handleSendMessage = () => handleSend(message, file);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 p-4 rounded-3xl"
      >
        <div>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              const textarea = e.target as HTMLTextAreaElement;
              textarea.style.height = "auto"; // Reset height before recalculating
              textarea.style.height = `${textarea.scrollHeight}px`;
            }}
            onInput={(e) => {
              const textarea = e.target as HTMLTextAreaElement;
              textarea.style.height = "auto"; // Reset height before recalculating
              textarea.style.height = `${textarea.scrollHeight}px`;
            }}
            onKeyPress={handleKeyPress}
            placeholder="Describe what you case..."
            style={{ minHeight: "48px", maxHeight: "300px", overflowY: "auto" }}
            className="w-full h-auto p-4 rounded-2xl bg-inherit outline-none placeholder-gray-500 resize-none font-sans"
            rows={1}
          />
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center justify-center gap-5">
            <SelectModeButton />
            <AttachButton
              fileName={fileName}
              handleFileChange={handleFileChange}
              setFile={setFile}
              setFileName={setFileName}
            />
          </div>
          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSendMessage}
              disabled={!message.trim() && !file}
              className="w-full p-2 rounded-full bg-black/10 cursor-pointer"
            >
              <Icon icon="lucide:arrow-up" fontSize={20} className="text-black/40" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatComponent;
