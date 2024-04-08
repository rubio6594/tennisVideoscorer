import { Time } from "@angular/common";

export interface Match {
    id: number,
    player1: Player,
    player2: Player,
    points1: Point,
    points2: Point,
    sets: Set[],
    serve: boolean,
    goldenPoint: boolean,
    time: number,
    totalSets: boolean,
    tiebreak: boolean,
    timeRunning: boolean,
    serveRunning: boolean,
    round: string,
    sets3: boolean,
    supertiebreak: boolean
}

export interface Player {
    name: string,
    image: string,
    subname: string,
    info: string
}

export type Point = 0 | 15 | 30 | 40 | "AV" | number;

export interface Set {
    won: 0 | 1 | 2,
    games1: number,
    games2: number
}

