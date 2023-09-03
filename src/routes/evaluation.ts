import express, { Request, Response } from 'express';
import { Speech } from '../models/speech';
import { SpeechService } from '../services/speech';
import { CsvService } from '../services/csv';

const evaluationRouter = express.Router();
const speechService = new SpeechService();

evaluationRouter.get('/', async (req: Request, res: Response) => {

    if(!req.query.url) {
        return res.json({
            mostSpeeches: null,
            mostSecurity: null,
            leastWordy: null,
        })
    }

    let urls: string[] = [];
    if(typeof req.query.url === 'string') {
        urls.push(req.query.url)
    } else 
        urls = req.query.url as string[];

    const speeches: Speech[] = [];
    const year: number = (process.env.YEAR_FOR_CALCULATING_MOST_SPEECHES || 2013) as number;
    const topic: string = (process.env.TOPIC_FOR_CALCULATING_MOST_SPEECHES || 'Internal Security') as string;

    try {
        for (const url of urls) {
            const parsedData = await CsvService.getDataFromCsv(url); 

            parsedData.forEach((row: any) => {
                const speech = new Speech(row.Speaker, row.Topic, row.Date, row.Words);
                speeches.push(speech);
            });
        }
        
        const mostSpeechesInYear = speechService.calculateMostSpeechesInYear(speeches, +year);
        const mostSpeechesOnTopic = speechService.calculateMostSpeechesOnTopic(speeches, topic);
        const leastWordyPolitician = speechService.calculateLeastWordyPolitician(speeches);

        return res.json({
            mostSpeeches: mostSpeechesInYear,
            mostSecurity: mostSpeechesOnTopic,
            leastWordy: leastWordyPolitician,
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the speeches' });
    }
});

export { evaluationRouter };