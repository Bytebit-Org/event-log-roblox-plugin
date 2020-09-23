import { Dumpster } from "@rbxts/dumpster";
import { ISignal } from "@rbxts/signals-tooling";
import { DumpsterFactory } from "factories/DumpsterFactory";
import { SignalFactory } from "factories/SignalFactory";
import { IEventLogStore } from "interfaces/IEventLogStore";
import { EventLog } from "types/EventLog";

export class EventLogStore implements IEventLogStore {
	public readonly eventLogAdded: ISignal<(eventLog: EventLog) => void>;

	private allEventLogs: Array<EventLog>;
	private readonly dumpster: Dumpster;
	private isDestroyed: boolean;

	private constructor(dumpsterFactory: DumpsterFactory, signalFactory: SignalFactory) {
		this.eventLogAdded = signalFactory.createInstance();

		this.allEventLogs = [];
		this.dumpster = dumpsterFactory.createInstance();
		this.isDestroyed = false;

		this.dumpster.dump(this.eventLogAdded);
	}

	public static create(this: void): IEventLogStore {
		return new EventLogStore(new DumpsterFactory(), new SignalFactory());
	}

	public destroy() {
		if (this.isDestroyed) {
			warn(`Attempt to destroy an already destroyed instance of type ${getmetatable(this)}`);
			return;
		}

		this.dumpster.burn();
		this.isDestroyed = true;
	}

	public clear() {
		if (this.isDestroyed) {
			throw `Attempt to call a method on a destroyed instance of type ${getmetatable(this)}`;
		}

		this.allEventLogs = [];
	}

	public getEventLogs(): ReadonlyArray<EventLog> {
		if (this.isDestroyed) {
			throw `Attempt to call a method on a destroyed instance of type ${getmetatable(this)}`;
		}

		return this.allEventLogs;
	}

	public recordEventLog(eventLog: EventLog) {
		if (this.isDestroyed) {
			throw `Attempt to call a method on a destroyed instance of type ${getmetatable(this)}`;
		}

		this.allEventLogs.push(eventLog);

		this.eventLogAdded.fire(eventLog);
	}
}
