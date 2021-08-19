import Axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import { SearchResult, VNDetail } from "../types";

const BASE_URL = "https://vnstat.net";

export const searchVN = async (title: string): Promise<SearchResult> => {
    const res: AxiosResponse<SearchResult[]> = await Axios.get(
        `${BASE_URL}/search/novel/${title}`
    );
    const searchResult: SearchResult = res.data[0];
    return searchResult;
};

export const showDetailsForVN = async (
    vnId: string | null = null,
    vnTitle = "",
    onlyReccs = false
): Promise<VNDetail | string[]> => {
    let id = vnId;
    if (vnId === null) {
        res = await searchVN(vnTitle);
        id = res.id;
    }

    const link = `https://vndb.org/v${id}`;
    const detailRes = await Axios.get(`${BASE_URL}/novel/${id}`);
    const html: string = detailRes.data;
    const $ = cheerio.load(html);

    if (onlyReccs) {
        const recs = $(".card-title", "#sim-combined > div")
            .toArray()
            .map((elm) => elm.attribs.href.replace(/\/novel\//, ""));

        return recs;
    }

    const sidebar = $(
        "body > div.container > div > div.col-md-3.col-lg-2.sidebar"
    );
    const title = sidebar.find("div > h3 > a").text();
    const desc = $("#summary > div.row.text-center > small > p").text();
    const image = sidebar.find("div > img").attr("src")?.toString() || "";
    const year = sidebar.find("div > h3 > small").text();
    const avgRating = sidebar
        .find("div > p:nth-child(3) > span:nth-child(2)")
        .text();
    const totalVotes = sidebar
        .find("div > p:nth-child(4) > span.pull-right.text-right")
        .text();

    return {
        id,
        title,
        link,
        desc,
        image,
        year,
        avgRating,
        totalVotes,
    };
};
