import { EventListener } from "classes/EventListener";
import { IEventLogStore } from "interfaces/IEventLogStore";

export class EventListenerFactory {
	public createInstance(eventLogStore: IEventLogStore, roots: ReadonlyArray<Instance>) {
		return EventListener.create(eventLogStore, roots);
	}
}
