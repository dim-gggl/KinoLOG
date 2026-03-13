export type OutputFormat = 'JSON' | 'XML' | 'Markdown' | 'Raw Text';

export interface Character {
  id: string;
  name: string;
  appearance: string;
  physicalTraits: string;
  costume: string;
  costumeDetail: string;
  voice: string;
  role: string;
}

export interface DialogLine {
  id: string;
  characterName: string;
  intention: string;
  text: string;
}

export interface Scene {
  id: string;
  header: string;
  description: string;
  dialogues: DialogLine[];
}

export interface VideoMetadata {
  technical: {
    duration: string;
    quality: string;
    aspectRatio: string;
    frameRate: string;
  };
  aesthetic: {
    style: string[];
    genre: string[];
    mood: string;
  };
  environment: {
    timeOfDay: string;
    season: string;
    weather: string;
    locationType: string;
    locationDescription: string;
  };
  visuals: {
    lighting: string[];
    shotTypes: string[];
    cameraMovement: string[];
    focus: string;
    lens: string;
    colorPalette: string[];
    crowdDensity: string;
  };
  narrative: {
    characters: Character[];
    scenes: Scene[];
  };
}

export const INITIAL_METADATA: VideoMetadata = {
  technical: { duration: '00:00:00', quality: '4K', aspectRatio: '2.35:1', frameRate: '24' },
  aesthetic: { style: [], genre: [], mood: '' },
  environment: { 
    timeOfDay: 'Golden Hour', 
    season: 'Summer', 
    weather: 'Clear', 
    locationType: 'Exterior', 
    locationDescription: '' 
  },
  visuals: { 
    lighting: ['Cinematic', 'High Contrast'], 
    shotTypes: ['Close-up'], 
    cameraMovement: ['Static'],
    focus: 'Sharp',
    lens: '35mm',
    colorPalette: ['Amber', 'Teal'],
    crowdDensity: 'Empty'
  },
  narrative: { characters: [], scenes: [] },
};