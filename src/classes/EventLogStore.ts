import { DoublyLinkedList, ReadonlyDoublyLinkedList } from "@rbxts/basic-utilities";
import { Dumpster } from "@rbxts/dumpster";
import { ISignal } from "@rbxts/signals-tooling";
import { DumpsterFactory } from "factories/DumpsterFactory";
import { SignalFactory } from "factories/SignalFactory";
import { IEventLogStore } from "interfaces/IEventLogStore";
import { EventLog } from "types/EventLog";

export class EventLogStore implements IEventLogStore {
	public readonly eventLogAdded: ISignal<(eventLog: EventLog) => void>;

	private readonly allEventLogs: DoublyLinkedList<EventLog>;
	private readonly dumpster: Dumpster;
	private isDestroyed: boolean;

	private constructor(dumpsterFactory: DumpsterFactory, signalFactory: SignalFactory) {
		this.eventLogAdded = signalFactory.createInstance();

		this.allEventLogs = new DoublyLinkedList();
		this.dumpster = dumpsterFactory.createInstance();
		this.isDestroyed = false;

		this.dumpster.dump(this.eventLogAdded);

		this.dumpster.dump({}, () => this.allEventLogs.clear());
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

	public getEventLogs(): ReadonlyDoublyLinkedList<EventLog> {
		if (this.isDestroyed) {
			throw `Attempt to call a method on a destroyed instance of type ${getmetatable(this)}`;
		}

		return this.allEventLogs;
	}

	public recordEventLog(eventLog: EventLog) {
		if (this.isDestroyed) {
			throw `Attempt to call a method on a destroyed instance of type ${getmetatable(this)}`;
		}

		this.allEventLogs.pushToTail(eventLog);

		this.eventLogAdded.fire(eventLog);
	}
}
