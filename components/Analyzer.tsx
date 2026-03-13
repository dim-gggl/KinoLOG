import React, { useState } from 'react';
import { Upload, Film, Loader2, AlertCircle, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { VideoMetadata } from '../types';
import { analyzeMediaContent } from '../services/geminiService';

interface AnalyzerProps {
  onAnalysisComplete: (data: VideoMetadata) => void;
}

export const Analyzer: React.FC<AnalyzerProps> = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 2000 * 1024 * 1024) {
        setError("File is extremely large (>2GB). Upload might take a long time.");
      } else {
        setError(null);
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setProgressMsg("Starting analysis...");

    try {
      const metadata = await analyzeMediaContent(file, file.type, (msg) => setProgressMsg(msg));
      onAnalysisComplete(metadata);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Check file size/format.');
      console.error(err);
    } finally {
      setLoading(false);
      setProgressMsg(null);
    }
  };

  const isVideo = file?.type.startsWith('video/');

  return (
    <div className="flex flex-col gap-4 md:gap-8 h-full">
      <div className="border border-[#222] bg-[#0a0a0a] p-4 md:p-8 flex flex-col items-center justify-center gap-4 md:gap-6 relative overflow-hidden group min-h-[300px] md:min-h-[400px]">
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        {!file ? (
          <>
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-[#333] flex items-center justify-center group-hover:border-[#e5e5e5] transition-colors relative z-10">
              <Upload className="w-6 h-6 md:w-8 md:h-8 text-[#666] group-hover:text-[#e5e5e5] transition-colors" />
            </div>
            <div className="text-center z-10 px-4">
              <h3 className="font-display text-sm md:text-xl tracking-wider mb-2">Upload Source Media</h3>
              <p className="text-[#666] font-mono text-[10px]">Video (MP4, MOV) or Image (JPG, PNG) - Supports large files &gt;300MB</p>
            </div>
            <input 
              type="file" 
              accept="video/*,image/*" 
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
            />
          </>
        ) : (
            <div className="w-full h-full flex flex-col items-center z-10 gap-4 md:gap-6">
                <div className="relative w-full max-w-2xl aspect-video bg-black border border-[#333] flex items-center justify-center overflow-hidden">
                    {previewUrl && (
                        isVideo ? (
                            <video 
                                src={previewUrl} 
                                controls 
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <img 
                                src={previewUrl} 
                                alt="Preview" 
                                className="w-full h-full object-contain"
                            />
                        )
                    )}
                </div>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
                    <span className="font-mono text-[10px] text-[#888] truncate max-w-[200px]">{file.name}</span>
                    <button 
                        onClick={() => { setFile(null); setPreviewUrl(null); setError(null); }}
                        className="text-[10px] text-red-500 hover:text-red-400 font-mono uppercase border-b border-red-900"
                    >
                        Remove
                    </button>
                </div>
                <Button 
                    onClick={handleAnalyze} 
                    disabled={loading}
                    variant="primary"
                    className="w-full max-w-xs"
                    size="md"
                    icon={loading ? <Loader2 className="animate-spin" /> : (isVideo ? <Film /> : <ImageIcon />)}
                >
                    {loading ? (progressMsg || 'Synthesizing Neural Metadata...') : 'Begin Analysis'}
                </Button>
            </div>
        )}

        {error && (
            <div className="absolute bottom-4 left-4 right-4 flex justify-center z-20">
                <div className="bg-red-900/90 text-red-100 text-[10px] font-mono px-4 py-2 border border-red-500 flex items-center gap-2 max-w-md text-center">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                    <button onClick={handleAnalyze} className="ml-2 underline hover:text-white flex items-center gap-1">
                      <RefreshCw size={10} /> Retry
                    </button>
                </div>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 font-mono text-[10px] text-[#444]">
         <div className="border border-[#111] p-3 md:p-4">
            <h4 className="uppercase mb-1 text-[#666]">01. Ingestion</h4>
            <p>Processing temporal morphing & frame data.</p>
         </div>
         <div className="border border-[#111] p-3 md:p-4">
            <h4 className="uppercase mb-1 text-[#666]">02. Recognition</h4>
            <p>Identifying surreal motifs & abstract geometry.</p>
         </div>
         <div className="border border-[#111] p-3 md:p-4">
            <h4 className="uppercase mb-1 text-[#666]">03. Synthesis</h4>
            <p>Exporting cinematic spec in technical formats.</p>
         </div>
      </div>
    </div>
  );
};