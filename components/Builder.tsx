import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, User, Clapperboard, Sun, Camera, Palette, Settings, Trash2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Input, Select, TextArea } from './ui/Input';
import { VideoMetadata, Character, Scene, DialogLine, INITIAL_METADATA } from '../types';

interface BuilderProps {
  initialData?: VideoMetadata;
  onDataChange: (data: VideoMetadata) => void;
}

export const Builder: React.FC<BuilderProps> = ({ initialData, onDataChange }) => {
  const [data, setData] = useState<VideoMetadata>(initialData || INITIAL_METADATA);
  const [activeSection, setActiveSection] = useState<string>('technical');

  React.useEffect(() => {
    onDataChange(data);
  }, [data, onDataChange]);

  const updateField = (section: keyof VideoMetadata, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const updateArrayField = (section: keyof VideoMetadata, field: string, value: string) => {
     const array = value.split(',').map((s: string) => s.trim()).filter(s => s !== '');
     setData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: array }
      }));
  };

  const addCharacter = () => {
    const newChar: Character = {
      id: Date.now().toString(),
      name: '', physicalTraits: '', costumeDetail: '', voice: '', role: 'Lead', appearance: '', costume: ''
    };
    setData(prev => ({
      ...prev,
      narrative: { ...prev.narrative, characters: [...prev.narrative.characters, newChar] }
    }));
  };

  const removeCharacter = (id: string) => {
    setData(prev => ({
      ...prev,
      narrative: {
        ...prev.narrative,
        characters: prev.narrative.characters.filter(c => c.id !== id)
      }
    }));
  };

  const updateCharacter = (id: string, field: keyof Character, value: string) => {
    setData(prev => ({
      ...prev,
      narrative: {
        ...prev.narrative,
        characters: prev.narrative.characters.map(c => c.id === id ? { ...c, [field]: value } : c)
      }
    }));
  };

  const addScene = () => {
    const newScene: Scene = {
        id: Date.now().toString(),
        header: 'INT. LOCATION - DAY',
        description: '',
        dialogues: []
    };
    setData(prev => ({
        ...prev,
        narrative: { ...prev.narrative, scenes: [...prev.narrative.scenes, newScene] }
    }));
  };

  const removeScene = (id: string) => {
    setData(prev => ({
      ...prev,
      narrative: {
        ...prev.narrative,
        scenes: prev.narrative.scenes.filter(s => s.id !== id)
      }
    }));
  };

  const addDialog = (sceneId: string) => {
     const scene = data.narrative.scenes.find(s => s.id === sceneId);
     if(!scene) return;
     const newDialog: DialogLine = {
         id: Date.now().toString(),
         characterName: '', intention: 'Neutral', text: ''
     };
     const updatedScenes = data.narrative.scenes.map(s => 
        s.id === sceneId ? { ...s, dialogues: [...s.dialogues, newDialog] } : s
     );
     setData(prev => ({ ...prev, narrative: { ...prev.narrative, scenes: updatedScenes } }));
  };

  const removeDialog = (sceneId: string, dialogId: string) => {
    const updatedScenes = data.narrative.scenes.map(s => {
      if (s.id === sceneId) {
        return {
          ...s,
          dialogues: s.dialogues.filter(d => d.id !== dialogId)
        };
      }
      return s;
    });
    setData(prev => ({ ...prev, narrative: { ...prev.narrative, scenes: updatedScenes } }));
  };

  const updateDialog = (sceneId: string, dialogId: string, field: keyof DialogLine, value: string) => {
    const updatedScenes = data.narrative.scenes.map(s => {
        if (s.id === sceneId) {
            return {
                ...s,
                dialogues: s.dialogues.map(d => d.id === dialogId ? { ...d, [field]: value } : d)
            };
        }
        return s;
    });
    setData(prev => ({ ...prev, narrative: { ...prev.narrative, scenes: updatedScenes } }));
  };

  const SectionHeader = ({ id, title, icon: Icon }: { id: string, title: string, icon: any }) => (
    <button 
      onClick={() => setActiveSection(activeSection === id ? '' : id)}
      className={`w-full flex items-center justify-between p-5 md:p-6 border-b border-[#222] hover:bg-[#111] transition-all sticky top-0 bg-[#050505] z-10 ${activeSection === id ? 'text-[#e5e5e5] border-b-[#d97706]' : 'text-[#444]'}`}
      aria-expanded={activeSection === id}
    >
      <div className="flex items-center gap-4">
        <Icon size={18} className={activeSection === id ? 'text-[#d97706]' : ''} />
        <span className="font-display text-xs md:text-sm tracking-[0.2em] uppercase text-left">{title}</span>
      </div>
      {activeSection === id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
  );

  return (
    <div className="flex flex-col border border-[#222] bg-[#050505] h-full overflow-x-hidden">
      
      {/* 01. TECHNICAL */}
      <SectionHeader id="technical" title="01. Technique" icon={Settings} />
      {activeSection === 'technical' && (
        <div className="p-5 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <Input label="Durée" value={data.technical.duration} onChange={e => updateField('technical', 'duration', e.target.value)} placeholder="00:00:00" />
          <Select label="Qualité" options={['8K', '4K', '1080p', '720p']} value={data.technical.quality} onChange={e => updateField('technical', 'quality', e.target.value)} />
          <Select label="Aspect Ratio" options={['16:9', '9:16', '2.35:1', '4:3']} value={data.technical.aspectRatio} onChange={e => updateField('technical', 'aspectRatio', e.target.value)} />
          <Input label="FPS" value={data.technical.frameRate} onChange={e => updateField('technical', 'frameRate', e.target.value)} placeholder="24" />
        </div>
      )}

      {/* 02. AESTHETIC */}
      <SectionHeader id="aesthetic" title="02. Esthétique" icon={Palette} />
      {activeSection === 'aesthetic' && (
        <div className="p-5 md:p-8 grid grid-cols-1 gap-6 animate-in fade-in duration-300">
           <Input label="Styles (séparés par virgule)" value={data.aesthetic.style.join(', ')} onChange={e => updateArrayField('aesthetic', 'style', e.target.value)} placeholder="Cinematic, Noir, Documentary..." />
           <Input label="Genres (séparés par virgule)" value={data.aesthetic.genre.join(', ')} onChange={e => updateArrayField('aesthetic', 'genre', e.target.value)} placeholder="Sci-Fi, Art, Thriller..." />
           <Input label="Mood" value={data.aesthetic.mood} onChange={e => updateField('aesthetic', 'mood', e.target.value)} placeholder="Melancholic, Energetic..." />
        </div>
      )}

      {/* 03. VISUALS */}
      <SectionHeader id="visuals" title="03. Cinématographie" icon={Camera} />
      {activeSection === 'visuals' && (
        <div className="p-5 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in duration-300">
          <Input label="Lumières" value={data.visuals.lighting.join(', ')} onChange={e => updateArrayField('visuals', 'lighting', e.target.value)} placeholder="High Key, Natural, Neon..." />
          <Input label="Types de Plans" value={data.visuals.shotTypes.join(', ')} onChange={e => updateArrayField('visuals', 'shotTypes', e.target.value)} placeholder="Close-up, Wide, POV..." />
          <Input label="Mouvements" value={data.visuals.cameraMovement.join(', ')} onChange={e => updateArrayField('visuals', 'cameraMovement', e.target.value)} placeholder="Pan, Tilt, Dolly, Drone..." />
          <Input label="Focus" value={data.visuals.focus} onChange={e => updateField('visuals', 'focus', e.target.value)} placeholder="Sharp, Shallow, Pull..." />
          <Input label="Objectif (Lens)" value={data.visuals.lens} onChange={e => updateField('visuals', 'lens', e.target.value)} placeholder="35mm Anamorphic..." />
          <Input label="Palette Couleurs" value={data.visuals.colorPalette.join(', ')} onChange={e => updateArrayField('visuals', 'colorPalette', e.target.value)} placeholder="Teal & Orange, Pastel..." />
          <Input label="Densité Foule" value={data.visuals.crowdDensity} onChange={e => updateField('visuals', 'crowdDensity', e.target.value)} placeholder="Crowded, Empty..." />
        </div>
      )}

      {/* 04. ENVIRONMENT */}
      <SectionHeader id="environment" title="04. Environnement" icon={Sun} />
      {activeSection === 'environment' && (
        <div className="p-5 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
           <Select label="Moment" options={['Day', 'Night', 'Golden Hour', 'Blue Hour', 'Dawn']} value={data.environment.timeOfDay} onChange={e => updateField('environment', 'timeOfDay', e.target.value)} />
           <Select label="Saison" options={['Spring', 'Summer', 'Autumn', 'Winter']} value={data.environment.season} onChange={e => updateField('environment', 'season', e.target.value)} />
           <Input label="Météo" value={data.environment.weather} onChange={e => updateField('environment', 'weather', e.target.value)} placeholder="Clear, Rainy, Foggy..." />
           <Select label="Type Lieu" options={['Interior', 'Exterior', 'Studio', 'CGI']} value={data.environment.locationType} onChange={e => updateField('environment', 'locationType', e.target.value)} />
           <div className="sm:col-span-2">
             <TextArea label="Description Lieu" value={data.environment.locationDescription} onChange={e => updateField('environment', 'locationDescription', e.target.value)} placeholder="Abandoned warehouse with dust motes..." />
           </div>
        </div>
      )}

      {/* 05. NARRATIVE */}
      <SectionHeader id="narrative" title="05. Cast & Physique" icon={User} />
      {activeSection === 'narrative' && (
        <div className="p-5 md:p-8 flex flex-col gap-8 animate-in fade-in duration-300">
           <div className="flex justify-between items-center border-b border-[#222] pb-3">
              <h3 className="text-xs uppercase text-[#666] tracking-widest">Fiches Acteurs</h3>
              <Button size="sm" variant="ghost" onClick={addCharacter} icon={<Plus size={14}/>}>Ajouter</Button>
           </div>
           <div className="space-y-10">
              {data.narrative.characters.map((char) => (
                  <div key={char.id} className="relative border-l-2 border-[#333] pl-5 space-y-5 pb-6 bg-[#080808]/40 p-4 md:p-0 md:bg-transparent">
                      <button 
                        onClick={() => removeCharacter(char.id)}
                        className="absolute top-0 right-0 p-2 text-[#444] hover:text-red-500 transition-colors"
                        title="Remove character"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <Input label="Nom" value={char.name} onChange={e => updateCharacter(char.id, 'name', e.target.value)} placeholder="Character Name" />
                          <Select label="Rôle" options={['Protagonist', 'Antagonist', 'Supporting', 'Extra']} value={char.role} onChange={e => updateCharacter(char.id, 'role', e.target.value)} />
                      </div>
                      <TextArea label="Apparence Physique" value={char.physicalTraits} onChange={e => updateCharacter(char.id, 'physicalTraits', e.target.value)} placeholder="Height, hair color, distinctive marks..." />
                      <TextArea label="Costume & Texture" value={char.costumeDetail} onChange={e => updateCharacter(char.id, 'costumeDetail', e.target.value)} placeholder="Silk shirts, heavy boots, worn leather..." />
                      <Input label="Voix" value={char.voice} onChange={e => updateCharacter(char.id, 'voice', e.target.value)} placeholder="Deep, raspy, melodic..." />
                  </div>
              ))}
              {data.narrative.characters.length === 0 && (
                <div className="text-center py-8 border border-dashed border-[#222] text-[#444] text-xs">Aucun acteur défini</div>
              )}
           </div>
        </div>
      )}

      {/* 06. SCREENPLAY */}
      <SectionHeader id="screenplay" title="06. Script & Intentions" icon={Clapperboard} />
      {activeSection === 'screenplay' && (
        <div className="p-5 md:p-8 flex flex-col gap-10 animate-in fade-in duration-300">
           <Button size="md" variant="secondary" onClick={addScene} className="w-full border-dashed py-4" icon={<Plus size={18}/>}>Nouvelle Scène</Button>
           <div className="space-y-12">
              {data.narrative.scenes.map((scene) => (
                  <div key={scene.id} className="bg-[#080808] border border-[#222] p-5 rounded-md relative group">
                      <button 
                        onClick={() => removeScene(scene.id)}
                        className="absolute top-4 right-4 p-2 text-[#333] hover:text-red-500 transition-colors"
                        title="Remove scene"
                      >
                        <Trash2 size={16} />
                      </button>
                      <Input 
                        label="Entête Scène"
                        value={scene.header} 
                        onChange={e => {
                          const updated = data.narrative.scenes.map(s => s.id === scene.id ? {...s, header: e.target.value} : s);
                          setData(prev => ({...prev, narrative: {...prev.narrative, scenes: updated}}));
                        }} 
                        className="font-display text-xs mb-4 border-b border-[#222] bg-transparent p-0 focus:ring-0 uppercase tracking-widest" 
                      />
                      
                      <TextArea 
                        label="Description Action" 
                        value={scene.description} 
                        onChange={e => {
                          const updated = data.narrative.scenes.map(s => s.id === scene.id ? {...s, description: e.target.value} : s);
                          setData(prev => ({...prev, narrative: {...prev.narrative, scenes: updated}}));
                        }} 
                        className="mb-6 text-[12px] bg-[#050505]" 
                      />

                      <div className="space-y-6 pl-4 border-l border-[#222]">
                          <div className="flex justify-between items-center mb-2">
                             <h4 className="text-[10px] uppercase text-[#555] tracking-widest font-bold">Dialogue</h4>
                          </div>
                          {scene.dialogues.map(d => (
                              <div key={d.id} className="grid grid-cols-1 gap-3 relative bg-black/20 p-3 rounded">
                                  <button 
                                    onClick={() => removeDialog(scene.id, d.id)}
                                    className="absolute -top-2 -right-2 p-1 bg-[#111] border border-[#222] rounded-full text-[#444] hover:text-red-500 transition-colors z-10"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                  <div className="flex flex-col sm:flex-row gap-3">
                                      <div className="w-full sm:w-1/3">
                                        <Input label="Perso" placeholder="NAME" value={d.characterName} onChange={e => updateDialog(scene.id, d.id, 'characterName', e.target.value)} className="text-[10px] uppercase font-bold" />
                                      </div>
                                      <div className="w-full sm:w-2/3">
                                        <Input label="Intention" placeholder="EMOTION" value={d.intention} onChange={e => updateDialog(scene.id, d.id, 'intention', e.target.value)} className="text-[10px] italic text-[#666]" />
                                      </div>
                                  </div>
                                  <TextArea value={d.text} onChange={e => updateDialog(scene.id, d.id, 'text', e.target.value)} className="min-h-[60px] text-[12px] bg-[#0a0a0a]" placeholder="The character says..." />
                              </div>
                          ))}
                          <button 
                            onClick={() => addDialog(scene.id)} 
                            className="w-full py-3 border border-dashed border-[#222] text-[10px] uppercase text-[#444] hover:text-[#e5e5e5] hover:border-[#444] transition-all rounded"
                          >
                            + Ajouter Dialogue
                          </button>
                      </div>
                  </div>
              ))}
              {data.narrative.scenes.length === 0 && (
                <div className="text-center py-10 border border-dashed border-[#222] text-[#444] text-xs">Aucune scène définie</div>
              )}
           </div>
        </div>
      )}

    </div>
  );
};