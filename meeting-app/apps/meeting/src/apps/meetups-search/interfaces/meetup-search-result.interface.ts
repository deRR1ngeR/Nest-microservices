import { MeetupsSearchBody } from './meetup-search.interface';

export interface MeetupsSearchResult {
    hits: {
        total: number;
        hits: Array<{
            _source: MeetupsSearchBody;
        }>;
    };
}