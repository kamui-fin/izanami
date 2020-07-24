// @ts-ignore
import Trakt from 'trakt.tv';
import { Show } from '../types/drama.d';

export default class Drama {
  query: string;

  constructor(query: string) {
    this.query = query;
  }

  async getInfo(): Promise<Show> {
    const options = {
      client_id:
        'b33e959562ea353e421abecaa626903f68faf6fa0d47b05c0e1a00b7e6059a9d',
      client_secret: process.env.TRAKT_TV_KEY,
      redirect_uri: null,
      api_url: null,
    };
    const trakt = new Trakt(options);
    const res = await trakt.search.text({ type: 'show', query: this.query });
    const id = res[0].show.ids.trakt;
    const drama: Show = await trakt.shows.summary({ id, extended: 'full' });
    return drama;
  }
}
