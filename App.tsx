import React, { useState } from 'react';
import { Analyzer } from './components/Analyzer';
import { Builder } from './components/Builder';
import { VideoMetadata, OutputFormat, INITIAL_METADATA } from './types';
import { generateOutput, downloadFile } from './utils';
import { Button } from './components/ui/Button';
import { Download, Terminal, Settings, Database, Share2 } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<'analyzer' | 'builder'>('analyzer');
  const [data, setData] = useState<VideoMetadata>(INITIAL_METADATA);
  const [previewFormat, setPreviewFormat] = useState<OutputFormat>('JSON');
  const [showOutputMobile, setShowOutputMobile] = useState(false);

  const handleDownload = (format: OutputFormat) => {
    const content = generateOutput(data, format);
    downloadFile(content, format);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateOutput(data, previewFormat));
    alert('Copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-mono selection:bg-[#d97706] selection:text-white flex flex-col h-screen overflow-hidden">
      
      {/* Header */}
      <header className="h-14 md:h-16 shrink-0 border-b border-[#222] flex items-center justify-between px-4 md:px-8 bg-[#050505] z-50">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-[#e5e5e5] text-black flex items-center justify-center font-bold text-sm md:text-xl font-display">K</div>
          <h1 className="font-display text-sm md:text-xl tracking-[0.1em] md:tracking-[0.2em] uppercase whitespace-nowrap">
            Kino<span className="hidden sm:inline text-[#444]">LOG</span>
          </h1>
        </div>
        
        <div className="flex gap-1 md:gap-2 p-1 bg-[#111] border border-[#222] rounded-sm">
           <button 
             onClick={() => { setMode('analyzer'); setShowOutputMobile(false); }}
             className={`px-3 md:px-4 py-1 text-[10px] md:text-xs uppercase tracking-wider transition-colors ${mode === 'analyzer' && !showOutputMobile ? 'bg-[#e5e5e5] text-black' : 'text-[#666] hover:text-[#e5e5e5]'}`}
           >
             Ingest
           </button>
           <button 
             onClick={() => { setMode('builder'); setShowOutputMobile(false); }}
             className={`px-3 md:px-4 py-1 text-[10px] md:text-xs uppercase tracking-wider transition-colors ${mode === 'builder' && !showOutputMobile ? 'bg-[#e5e5e5] text-black' : 'text-[#666] hover:text-[#e5e5e5]'}`}
           >
             Build
           </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Panel: Input / Form */}
        <div className={`flex-1 border-r border-[#222] md:p-8 overflow-y-auto transition-all duration-500 
          ${showOutputMobile ? 'hidden md:block' : 'block p-4 md:p-8'}
          ${mode === 'analyzer' ? 'bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#111] via-[#050505] to-[#050505]' : 'bg-[#050505]'}`}>
            
            <h2 className="font-ui text-[10px] md:text-sm uppercase text-[#666] mb-4 md:mb-8 tracking-widest border-l-2 border-[#d97706] pl-4">
                {mode === 'analyzer' ? 'System Input // Ingestion' : 'Manual Entry // Specification'}
            </h2>
            
            <div className="h-full">
              {mode === 'analyzer' ? (
                  <Analyzer onAnalysisComplete={(newData) => setData(newData)} />
              ) : (
                  <Builder initialData={data} onDataChange={setData} />
              )}
            </div>
        </div>

        {/* Right Panel: Output Preview */}
        <div className={`
          md:w-[40%] bg-[#080808] flex flex-col border-l border-[#222] h-full
          ${showOutputMobile ? 'flex flex-1 absolute inset-0 z-40 bg-[#080808]' : 'hidden md:flex'}
        `}>
           <div className="h-10 md:h-12 shrink-0 border-b border-[#222] flex items-center justify-between px-4 md:px-6 bg-[#0a0a0a]">
              <span className="text-[10px] uppercase text-[#666] font-mono">Terminal_Output</span>
              <div className="flex gap-1 md:gap-2">
                 {(['JSON', 'XML', 'MD', 'TXT'] as const).map(fmt => {
                     const fullFmt = fmt === 'MD' ? 'Markdown' : fmt === 'TXT' ? 'Raw Text' : fmt;
                     return (
                        <button 
                            key={fmt} 
                            onClick={() => setPreviewFormat(fullFmt as OutputFormat)}
                            className={`text-[9px] md:text-[10px] px-1 md:px-2 py-0.5 md:py-1 uppercase border transition-colors ${previewFormat === fullFmt ? 'border-[#e5e5e5] text-[#e5e5e5]' : 'border-transparent text-[#444] hover:text-[#888]'}`}
                        >
                            {fmt}
                        </button>
                     );
                 })}
              </div>
           </div>
           
           <div className="flex-1 overflow-auto p-4 md:p-6 font-mono text-[10px] md:text-xs relative group bg-black">
              <pre className="text-[#888] whitespace-pre-wrap leading-relaxed relative z-10 pb-20">
                  {generateOutput(data, previewFormat)}
              </pre>
              {/* Overlay Gradient for depth */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#080808_120%)]"></div>
           </div>

           {/* Buttons Bar - Ensured fixed at bottom of panel */}
           <div className="shrink-0 p-4 md:p-6 border-t border-[#222] bg-[#0a0a0a] z-20">
              <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    onClick={() => handleDownload(previewFormat)}
                    icon={<Download className="w-3 h-3 md:w-4 md:h-4"/>}
                    size="sm"
                  >
                    Export
                  </Button>
                  <Button 
                    variant="secondary"
                    size="sm"
                    onClick={copyToClipboard}
                    icon={<Share2 className="w-3 h-3 md:w-4 md:h-4"/>}
                  >
                    Copy
                  </Button>
              </div>
           </div>
        </div>
      </main>

      {/* Mobile Nav Toggle */}
      <div className="md:hidden h-14 shrink-0 border-t border-[#222] bg-[#0a0a0a] flex items-center justify-around px-4 z-50">
          <button 
            onClick={() => { setShowOutputMobile(false); setMode('analyzer'); }}
            className={`flex flex-col items-center gap-1 transition-colors ${!showOutputMobile && mode === 'analyzer' ? 'text-[#e5e5e5]' : 'text-[#444]'}`}
          >
            <Database size={18} />
            <span className="text-[9px] uppercase tracking-tighter">Ingest</span>
          </button>
          <button 
            onClick={() => { setShowOutputMobile(false); setMode('builder'); }}
            className={`flex flex-col items-center gap-1 transition-colors ${!showOutputMobile && mode === 'builder' ? 'text-[#e5e5e5]' : 'text-[#444]'}`}
          >
            <Settings size={18} />
            <span className="text-[9px] uppercase tracking-tighter">Build</span>
          </button>
          <button 
            onClick={() => setShowOutputMobile(true)}
            className={`flex flex-col items-center gap-1 transition-colors ${showOutputMobile ? 'text-[#e5e5e5]' : 'text-[#444]'}`}
          >
            <Terminal size={18} />
            <span className="text-[9px] uppercase tracking-tighter">Output</span>
          </button>
      </div>

      {/* Decorative Status Bar (Desktop Only) */}
      <footer className="hidden md:flex h-8 shrink-0 border-t border-[#222] bg-[#000] items-center justify-between px-4 text-[10px] text-[#444] uppercase tracking-widest">
         <div className="flex gap-4">
            <span>SYS: ONLINE</span>
            <span>MEM: OPTIMAL</span>
            <span>LATENCY: 12ms</span>
         </div>
         <div>
            KinoLOG v1.0.5 [STABLE]
         </div>
      </footer>
    </div>
  );
};

export default App;