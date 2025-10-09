import React, { useState } from "react";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";

import ChatBox from "../components/ChatBox";
import { useMessages } from "../hooks/use-messages";
import SideBar from "../components/Sidebar";

import GlobalStyles from "../GlobalStyles";

const Container = styled.div`
  width: 100%;
  max-height: calc(100vh - 64px);
  height: 100%;
  display: flex;
  background-color: rgb(12, 24, 39);
  position: relative;
`;

const ViewFull = styled.div`
  width: 100%;
`;

const ChatWithYourDatabase: React.FC = () => {
  const { AdminJS } = window;

  const {
    BASE_APP_URL,
    OPENAI_API_KEY,
    OPENAI_DB_ASSISTANT_ID,
    OPENAI_DB_FORMATTER_ASSISTANT_ID,
  } = AdminJS.env;

  const [open, setOpen] = useState(false);

  const {
    messages,
    input,
    loading: messageLoading,
    handleSend,
    handleInputChange,
    handleKeyDown
  } = useMessages(BASE_APP_URL, {
    apiKey: OPENAI_API_KEY,
    dbAssistantId: OPENAI_DB_ASSISTANT_ID,
    dbFormatterAssistantId: OPENAI_DB_FORMATTER_ASSISTANT_ID,
  });

  if (!AdminJS) {
    return null;
  }

  return (
    <Container>
      <GlobalStyles />
      <ToastContainer />
      <SideBar isOpen={open} open={() => setOpen(!open)} />
      <ViewFull>
        <ChatBox
          messages={messages}
          input={input}
          messageLoading={messageLoading}
          handleSend={handleSend}
          handleInputChange={handleInputChange}
          handleKeyDown={handleKeyDown}
        />
      </ViewFull>
    </Container>
  );
};

export default ChatWithYourDatabase;
