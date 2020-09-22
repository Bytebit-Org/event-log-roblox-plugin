import { EventLogStore } from "classes/EventLogStore";

export class EventLogStoreFactory {
	public createInstance() {
		return EventLogStore.create();
	}
}
