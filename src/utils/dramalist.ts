import { JSDOM } from "jsdom";
import { Show } from "../types";

const BASE_URL = "https://mydramalist.com";

export const searchShow = async (
    query: string
): Promise<string | undefined> => {
    const { window } = await JSDOM.fromURL(
        encodeURI(`${BASE_URL}/search?q=${query}&adv=titles&co=1&so=relevance`)
    );
    const { document } = window;
    const res = document.querySelector("h6 > a:nth-child(1)");
    const link = res?.getAttribute("href")?.slice(1);
    return link;
};

const findDramaRecommendations = async (link: string): Promise<string[]> => {
    const { window } = await JSDOM.fromURL(`${BASE_URL}/${link}/recs`);
    const { document } = window;
    const related = document.querySelectorAll("b > a");
    const reccLinks: string[] = [];
    related.forEach((el) => {
        const link = el.getAttribute("href");
        if (link) {
            reccLinks.push(link);
        }
    });

    return reccLinks;
};

const findDramaInfo = async (link: string) => {
    let title;
    let genres;
    let episodes;
    let aired;

    const { window } = await JSDOM.fromURL(`${BASE_URL}/${link}`);
    const { document } = window;
    const container = document.querySelector(
        "#content > div > div.container-fluid.title-container > div"
    );
    const showDetails = document.querySelectorAll(
        "#show-detailsxx > div.show-detailsxss > ul:nth-child(1) > li"
    );

    showDetails.forEach((elm) => {
        if (elm.textContent?.startsWith("Native Title:")) {
            title = elm.querySelector("a")?.textContent;
        } else if (elm?.textContent?.startsWith("Genres:")) {
            genres = elm.textContent.replace(/Genres:/, "");
        }
    });

    const overview = document.querySelector(
        "#show-detailsxx > div.show-synopsis > p > span"
    )?.textContent;

    const moreDetails = container?.querySelectorAll(
        "div.col-lg-4.col-md-4 > div > div:nth-child(2) > div.box-body.light-b > ul > li"
    );

    moreDetails.forEach((elm) => {
        if (elm.textContent?.startsWith("Episodes")) {
            episodes = elm.textContent?.replace(/Episodes: /, "");
        } else if (elm.textContent?.startsWith("Aired:")) {
            aired = elm.textContent;
        }
    });

    const rank = container
        ?.querySelector(
            "div.col-lg-4.col-md-4 > div > div:nth-child(3) > div.box-body.light-b > ul > li:nth-child(2)"
        )
        ?.textContent?.replace(/Ranked: /, "");
    const score = container
        ?.querySelector(
            "div.col-lg-4.col-md-4 > div > div:nth-child(3) > div.box-body.light-b > ul > li:nth-child(1)"
        )
        ?.textContent?.replace(/Score: /, "");
    const picture = document
        .querySelector(
            "div.col-lg-8.col-md-8.col-right > div:nth-child(1) > div.box-body > div > div.col-sm-4.film-cover.cover > a:nth-child(2) > img"
        )
        ?.getAttribute("src");

    return {
        title,
        description: overview,
        episodes,
        rank,
        score,
        picture,
        aired,
        genres,
    } as Show;
};

export const getInfo = async (
    query: string,
    dramaLink: string | null = null,
    onlyReccs = false
): Promise<Show | string[] | null> => {
    const resLink = dramaLink || (await searchShow(query));

    if (resLink) {
        if (onlyReccs) {
            const reccs = await findDramaRecommendations(resLink);
            return reccs;
        } else {
            const show = findDramaInfo(resLink);
            return show;
        }
    }

    return null;
};
