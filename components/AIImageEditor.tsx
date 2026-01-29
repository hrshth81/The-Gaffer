
import React, { useState, useRef } from 'react';
import { Wand2, Image as ImageIcon, Sparkles, Loader2, Download } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const AIImageEditor: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !prompt) return;

    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = selectedImage.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: 'image/png',
              },
            },
            {
              text: `Professional football/soccer match highlight editor: ${prompt}. Return only the edited image.`,
            },
          ],
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setEditedImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error("Image editing failed:", error);
      alert("The Referee has disallowed the goal (Editing failed). Check your prompt.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="gaffer-glass rounded-3xl p-6 border border-emerald-500/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Sparkles size={100} className="text-emerald-500" />
      </div>
      
      <h3 className="text-white font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
        <Wand2 size={16} className="text-emerald-400" />
        Media Masterclass AI
      </h3>

      {!selectedImage ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="bg-white/5 border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all"
        >
          <ImageIcon className="text-gray-500 mb-3" size={32} />
          <p className="text-white font-bold text-xs uppercase tracking-tighter">Upload Highlight Screenshot</p>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/40">
            <img src={editedImage || selectedImage} className="w-full h-full object-contain" alt="Editor" />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-emerald-500 mb-2" size={32} />
                <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">VAR Processing...</p>
              </div>
            )}
          </div>

          {!editedImage ? (
            <div className="space-y-3">
              <input 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Add a stadium lighting effect..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleEdit}
                  disabled={isProcessing || !prompt}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs uppercase transition-all shadow-lg shadow-emerald-500/10"
                >
                  Apply Filter
                </button>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl text-xs uppercase transition-all"
                >
                  Discard
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => setEditedImage(null)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl text-xs uppercase transition-all"
              >
                Reset
              </button>
              <a 
                href={editedImage} 
                download="gaffer-highlight.png"
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl text-xs uppercase transition-all flex items-center justify-center gap-2"
              >
                <Download size={14} />
                Download
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIImageEditor;
