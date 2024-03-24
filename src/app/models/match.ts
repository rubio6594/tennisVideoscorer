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
    tiebreak: boolean
}

export interface Player {
    name: string,
    image: string
}

export type Point = 0 | 15 | 30 | 40 | "Adv" | number;

export interface Set {
    won: 0 | 1 | 2,
    games1: number,
    games2: number
}

