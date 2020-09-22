import { IDestroyable } from "@rbxts/dumpster";
import { IReadOnlySignal } from "@rbxts/signals-tooling";
import { EventLog } from "types/EventLog";

export interface IEventLogStore extends IDestroyable {
	readonly eventLogAdded: IReadOnlySignal<(newEventLog: EventLog) => void>;

	getEventLogs(): ReadonlyArray<EventLog>;
	recordEventLog(eventLog: EventLog): void;
}
