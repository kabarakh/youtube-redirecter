export interface YoutubeResult {
    nextPageToken: string;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    items: Array<{
        snippet: {
            position: number;
            resourceId: {
                videoId: string;
            };
        };
    }>;
}
