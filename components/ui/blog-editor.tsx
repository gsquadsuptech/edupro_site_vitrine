"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Editor as TinyMCEEditor } from 'tinymce';

declare global {
  interface Window {
    tinymce: any;
  }
}

interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  editorId?: string;
}

// Variable globale pour suivre si le script est chargé
let scriptLoaded = false;
let scriptLoading = false;
const scriptLoadCallbacks: (() => void)[] = [];

// Map globale pour suivre les éditeurs initialisés
const initializedEditors = new Map<string, boolean>();
const initializingEditors = new Set<string>();

export default function BlogEditor({ value, onChange, placeholder, editorId = 'blog-editor' }: BlogEditorProps) {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [editorInitialized, setEditorInitialized] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const initRef = useRef(false);
  
  // Générer un ID unique une seule fois avec useMemo basé sur editorId
  const uniqueId = useMemo(() => {
    return `tiny-editor-${editorId}`;
  }, [editorId]);

  useEffect(() => {
    // Protection contre React Strict Mode - vérifier si déjà initialisé pour cette instance
    if (initRef.current) {
      return;
    }

    // Vérifier si cet éditeur est déjà initialisé globalement
    if (initializedEditors.has(uniqueId)) {
      if (typeof window !== 'undefined' && window.tinymce) {
        const existingEditor = window.tinymce.get(uniqueId);
        if (existingEditor) {
          editorRef.current = existingEditor;
          setEditorInitialized(true);
          initRef.current = true;
          return;
        }
      }
      return;
    }

    // Vérifier si l'initialisation est en cours
    if (initializingEditors.has(uniqueId)) {
      return;
    }

    // Vérifier si l'éditeur existe déjà pour cet ID
    if (typeof window !== 'undefined' && window.tinymce) {
      const existingEditor = window.tinymce.get(uniqueId);
      if (existingEditor) {
        editorRef.current = existingEditor;
        setEditorInitialized(true);
        initializedEditors.set(uniqueId, true);
        initRef.current = true;
        return;
      }
    }

    const initializeEditor = () => {
      // Double vérification avant initialisation
      if (initRef.current || initializedEditors.has(uniqueId) || initializingEditors.has(uniqueId)) {
        return;
      }

      if (!window.tinymce) {
        return;
      }

      // Vérifier si l'éditeur existe déjà
      const existingEditor = window.tinymce.get(uniqueId);
      if (existingEditor) {
        editorRef.current = existingEditor;
        setEditorInitialized(true);
        initializedEditors.set(uniqueId, true);
        initRef.current = true;
        return;
      }

      // Vérifier si le textarea existe
      const textarea = document.getElementById(uniqueId);
      if (!textarea) {
        return;
      }

      // Marquer comme en cours d'initialisation AVANT l'initialisation
      initializingEditors.add(uniqueId);
      initRef.current = true;

      try {
        window.tinymce.init({
          selector: `#${uniqueId}`,
          height: 400,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'link image | code preview | removeformat | help',
          content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif; font-size: 14px }',
          branding: false,
          setup: (editor: TinyMCEEditor) => {
            editorRef.current = editor;
            
            editor.on('init', () => {
              setEditorInitialized(true);
              editor.setContent(value || '');
              initializedEditors.set(uniqueId, true);
              initializingEditors.delete(uniqueId);
            });
            
            editor.on('change', () => {
              const newContent = editor.getContent();
              setInternalValue(newContent);
              onChange(newContent);
            });
          }
        });
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de TinyMCE:', error);
        initializingEditors.delete(uniqueId);
        initRef.current = false;
      }
    };

    // Charger le script TinyMCE si nécessaire
    if (typeof window !== 'undefined') {
      if (window.tinymce) {
        // TinyMCE est déjà chargé
        initializeEditor();
      } else if (scriptLoaded) {
        // Script déjà chargé mais TinyMCE pas encore disponible
        setTimeout(initializeEditor, 100);
      } else if (scriptLoading) {
        // Script en cours de chargement
        scriptLoadCallbacks.push(initializeEditor);
      } else {
        // Charger le script
        scriptLoading = true;
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/tinymce.min.js";
        script.async = true;

        script.onload = () => {
          scriptLoaded = true;
          scriptLoading = false;
          // Exécuter tous les callbacks en attente
          scriptLoadCallbacks.forEach(cb => cb());
          scriptLoadCallbacks.length = 0;
          initializeEditor();
        };

        script.onerror = () => {
          scriptLoading = false;
          scriptLoadCallbacks.length = 0;
        };

        document.body.appendChild(script);
      }
    }

    // Nettoyage
    return () => {
      if (typeof window !== 'undefined' && window.tinymce) {
        try {
          const editor = window.tinymce.get(uniqueId);
          if (editor) {
            window.tinymce.remove(`#${uniqueId}`);
            initializedEditors.delete(uniqueId);
            initializingEditors.delete(uniqueId);
          }
        } catch (e) {
          // Ignorer les erreurs de nettoyage
        }
        editorRef.current = null;
        initRef.current = false;
      }
    };
  }, [uniqueId]);

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
  }, [value, editorInitialized, internalValue, uniqueId]);

  return (
    <textarea 
      id={uniqueId}
      placeholder={placeholder}
      style={{ visibility: 'hidden' }}
    />
  );
}

