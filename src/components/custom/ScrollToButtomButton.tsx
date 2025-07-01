import {Button} from "@/components/ui/button";
import {motion} from "framer-motion";

interface ScrollToBottomButtonProps {
  onClick: () => void;
  unreadCount: number;
}

export default function ScrollToBottomButton({
                                               onClick,
                                               unreadCount,
                                             }: ScrollToBottomButtonProps) {

  return (
    <motion.div
      initial={{opacity: 0, translateY: 10}}
      animate={{opacity: 1, translateY: 0}}
      exit={{opacity: 0, translateY: 20}}
      transition={{duration: 0.2}}
      className="absolute bottom-17 right-4.5 z-10"
    >
      <div className="relative">
        <Button
          onClick={onClick}
          variant="ghost"
          className="
            w-12 h-12 p-0 rounded-full
            flex items-center justify-center
            bg-white/10 hover:bg-white/20
            shadow-lg backdrop-blur-sm
          ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M22 7L12 17 2 7"
            />
          </svg>
        </Button>

        {unreadCount > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 text-[12px] min-w-[1.25rem] px-1 h-5 rounded-full bg-white text-black flex items-center justify-center leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>
    </motion.div>
  );
}