import { EventEnvironment } from "./EventEnvironment";

export type EventLog = Readonly<{
	Arguments: ReadonlyArray<unknown>;
	EventInstanceAncestorNames: ReadonlyArray<string>;
	EventInstanceName: string;
	SourceEnvironment: EventEnvironment;
	TargetEnvironment: EventEnvironment;
	UnixTimestampMillis: number;
}>;
