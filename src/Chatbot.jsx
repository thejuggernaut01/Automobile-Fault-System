import React, { useState, useEffect } from "react";
import { SessionsClient } from "@google-cloud/dialogflow";
import { v4 as uuidv4 } from "uuid";

const projectID = "auto-fault-diagnosis-9xex";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    const sessionClient = new SessionsClient();
    const sessionId = uuidv4(); // Generate a unique session ID

    const sessionPath = sessionClient.projectAgentSessionPath(
      projectID,
      sessionId
    );

    const handleResponse = (response) => {
      const message = response.queryResult.fulfillmentText;
      const newMessages = [...messages, { text: message, isUser: false }];
      setMessages(newMessages);
    };

    const sendRequest = async () => {
      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: userInput,
            languageCode: "en-US",
          },
        },
      };

      try {
        const responses = await sessionClient.detectIntent(request);
        const response = responses[0];
        handleResponse(response);
      } catch (error) {
        console.error("Error querying Dialogflow:", error);
      }
    };

    if (userInput !== "") {
      const newUserMessage = { text: userInput, isUser: true };
      setMessages([...messages, newUserMessage]);
      sendRequest();
      setUserInput("");
    }
  }, [userInput]);

  const handleMessageChange = (event) => {
    setUserInput(event.target.value);
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{ textAlign: message.isUser ? "right" : "left" }}
          >
            {message.text}
          </div>
        ))}
      </div>
      <input type="text" value={userInput} onChange={handleMessageChange} />
    </div>
  );
};

export default ChatBot;
