import { JSDOM } from 'jsdom';
import { Word } from '../types/goo.d';

export default class Goo {
  static async searchWord(query: string): Promise<Word> {
    const url = `https://dictionary.goo.ne.jp/srch/jn/${query}/m0u/`;
    const dom = await JSDOM.fromURL(url);
    const { document } = dom.window;
    const wordLink = document
      .querySelector(
        '#NR-main-in > section > div > div.example_sentence > ul > li:nth-child(1) > a'
      )
      ?.getAttribute('href');
    // get sentence and def
    let def: string | undefined = '';
    let reading: string | undefined = '';
    let sentence: string | undefined = '';
    if (wordLink) {
      const dom2 = await JSDOM.fromURL(
        `https://dictionary.goo.ne.jp${wordLink}`
      );
      // meaning
      const doc = dom2.window.document;
      if (doc !== undefined)
        def = doc
          .querySelector(
            '#NR-main > section > div > div.contents-wrap-b.meanging.person.first > div > div.content-box.contents_area.meaning_area.p10'
          )
          ?.textContent?.replace(/ +?/g, '')
          .replace(/\n+/g, '\n')
          .trim();
      reading = doc
        .querySelector(
          '#NR-main > section > div > div.contents-wrap-b.meanging.person.first > div > div.basic_title > h2'
        )
        ?.textContent?.trim()
        .replace(/ の解説/, '');
      sentence = doc
        .querySelector(
          '#NR-main > div.cx > div.rcont > section:nth-child(1) > div > div.example_sentence > ul.content_list.nolink.cx > li:nth-child(1) > p'
        )
        ?.textContent?.replace(/\s+/g, '');
    }
    return {
      title: reading,
      meaning: def,
      sentence,
    };
  }
}
