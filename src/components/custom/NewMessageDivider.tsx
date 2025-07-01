import {Badge} from "@/components/ui/Badge.tsx";

export default function NewMessagesDivider() {
  return (
    <div className="flex justify-center py-2">
      <Badge variant="default" className="text-xs px-3 py-1 rounded-full">
        New messages
      </Badge>
    </div>
  );
}