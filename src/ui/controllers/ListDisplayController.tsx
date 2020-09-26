import Roact from "@rbxts/roact";
import { EventListener } from "classes/EventListener";
import { LocalizedStringsManager } from "classes/LocalizedStringsManager";
import { SettingsManager } from "classes/SettingsManager";
import { SettingsWindowManager } from "classes/WindowManagers/SettingsWindowManager";
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
		private readonly selectionService: Selection,
		private readonly settingsManager: SettingsManager,
		private readonly settingsWindowManager: SettingsWindowManager,
		private readonly studioSettings: Studio,
	) {
		this.currentEventLogStore = eventLogStoreFactory.createInstance();

		this.listenForNewEventLogsInStore();
		this.listenForStudioThemeChanges();
	}

	public static create(
		this: void,
		localizedStringsManager: LocalizedStringsManager,
		settingsManager: SettingsManager,
		settingsWindowManager: SettingsWindowManager,
	) {
		return new ListDisplayController(
			new EventLogStoreFactory(),
			new EventListenerFactory(),
			localizedStringsManager,
			game.GetService("Selection"),
			settingsManager,
			settingsWindowManager,
			settings().Studio,
		);
	}

	public hide() {
		if (this.componentInstanceHandle === undefined) {
			return;
		}

		Roact.unmount(this.componentInstanceHandle);
		this.componentInstanceHandle = undefined;
	}

	public show(parent: Instance) {
		if (this.componentInstanceHandle !== undefined) {
			return;
		}

		if (this.settingsManager.getSettingValue("ShouldRunOnWindowOpen")) {
			this.startLoggingEvents();
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
				OnSettingsMenuButtonActivated={() => this.handleSettingsMenuButtonActivated()}
				OnStartLoggingButtonActivated={() => this.handleStartLoggingButtonActivated()}
				OnStopLoggingButtonActivated={() => this.handleStopLoggingButtonActivated()}
			/>
		);
	}

	private handleClearEventLogStoreButtonActivated() {
		this.currentEventLogStore.clear();

		this.updateIfShowing();
	}

	private handleSettingsMenuButtonActivated() {
		this.settingsWindowManager.open();
	}

	private handleStartLoggingButtonActivated() {
		this.startLoggingEvents();

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

		this.updateIfShowing();
	}

	private startLoggingEvents() {
		if (this.currentEventListener !== undefined) {
			throw `Already listening`;
		}

		let printString = this.localizedStringsManager.GetLocalizedString("ListeningToEventsWithRoots", {});
		let shouldPrintRoots = true;
		const roots = this.selectionService.Get();
		if (roots.isEmpty()) {
			roots.push(game);
			printString = this.localizedStringsManager.GetLocalizedString("ListeningToEventsInDataModel", {});
			shouldPrintRoots = false;
		}
		this.currentEventListener = this.eventListenerFactory.createInstance(this.currentEventLogStore, roots);

		const printPrefix = this.localizedStringsManager.GetLocalizedString("PrintPrefix", {});
		print(printPrefix, printString);
		if (shouldPrintRoots) {
			roots.forEach((root) => print(printPrefix, `\t${root.GetFullName()}`));
		}
	}

	private updateIfShowing() {
		if (this.componentInstanceHandle === undefined) {
			return;
		}

		this.componentInstanceHandle = Roact.update(this.componentInstanceHandle, this.createElement());
	}
}
