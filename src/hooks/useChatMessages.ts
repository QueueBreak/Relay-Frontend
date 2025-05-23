import {useChatStore} from "@/features/messagestore/useChatStore.ts";
import {useCallback, useEffect, useState} from "react";
import {getMessagesBefore, getMostRecentChatMessages} from "@/api/messages.ts";
import {ChatMessage} from "@/types/ChatMessage.ts";

const PAGE_SIZE = 30

export function useChatMessages(chatRoomId: string) {
  const {
    chatMessagesMap,
    setInitialMessages,
    prependMessages
  } = useChatStore()

  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const chatMessages = chatMessagesMap[chatRoomId] ?? []
  const alreadyLoaded = Object.prototype.hasOwnProperty.call(chatMessagesMap, chatRoomId)

  useEffect(() => {
    if (alreadyLoaded) return

    setLoading(true)

    const loadMessages = async () => {
      try {
        const data: ChatMessage[] = await getMostRecentChatMessages(chatRoomId)
        setInitialMessages(chatRoomId, data)
        setHasMore(data.length === PAGE_SIZE)
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [alreadyLoaded, chatRoomId, setInitialMessages])

  const fetchOlderMessages = useCallback(async (lastSeenId: string) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const older = await getMessagesBefore(chatRoomId, lastSeenId);
      prependMessages(chatRoomId, older);
      if (older.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, chatRoomId, prependMessages]);

  return {
    chatMessages,
    loading,
    hasMore,
    fetchOlderMessages
  }
}
