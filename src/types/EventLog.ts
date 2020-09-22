import { EventEnvironment } from "./EventEnvironment";

export type EventLog = Readonly<{
	Arguments: ReadonlyArray<unknown>;
	EventInstanceAncestorNames: ReadonlyArray<string>;
	EventInstanceName: string;
	FiringEnvironment: EventEnvironment;
	ListeningEnvironment: EventEnvironment;
	UnixTimestamp: number;
}>;
