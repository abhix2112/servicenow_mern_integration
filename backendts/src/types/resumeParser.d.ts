export interface ParsedResume {
  text: string;
}

export function parseResume(filePath: string): Promise<ParsedResume>; 