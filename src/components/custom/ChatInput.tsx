import {Button} from "@/components/ui/button";
import {useCallback, useEffect, useRef, useState} from "react";
import {useWebSocket} from "@/features/websocket/useWebSocket.ts";
import {WebSocketMessage} from "@/types/WebSocketMessage.ts";
import {Textarea} from "@/components/custom/TextArea.tsx";
import {Paperclip, X} from "lucide-react";
import {uploadFile} from "@/api/files.ts";

interface ChatInputProps {
  chatRoomId: string;
  onMessageSent?: () => void;
}

export function ChatInput({chatRoomId, onMessageSent}: ChatInputProps) {
  const {send} = useWebSocket();
  const [messageContent, setMessageContent] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  async function handleSendMessage() {
    const trimmed = messageContent.trim();

    if (!trimmed && !attachedFile) return;

    let attachmentFileName: string | undefined = undefined;

    if (attachedFile) {
      try {
        const response = await uploadFile(chatRoomId, attachedFile);
        attachmentFileName = response.fileName;
      } catch (error) {
        console.error("File upload failed:", error);
        return;
      }
    }

    send({
      type: "chat",
      payload: {
        destinationChatRoomId: chatRoomId,
        messageContent: trimmed,
        attachmentFileName,
      },
    });

    setMessageContent("");
    setAttachedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    onMessageSent?.();
    stopTyping();
  }


  const sendTypingStatus = useCallback((typing: boolean) => {
    const msg: WebSocketMessage = {
      type: "typing",
      payload: {
        destinationChatRoomId: chatRoomId,
        typing,
      },
    };
    send(msg);
  }, [chatRoomId, send]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.overflowY = "hidden";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
    el.style.overflowY = el.scrollHeight > 160 ? "auto" : "hidden";
  }, [messageContent]);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  const stopTyping = useCallback(() => {
    if (isTypingRef.current) {
      sendTypingStatus(false);
      isTypingRef.current = false;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [sendTypingStatus]);

  const startTyping = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      sendTypingStatus(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  }, [sendTypingStatus, stopTyping]);

  return (
    <div
      ref={dropRef}
      onDragOver={(e) => {
        e.preventDefault();
        dropRef.current?.classList.add("ring-2", "ring-primary");
      }}
      onDragLeave={() => {
        dropRef.current?.classList.remove("ring-2", "ring-primary");
      }}
      onDrop={(e) => {
        e.preventDefault();
        dropRef.current?.classList.remove("ring-2", "ring-primary");
        const file = e.dataTransfer.files?.[0];
        if (file) {
          setAttachedFile(file);
          if (file.type.startsWith("image/")) {
            setPreviewUrl(URL.createObjectURL(file));
          } else {
            setPreviewUrl(null);
          }
        }
      }}
      className="border-t px-4 py-3 bg-background transition-all"
    >
      {attachedFile && (
        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-12 h-12 object-cover rounded border border-muted"
            />
          )}
          <span className="truncate max-w-[200px]">{attachedFile.name}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setAttachedFile(null);
              if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
              }
            }}
          >
            <X className="h-4 w-4"/>
          </Button>
        </div>
      )}
      <div className="flex gap-2 items-end">
        <input
          type="file"
          ref={fileInputRef}
          style={{display: "none"}}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setAttachedFile(file);
              if (file.type.startsWith("image/")) {
                setPreviewUrl(URL.createObjectURL(file));
              } else {
                setPreviewUrl(null);
              }
            }
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-md"
        >
          <Paperclip className="h-4 w-4"/>
        </Button>

        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={messageContent}
          onChange={(e) => {
            setMessageContent(e.target.value);
            startTyping();
          }}
          onBlur={stopTyping}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              stopTyping();
              handleSendMessage();
            }
          }}
          rows={1}
          placeholder="Type a message..."
          className="resize-none w-full max-h-40 min-h-[36px]
                  rounded-md border border-input bg-transparent
                  px-3 py-[7px] text-sm leading-[1.4rem] shadow-sm
                  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
                  disabled:opacity-50 overflow-hidden
                  placeholder:text-muted-foreground
                  [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-thumb]:bg-white/25
                  [&::-webkit-scrollbar-thumb]:rounded-md
                  [&::-webkit-scrollbar-thumb:hover]:bg-white/80
                  [&::-webkit-scrollbar-thumb:active]:bg-white
                  [&::-webkit-scrollbar-track]:bg-white/10"
        />

        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    </div>
  );
}
