import { useRef, useState, KeyboardEvent } from "react";
import { ArrowUp, Paperclip, Square } from "lucide-react";
import { toast } from "sonner";

interface InputBoxProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  disabled?: boolean;
}

const InputBox = ({ onSend, onStop, disabled }: InputBoxProps) => {
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.info(`Attachment "${file.name}" selected. File upload support can be added next.`);
    e.target.value = "";
  };

  return (
    <div className="px-3 pb-3">
      <div className="flex w-full items-end rounded-[var(--aui-composer-radius)] border border-[var(--aui-border)] bg-[var(--aui-composer-bg)] pl-[var(--aui-composer-padding)] shadow-sm transition-shadow focus-within:shadow">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleAttachmentChange}
          aria-hidden="true"
          tabIndex={-1}
        />
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message AI"
          disabled={disabled}
          rows={1}
          className="h-10 max-h-32 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-[var(--aui-text)] outline-none placeholder:text-[var(--aui-placeholder)] disabled:opacity-50"
          style={{ fieldSizing: "content" } as React.CSSProperties}
          aria-label="Message input"
        />
        <button
          type="button"
          onClick={handleAttachmentClick}
          disabled={disabled}
          aria-label="Add attachment"
          className="m-1.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[var(--aui-text)] transition-colors hover:bg-[var(--aui-hover)] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Paperclip className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={disabled ? onStop : handleSend}
          disabled={disabled ? !onStop : !input.trim()}
          aria-label={disabled ? "Stop generating" : "Send message"}
          className="m-1.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--aui-send-bg)] text-[var(--aui-send-fg)] transition-opacity disabled:cursor-not-allowed disabled:opacity-10"
        >
          {disabled ? (
            <Square className="h-3 w-3 fill-current" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default InputBox;
