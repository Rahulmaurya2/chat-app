import React, { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import {
  SendHorizonal,
  Paperclip,
  Smile,
  X,
  Image as ImageIcon,
  Reply,
  Pencil,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui';
import type { Message, Attachment } from '../types';

const messageSchema = z.object({
  content: z.string().trim(),
});

type MessageFormValues = z.infer<typeof messageSchema>;

export interface MessageInputProps {
  readonly onSend: (content: string, attachments?: Attachment[]) => void;
  readonly onEditSubmit: (messageId: string, content: string) => void;
  readonly replyToMessage?: Message;
  readonly editingMessage?: Message;
  readonly onCancelReply: () => void;
  readonly onCancelEdit: () => void;
}

const COMMON_EMOJIS = ['😊', '😂', '👍', '❤️', '🔥', '🎉', '🙌', '✨', '🚀', '💯', '🤔', '👀'];

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onEditSubmit,
  replyToMessage,
  editingMessage,
  onCancelReply,
  onCancelEdit,
}) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: '' },
  });

  const contentValue = watch('content');
  const canSubmit = (contentValue && contentValue.trim().length > 0) || attachments.length > 0;

  // Handle edit message prefill
  useEffect(() => {
    if (editingMessage) {
      setValue('content', editingMessage.content);
      textareaRef.current?.focus();
    }
  }, [editingMessage, setValue]);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = Array.from(files).map((file) => {
      const url = URL.createObjectURL(file);
      return {
        id: uuidv4(),
        name: file.name,
        type: file.type,
        size: file.size,
        url,
        previewUrl: file.type.startsWith('image/') ? url : undefined,
      };
    });

    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const addEmoji = (emoji: string) => {
    const current = contentValue || '';
    setValue('content', current + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const onSubmit = (data: MessageFormValues) => {
    if (!canSubmit) return;

    if (editingMessage) {
      onEditSubmit(editingMessage.id, data.content.trim());
      onCancelEdit();
    } else {
      onSend(data.content.trim(), attachments.length > 0 ? attachments : undefined);
      setAttachments([]);
    }

    reset({ content: '' });
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="relative border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
      {/* Reply Banner */}
      {replyToMessage && (
        <div className="flex items-center justify-between gap-3 mb-2 px-3 py-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Reply className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-blue-900 dark:text-blue-200">
                Replying to message:
              </span>{' '}
              <span className="text-slate-600 dark:text-slate-300">
                {replyToMessage.content}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancelReply}
            className="p-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-300"
            aria-label="Cancel reply"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Edit Banner */}
      {editingMessage && (
        <div className="flex items-center justify-between gap-3 mb-2 px-3 py-2 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Pencil className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-semibold text-amber-900 dark:text-amber-200">
              Editing message
            </span>
          </div>
          <button
            type="button"
            onClick={onCancelEdit}
            className="p-1 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-600 dark:text-amber-300"
            aria-label="Cancel editing"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="relative group flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              {att.type.startsWith('image/') ? (
                <img
                  src={att.url}
                  alt={att.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              ) : (
                <div className="flex items-center gap-1.5 px-2 py-1 text-xs">
                  <ImageIcon className="w-4 h-4 text-slate-500" />
                  <span className="max-w-[120px] truncate">{att.name}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeAttachment(att.id)}
                className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-slate-800 text-white shadow-xs hover:bg-slate-700"
                aria-label="Remove attachment"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Input Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-2">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
          id="chat-file-upload"
        />

        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Add attachment"
          aria-label="Add attachment"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Text Input Area & Emoji Picker */}
        <div className="relative flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-transparent focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all flex items-end">
          <textarea
            {...register('content')}
            ref={(e) => {
              register('content').ref(e);
              textareaRef.current = e;
            }}
            onInput={adjustTextareaHeight}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={editingMessage ? 'Update your message...' : 'Type a message...'}
            aria-label="Type message"
            className="w-full max-h-32 px-4 py-2.5 text-sm bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 resize-none focus:outline-none"
          />

          {/* Emoji Toggle */}
          <div className="relative pb-1.5 pr-2">
            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              title="Insert Emoji"
              aria-label="Insert Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Emoji Quick Picker Dropdown */}
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2 p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 grid grid-cols-4 gap-1.5 z-30 animate-in fade-in zoom-in-95">
                {COMMON_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => addEmoji(emoji)}
                    className="p-1.5 text-base hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Send Button */}
        <Button
          type="submit"
          disabled={!canSubmit}
          size="icon"
          aria-label={editingMessage ? 'Save edited message' : 'Send message'}
          className={cn(
            'rounded-xl w-10 h-10 shrink-0 transition-transform active:scale-95',
            canSubmit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 dark:bg-slate-700'
          )}
        >
          <SendHorizonal className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
