import React, { useState } from 'react';

interface SignTextInputProps {
  onTranslate?: (text: string) => void;
}

export default function SeniaTextInput({ onTranslate }: SignTextInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onTranslate?.(text);
      console.log("Enviando a traducción:", text);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full h-full flex flex-col gap-3 p-5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm focus-within:border-purple-400 transition-all"
    >
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
          Texto a traducir
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe una frase aquí para verla en señas..."
          className="w-full h-32 p-4 bg-slate-50 border-none rounded-xl text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none transition-all"
        />
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs text-slate-400">
          {text.length} caracteres
        </span>
        <button
          type="submit"
          disabled={!text.trim()}
          className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-all shadow-md active:scale-95"
        >
          Traducir
        </button>
      </div>
    </form>
  );
}