import Axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import { LNDetail, SearchResult } from '../types/ln.d';

export default class LN {
  static async searchLN(title: string): Promise<SearchResult> {
    const res: AxiosResponse<any> = await Axios.get(
      encodeURI(`https://bookmeter.com/search?keyword=${title}`)
    );
    const searchResult: SearchResult = res.data[0];
    return searchResult;
  }

  static async showDetailsForLN(
    id: string | null = null,
    title = ''
  ): Promise<LNDetail | string[]> {
    let lookupID: string | null = id;
    if (id === null) {
      const res = await LN.searchLN(title);
      lookupID = res.id;
    }
    console.log('reached details');

    const detailRes = await Axios.get(
      encodeURI(`https://bookmeter.com/${lookupID}`)
    );
    const html: string = detailRes.data;
    const $ = cheerio.load(html);

    const titleA = $('body > header.show__header > h1.inner__title');

    const titleText = titleA.text();
    const bookMeterLink = `https://bookmeter.com/${lookupID}`;
    const desc = $('div.book-summary__default > p').text();
    const image = $(
      'body > div.bm-wrapper > div.group__image > div.image__cover > img'
    )
      .attr('src')
      ?.toString();
    const pageCount = $(
      'body > dl.bm-details-side > dd:nth-child(2) > span'
    ).text();
    const author = $('body > ul.header__authors > li > a').text();
    return {
      id: lookupID,
      title: titleText,
      link: bookMeterLink,
      desc,
      author,
      image: image || '',
      pageCount,
    };
  }
}
