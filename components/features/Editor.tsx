"use client";

import "./styles.scss";
import React from "react";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Youtube from "@tiptap/extension-youtube";
import ListItem from "@tiptap/extension-list-item";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  ImageIcon,
  Undo2,
  Redo2,
  Pilcrow,
  MessageSquareQuote,
  ListOrdered,
  List,
  Heading6,
  Heading5,
  Heading4,
  Heading3,
  Heading2,
  Heading1,
  SeparatorVertical,
  YoutubeIcon
} from "lucide-react";

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="control-group space-x-2 flex flex-wrap">
      <Button
        variant={"outline"}
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold") ? "bg-zinc-200 dark:bg-zinc-700" : ""
        }
      >
        <Bold />
      </Button>
      <Button
        variant={"outline"}
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic") ? "bg-zinc-200 dark:bg-zinc-700" : ""
        }
      >
        <Italic />
      </Button>
      <Button
        type="button"
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={
          editor.isActive("strike") ? "bg-zinc-200 dark:bg-zinc-700" : ""
        }
      >
        <Strikethrough />
      </Button>
      <Button
        type="button"
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
        className={
          editor.isActive("codeBlock") ? "bg-zinc-200 dark:bg-zinc-700" : ""
        }
      >
        <SeparatorVertical />
      </Button>
      <Button
        type="button"
        variant={"outline"}
        onClick={() => {
          const url = window.prompt("Entrez l'URL de l'image");
          if (url) {
            editor
              .chain()
              .focus()
              .insertContent(`<img src="${url}" alt="Image" />`)
              .run();
          }
        }}
      >
        <ImageIcon />
      </Button>
      <Button
        variant="outline"
        type="button"
        onClick={() => {
          const url = window.prompt("Entrez l'URL YouTube");
          if (url) {
            editor
              .chain()
              .focus()
              .setYoutubeVideo({
                src: url,
                width: 640,
                height: 360
              })
              .run();
          }
        }}
      >
        <YoutubeIcon /> {/* ou un autre icône */}
      </Button>
      <Button
        type="button"
        variant={"outline"}
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={
          editor.isActive("paragraph") ? "bg-zinc-200 dark:bg-zinc-700" : ""
        }
      >
        <Pilcrow />
      </Button>
      <Button
        type="button"
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 })
            ? "bg-zinc-200 dark:bg-zinc-700"
            : ""
        }
      >
        <Heading1 />
      </Button>
      <Button
        type="button"
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 })
            ? "bg-zinc-200 dark:bg-zinc-700"
            : ""
        }
      >
        <Heading2 />
      </Button>
      <Button
        type="button"
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive("heading", { level: 3 })
            ? "bg-zinc-200 dark:bg-zinc-700"
            : ""
        }
      >
        <Heading3 />
      </Button>
      <Button
        type="button"
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={
          editor.isActive("heading", { level: 4 })
            ? "bg-zinc-200 dark:bg-zinc-700"
            : ""
        }
      >
        <Heading4 />
      </Button>
      <Button
        type="button"
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={
          editor.isActive("heading", { level: 5 })
            ? "bg-zinc-200 dark:bg-zinc-700"
            : ""
        }
      >
        <Heading5 />
      </Button>
      <Button
        type="button"
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={
          editor.isActive("heading", { level: 6 })
            ? "bg-zinc-200 dark:bg-zinc-700"
            : ""
        }
      >
        <Heading6 />
      </Button>
      <Button
        type="button"
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive("bulletList") ? "bg-zinc-200 dark:bg-zinc-700" : ""
        }
      >
        <List />
      </Button>
      <Button
        type="button"
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive("orderedList") ? "bg-zinc-200 dark:bg-zinc-700" : ""
        }
      >
        <ListOrdered />
      </Button>
      <Button
        type="button"
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={
          editor.isActive("blockquote") ? "bg-zinc-200 dark:bg-zinc-700" : ""
        }
      >
        <MessageSquareQuote />
      </Button>
      <Button
        type="button"
        variant={"outline"}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo2 />
      </Button>
      <Button
        type="button"
        variant={"outline"}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo2 />
      </Button>
      {/*<Button
        type="button"
        variant={"outline"}
        onClick={() => editor.chain().focus().setColor("#958DF1").run()}
        className={
          editor.isActive("textStyle", { color: "#958DF1" })
            ? "bg-zinc-200 dark:bg-zinc-700"
            : ""
        }
      >
        Purple
      </Button>*/}
    </div>
  );
};

const MyEditor = ({
  value,
  onChange
}: {
  value: string | null;
  onChange: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle,
      Youtube.configure({
        controls: false,
        nocookie: true
      })
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    //autofocus: true,
    editable: true,
    immediatelyRender: false // ✅ évite les erreurs SSR
  });

  return (
    <div className="editor-container space-y-4">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="editor-content border bg-transparent dark:bg-input/30 border-input w-full min-w-0 rounded-md"
      />
    </div>
  );
};

export default MyEditor;
