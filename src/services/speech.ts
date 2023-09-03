'use strict'

import { Speech } from '../models/speech';

class SpeechService {
  calculateMostSpeechesInYear(speeches: Speech[], year: number): string | null {

    const speakerCounts = new Map();

    for (const speech of speeches) {
      const speechYear = new Date(speech.Date).getFullYear();
      if (speechYear === year) {
        const speaker = speech.Speaker;
        if (speakerCounts.has(speaker)) {
          speakerCounts.set(speaker, speakerCounts.get(speaker) + 1);
        } else {
          speakerCounts.set(speaker, 1);
        }
      }
    };

    const [mostSpeechesPolitician] = [...speakerCounts].reduce((acc, [speaker, count]) => {
      return count > acc[1] ? [speaker, count] : acc;
    }, ["", 0]);

    return mostSpeechesPolitician || null;
  }

  calculateMostSpeechesOnTopic(speeches: Speech[], topic: string): string | null {
    
    const speakerCounts = new Map();

    for (const speech of speeches) {
      if (speech.Topic === topic) {
        const speaker = speech.Speaker;
        if (speakerCounts.has(speaker)) {
          speakerCounts.set(speaker, speakerCounts.get(speaker) + 1);
        } else {
          speakerCounts.set(speaker, 1);
        }
      }
    };

    const [mostSpeechesPolitician] = [...speakerCounts].reduce((acc, [speaker, count]) => {
      return count > acc[1] ? [speaker, count] : acc;
    }, ["", 0]);

    return mostSpeechesPolitician || null;
    
  }

  calculateLeastWordyPolitician(speeches: Speech[]): string | null {
    let minWords = Infinity;
    let leastWordyPolitician: string | null = null;

    for (const speech of speeches) {
      if (speech.Words < minWords) {
        minWords = speech.Words;
        leastWordyPolitician = speech.Speaker;
      }
    }

    return leastWordyPolitician;
  }
}

export { SpeechService };