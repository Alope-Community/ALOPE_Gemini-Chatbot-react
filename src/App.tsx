import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      text: "Halo! Saya ALOPE chatbot, ada yang bisa saya bantu?",
      sender: "bot",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const allowedKeywords = [
    "pengertian dan informasi seputar batik hingga cara pembuatannya",
    "pengelolaan sampah dari pakaian",
    "cara membuat pakaian dari sampah",
    "cara agar sampah bisa didaur ulang jadi pakaian",
    "cara agar sampah bisa diminimalisir",
    "kalimat sapaan seperti halo dan hai",
  ];

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);

    const userText = userInput.trim();
    setMessages([...messages, { text: userText, sender: "user" }]);
    setUserInput("");

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `
        Kamu hanya boleh menjawab jika pertanyaan mengandung salah satu dari keyword berikut: ${allowedKeywords.join(
          ", "
        )}
        Jika pertanyaan tidak relevan dengan keyword tersebut, jawab: "Saya hanya dapat menjawab pertanyaan terkait dengan topik yang ditentukan."
        
        Pertanyaan: ${userText}
      `;

      const result = await model.generateContent(prompt);
      const botResponse = await result.response.text();

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, sender: "bot" },
      ]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Terjadi kesalahan, coba lagi nanti.", sender: "bot" },
      ]);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <b>{message.sender === "user" ? "Anda" : "Bot"}:</b> {message.text}
          </div>
        ))}
        {isLoading && <p>Loading...</p>}
      </div>

      <div>
        <input
          type="text"
          placeholder="Ketik pesan..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Kirim</button>
      </div>
    </div>
  );
};

export default Chatbot;
