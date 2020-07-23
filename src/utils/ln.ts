import Axios from 'axios';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { LNDetail, SearchResult } from '../types/ln.d';

export default class LN {
  static async searchLN(title: string): Promise<SearchResult> {
    const res = await fetch(
      encodeURI(`https://bookmeter.com/search?keyword=${title}`)
    );
    const data = await res.json();

    const searchResult: SearchResult = data.resources[0].contents.book;

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

    const detailRes = await Axios.get(
      encodeURI(`https://bookmeter.com/books/${lookupID}`)
    );
    const html: string = detailRes.data;
    const $ = cheerio.load(html);

    const titleA = $('body > header.show__header > h1.inner__title');

    const titleText = titleA.text();
    const bookMeterLink = `https://bookmeter.com/books/${lookupID}`;
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
    console.log({
      id: lookupID,
      title: titleText,
      link: bookMeterLink,
      desc,
      author,
      image: image || '',
      pageCount,
    });

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
