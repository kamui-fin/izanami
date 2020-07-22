export interface SearchResult {
  id : string;
  title: string;
  page: string;
  path: string;
}

export interface LNDetail {
  id: string | null;
  title: string;
  author: string;
  link: string;
  desc: string;
  image: string;
  pageCount: string;
}
