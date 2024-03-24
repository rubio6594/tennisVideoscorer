import { Match } from './match';

export interface Screen {
    title: string,
    headerBackground: string,
    background: string,
    match?: Match,
    color: string,
    video: string,
    bottomBanner: string[],
    bannerTime: number,
    message: string
}