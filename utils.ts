import { VideoMetadata, OutputFormat } from './types';

export const generateOutput = (data: VideoMetadata, format: OutputFormat): string => {
  switch (format) {
    case 'JSON':
      return JSON.stringify(data, null, 2);
    case 'XML':
      return `<?xml version="1.0" encoding="UTF-8"?>
<kinolog_spec>
  <technical>
    <duration>${data.technical.duration}</duration>
    <quality>${data.technical.quality}</quality>
    <aspectRatio>${data.technical.aspectRatio}</aspectRatio>
    <fps>${data.technical.frameRate}</fps>
  </technical>
  <aesthetic>
    <mood>${data.aesthetic.mood}</mood>
    <styles>${data.aesthetic.style.join(', ')}</styles>
  </aesthetic>
  <visual_direction>
    <lighting>${data.visuals.lighting.join(', ')}</lighting>
    <camera_shots>${data.visuals.shotTypes.join(', ')}</camera_shots>
    <movement>${data.visuals.cameraMovement.join(', ')}</movement>
    <palette>${data.visuals.colorPalette.join(', ')}</palette>
    <lens>${data.visuals.lens}</lens>
  </visual_direction>
  <narrative>
    <cast>${data.narrative.characters.map(c => `
      <actor name="${c.name}" role="${c.role}">
        <physique>${c.physicalTraits}</physique>
        <wardrobe>${c.costumeDetail}</wardrobe>
      </actor>`).join('')}
    </cast>
    <script>${data.narrative.scenes.map(s => `
      <scene header="${s.header}">
        <description>${s.description}</description>
        ${s.dialogues.map(d => `
        <dialogue actor="${d.characterName}" intention="${d.intention}">${d.text}</dialogue>`).join('')}
      </scene>`).join('')}
    </script>
  </narrative>
</kinolog_spec>`;
    case 'Markdown':
      return `# KINOLOG SPECIFICATION REPORT

## TECHNICAL SPECIFICATIONS
- **Duration:** ${data.technical.duration}
- **Quality:** ${data.technical.quality} @ ${data.technical.frameRate}fps
- **Aspect Ratio:** ${data.technical.aspectRatio}

## VISUAL DIRECTION
- **Lighting:** ${data.visuals.lighting.join(', ')}
- **Camera Shots:** ${data.visuals.shotTypes.join(', ')}
- **Movement:** ${data.visuals.cameraMovement.join(', ')}
- **Focus/Lens:** ${data.visuals.focus} / ${data.visuals.lens}
- **Color Palette:** ${data.visuals.colorPalette.join(', ')}

## ENVIRONMENT
- **Time/Season:** ${data.environment.timeOfDay} in ${data.environment.season}
- **Weather:** ${data.environment.weather}
- **Location:** ${data.environment.locationType} - ${data.environment.locationDescription}

## CAST & CHARACTERS
${data.narrative.characters.map(c => `### ${c.name} (${c.role})
- **Appearance:** ${c.physicalTraits}
- **Wardrobe:** ${c.costumeDetail}`).join('\n\n')}

## SCREENPLAY
${data.narrative.scenes.map(s => `### ${s.header}
*${s.description}*

${s.dialogues.map(d => `**${d.characterName.toUpperCase()}** *(${d.intention})*
> ${d.text}`).join('\n\n')}`).join('\n\n---\n\n')}
`;
    case 'Raw Text':
      return `[KINOLOG SPEC]\nTECHNICAL: ${data.technical.quality} / ${data.technical.aspectRatio}\nVISUALS: ${data.visuals.shotTypes.join(', ')}\nCAST: ${data.narrative.characters.length} actors.\nSCRIPT: ${data.narrative.scenes.length} scenes.`;
    default:
      return '';
  }
};

export const downloadFile = (content: string, format: OutputFormat) => {
  const extensions = { 'JSON': 'json', 'XML': 'xml', 'Markdown': 'md', 'Raw Text': 'txt' };
  const mimeTypes = { 'JSON': 'application/json', 'XML': 'application/xml', 'Markdown': 'text/markdown', 'Raw Text': 'text/plain' };
  const blob = new Blob([content], { type: mimeTypes[format] });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kinolog-analysis-${Date.now()}.${extensions[format]}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};