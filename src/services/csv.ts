import axios from 'axios';
import csvParser from 'csv-parser';
import fs from 'fs';
import moment from 'moment';

class CsvService {
  static async getDataFromCsv(url: string): Promise<any[]> {
    try {
      const now = moment().format('YYYY-MM-DD HH:mm:ss');
      const response = await axios.get(url);
      const data = response.data.split(', ').join(',');

      const parsedData: any[] = [];
      fs.writeFileSync(`data${now}.csv`, data);

      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(`data${now}.csv`)
          .pipe(csvParser())
          .on('data', (row: any) => {
            parsedData.push(row);
          })
          .on('end', () => {
            resolve();
          })
          .on('error', (error: any) => {
            reject(error);
          });
      });

      return parsedData;
    } catch (error: any) {
      throw new Error('Error downloading or parsing CSV: ' + error.message);
    }
  }
}

export { CsvService };