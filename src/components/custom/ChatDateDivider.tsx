export function ChatDateDivider({label}: { label: string }) {
  return (
    <div className="flex justify-center my-4">
      <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
        {label}
      </span>
    </div>
  );
}