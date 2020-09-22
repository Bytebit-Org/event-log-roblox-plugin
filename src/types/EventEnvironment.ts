import { EventEnvironmentType } from "enums/EventEnvironmentType";

export type EventEnvironment = {
    type: EventEnvironmentType.Server
} | {
    type: EventEnvironmentType.Client,
    player: Player
};