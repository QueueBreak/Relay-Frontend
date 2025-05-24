import {useEffect, useState} from "react";
import {getFileMetadata} from "@/api/files.ts";

interface MessageBubbleProps {
  from: "me" | "them";
  text: string;
  timestamp: number;
  attachmentFileName?: string;
  chatRoomId: string;
  onMediaLoaded?: () => void;
  isGroupChat?: boolean;
  senderUserAccountId?: string;
  getDisplayNameById?: (id: string) => string;
}

export function MessageBubble({
                                from,
                                text,
                                timestamp,
                                attachmentFileName,
                                chatRoomId,
                                onMediaLoaded,
                                isGroupChat = false,
                                senderUserAccountId,
                                getDisplayNameById
                              }: MessageBubbleProps) {
  const time = new Date(timestamp * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const isMe = from === "me";

  // console.log(isGroupChat)

  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [attachmentType, setAttachmentType] = useState<"inline" | "attachment" | null>(null);
  const [attachmentContentType, setAttachmentContentType] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string | null>(null);

  useEffect(() => {
    if (!attachmentFileName) return;

    let blobUrl: string;

    const fetchFile = async () => {
      try {
        const {blob, contentType, disposition, originalFileName} =
          await getFileMetadata(chatRoomId, attachmentFileName);

        const dispositionType = disposition?.startsWith("inline") ? "inline" : "attachment";

        blobUrl = URL.createObjectURL(blob);
        setAttachmentUrl(blobUrl);
        setAttachmentType(dispositionType);
        setAttachmentContentType(contentType);
        setOriginalFileName(originalFileName);
      } catch (e) {
        console.error("Failed to load attachment:", e);
      }
    };

    fetchFile();

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [attachmentFileName, chatRoomId]);

  const senderName =
    isGroupChat && !isMe && senderUserAccountId && getDisplayNameById
      ? getDisplayNameById(senderUserAccountId)
      : null;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} px-14 mb-1`}>
      <div
        className={`
          max-w-[75%]
          px-3 pt-1.5 pb-2.5 pr-12
          rounded-xl
          text-sm
          relative
          ${isMe
          ? "bg-primary/95 text-primary-foreground rounded-br-sm"
          : "bg-muted/90 text-secondary-foreground rounded-bl-sm"}
        `}
        style={{wordBreak: "break-word", whiteSpace: "pre-wrap"}}
      >
        {senderName && (
          <div className="text-xs font-semibold mb-1 text-muted-foreground">
            {senderName}
          </div>
        )}

        <span>{text}</span>

        {attachmentFileName && attachmentUrl && (
          <div className="mt-2">
            {attachmentType === "inline" && attachmentContentType?.startsWith("image/") && (
              <img
                src={attachmentUrl}
                alt={originalFileName ?? "image"}
                className="rounded max-h-60 max-w-full object-contain"
                onLoad={onMediaLoaded}
              />
            )}
            {attachmentType === "inline" && attachmentContentType?.startsWith("video/") && (
              <video
                controls
                src={attachmentUrl}
                className="rounded max-h-60 max-w-full"
                onLoadedData={onMediaLoaded}
              />
            )}
            {attachmentType === "attachment" && (
              <a
                href={attachmentUrl}
                download={originalFileName ?? "file"}
                className="text-sm text-blue-400 underline mt-1 inline-block"
              >
                {originalFileName}
              </a>
            )}
          </div>
        )}

        <span
          className={`
            absolute bottom-2 right-2 text-[10px] leading-none
            ${isMe ? "text-black/50" : "text-white/60"}
            whitespace-nowrap
          `}
        >
          {time}
        </span>
      </div>
    </div>
  );
}
