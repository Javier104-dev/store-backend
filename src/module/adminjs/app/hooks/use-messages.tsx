import { useCurrentAdmin } from 'adminjs';
import { AxiosError } from 'axios';
import { Thread } from 'openai/resources/beta/threads/threads';
import { useEffect, useState } from 'react';

import { IOpenAIConfig } from '@/module/adminjs/app/interfaces/chat/IOpenaiConfig';

import { axiosInstance } from '../config/axios';
import { IDatabaseInfo } from '../interfaces/chat/IDatabaseInfo';
import { IMessage } from '../interfaces/chat/IMessage';
import { apiService } from '../services/api.service';
import { notificationService } from '../services/notification.service';

export const useMessages = (urlApi: string, openAIConfig: IOpenAIConfig) => {
  const [admin] = useCurrentAdmin();
  const [databaseInfo, setDatabaseInfo] = useState<IDatabaseInfo>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [thread, setThread] = useState<Thread>();

  useEffect(() => {
    if (!admin.token) {
      notificationService.error('Could not get authentication token');
    }

    apiService.setBaseUrl(urlApi);
    fetchDatabaseInfo();
  }, [admin]);

  useEffect(() => {
    if (!openAIConfig.apiKey) {
      notificationService.error(
        'Missing OpenAI API key in environment variables',
      );
    } else if (
      !openAIConfig.dbAssistantId ||
      !openAIConfig.dbFormatterAssistantId
    ) {
      notificationService.error(
        'Missing OpenAI Assistant IDs in environment variables',
      );
    } else {
      const fetchThread = async () => {
        try {
          const { data: thread } = await axiosInstance.post('/thread');
          setThread(thread);
        } catch (error) {
          if (error instanceof AxiosError) {
            notificationService.error(error.response.data.message);
          } else {
            notificationService.error('Error creating chat thread');
          }
        }
      };

      fetchThread();
    }
  }, []);

  const fetchDatabaseInfo = async () => {
    try {
      const { data } = await axiosInstance.get('/database', {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });

      setDatabaseInfo(data.databaseInfo);
    } catch (error) {
      notificationService.error('Error fetching database info');
    }
  };

  const handleSend = async () => {
    if (!input.trim().length) return;

    if (!databaseInfo) {
      return notificationService.error('No database info provided');
    }

    try {
      setLoading(true);
      if (input.trim()) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: crypto.randomUUID(), text: input, sender: 'user' },
        ]);

        setInput('');

        const { data } = await axiosInstance.post<IDatabaseInfo>(
          '/chat/send',
          {
            message: input.trim(),
            language: 'english',
            databaseInfo,
            threadId: thread.id,
          },
          {
            headers: {
              Authorization: `Bearer ${admin.token}`,
            },
          },
        );

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: crypto.randomUUID(),
            text: data.response,
            sender: 'bot',
          },
        ]);
      }
    } catch (error) {
      notificationService.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return {
    messages,
    input,
    loading,
    handleSend,
    handleInputChange,
    handleKeyDown,
  };
};
