import Roact from "@rbxts/roact";
import { EventListener } from "classes/EventListener";
import { LocalizedStringsManager } from "classes/LocalizedStringsManager";
import { EventListenerFactory } from "factories/EventListenerFactory";
import { EventLogStoreFactory } from "factories/EventLogStoreFactory";
import { IEventLogStore } from "interfaces/IEventLogStore";
import { ListDisplayView } from "ui/views/list-display/ListDisplayView";

export class ListDisplayController {
	private componentInstanceHandle?: Roact.ComponentInstanceHandle;
	private currentEventListener?: EventListener;
	private currentEventLogStore: IEventLogStore;
	private eventLogAddedConnection?: RBXScriptConnection;

	private constructor(
		eventLogStoreFactory: EventLogStoreFactory,
		private readonly eventListenerFactory: EventListenerFactory,
		private readonly localizedStringsManager: LocalizedStringsManager,
		private readonly studioSettings: Studio,
	) {
		this.currentEventLogStore = eventLogStoreFactory.createInstance();

		this.listenForNewEventLogsInStore();
		this.listenForStudioThemeChanges();
	}

	public static create(this: void, localizedStringsManager: LocalizedStringsManager) {
		return new ListDisplayController(
			new EventLogStoreFactory(),
			new EventListenerFactory(),
			localizedStringsManager,
			settings().Studio,
		);
	}

	public show(parent: Instance) {
		if (this.componentInstanceHandle !== undefined) {
			throw `Already showing list display`;
		}

		this.componentInstanceHandle = Roact.mount(this.createElement(), parent);
	}

	private createElement() {
		return (
			<ListDisplayView
				EventLogs={this.currentEventLogStore.getEventLogs()}
				IsLoggingActive={this.currentEventListener !== undefined}
				LocalizedStringsManager={this.localizedStringsManager}
				OnClearEventLogStoreButtonActivated={() => this.handleClearEventLogStoreButtonActivated()}
				OnStartLoggingButtonActivated={() => this.handleStartLoggingButtonActivated()}
				OnStopLoggingButtonActivated={() => this.handleStopLoggingButtonActivated()}
			/>
		);
	}

	private handleClearEventLogStoreButtonActivated() {
		this.currentEventLogStore.clear();

		this.updateIfShowing();
	}

	private handleStartLoggingButtonActivated() {
		if (this.currentEventListener !== undefined) {
			throw `Already listening`;
		}

		this.currentEventListener = this.eventListenerFactory.createInstance(this.currentEventLogStore, [game]);

		this.updateIfShowing();
	}

	private handleStopLoggingButtonActivated() {
		this.currentEventListener?.destroy();
		this.currentEventListener = undefined;

		this.updateIfShowing();
	}

	private listenForNewEventLogsInStore() {
		this.eventLogAddedConnection?.Disconnect();

		this.eventLogAddedConnection = this.currentEventLogStore.eventLogAdded.Connect(() => this.updateIfShowing());
	}

	private listenForStudioThemeChanges() {
		this.studioSettings.ThemeChanged.Connect(() => this.updateIfShowing());
	}

	private updateIfShowing() {
		if (this.componentInstanceHandle === undefined) {
			return;
		}

		this.componentInstanceHandle = Roact.update(this.componentInstanceHandle, this.createElement());
	}
}
