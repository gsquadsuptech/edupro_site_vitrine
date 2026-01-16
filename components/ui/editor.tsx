"use client";

import { useEffect, useRef, useState } from "react";
import { Editor as TinyMCEEditor } from 'tinymce';

declare global {
  interface Window {
    tinymce: any;
  }
}

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Editor({ value, onChange, placeholder }: EditorProps) {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [editorInitialized, setEditorInitialized] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/tinymce.min.js";
    script.async = true;

    script.onload = () => {
      window.tinymce.init({
        selector: '#tiny-editor',
        height: 300,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif; font-size: 14px }',
        branding: false,
        setup: (editor: TinyMCEEditor) => {
          editorRef.current = editor;
          
          editor.on('init', () => {
            setEditorInitialized(true);
            editor.setContent(value || '');
          });
          
          editor.on('change', () => {
            const newContent = editor.getContent();
            setInternalValue(newContent);
            onChange(newContent);
          });
        }
      });
    };

    document.body.appendChild(script);

    return () => {
      if (window.tinymce) {
        window.tinymce.remove('#tiny-editor');
      }
      document.body.removeChild(script);
    };
  }, []);

  // Mettre à jour le contenu uniquement si la valeur externe change
  // et est différente de la valeur interne
  useEffect(() => {
    if (editorInitialized && editorRef.current && value !== internalValue) {
      // Sauvegarder la position du curseur
      const editor = editorRef.current;
      const bookmark = editor.selection.getBookmark(2, true);
      
      // Mettre à jour le contenu
      editor.setContent(value || '');
      
      // Restaurer la position du curseur
      try {
        editor.selection.moveToBookmark(bookmark);
        editor.focus();
      } catch (e) {
        // Si la restauration échoue, ne rien faire
        console.log("Impossible de restaurer la position du curseur");
      }
      
      setInternalValue(value || '');
    }
  }, [value, editorInitialized, internalValue]);

  return (
    <textarea 
      id="tiny-editor" 
      placeholder={placeholder}
      style={{ visibility: 'hidden' }}
    />
  );
} 