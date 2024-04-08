import { Match } from './match';

export interface Screen {
    title: string,
    headerBackground: string,
    background: string,
    match?: Match,
    color: string,
    video: string,
    bottomBanner: string[],
    showBanner: boolean,
    bannerTime: number,
    message: string,
    showPresentation: boolean,
    showMessage: boolean,
    messageFullScreen: boolean
}