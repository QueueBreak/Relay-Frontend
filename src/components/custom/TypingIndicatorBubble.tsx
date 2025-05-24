import {motion} from "framer-motion";

export function TypingIndicatorBubble() {
  return (
    <div className="flex justify-start px-14 mt-1 mb-1">
      <div
        className={`
          max-w-[75%]
          px-3 pt-3 pb-3.5 pr-15
          rounded-xl
          text-sm
          relative
          bg-muted/90 text-secondary-foreground rounded-bl-sm
        `}
        style={{wordBreak: "break-word", whiteSpace: "pre-wrap"}}
      >
        <div className="flex space-x-1 items-center">
          <motion.span
              className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{opacity: [0.3, 1, 0.3]}}
            transition={{duration: 0.6, repeat: Infinity, repeatDelay: 0}}
          />
          <motion.span
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{opacity: [0.3, 1, 0.3]}}
            transition={{duration: 0.6, repeat: Infinity, repeatDelay: 0.2}}
          />
          <motion.span
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{opacity: [0.3, 1, 0.3]}}
            transition={{duration: 0.6, repeat: Infinity, repeatDelay: 0.4}}
          />
        </div>
      </div>
    </div>
  );
}