import { LocalizedStringsManager } from "classes/LocalizedStringsManager";
import { SettingsManager } from "classes/SettingsManager";
import { SettingsMenuController } from "ui/controllers/SettingsMenuController";

export class SettingsWindowManager {
	private readonly dockWidgetPluginGui: DockWidgetPluginGui;

	private constructor(
		private readonly localizedStringsManager: LocalizedStringsManager,
		pluginReference: Plugin,
		private readonly settingsMenuController: SettingsMenuController,
	) {
		this.dockWidgetPluginGui = pluginReference.CreateDockWidgetPluginGui(
			"EventLog_SettingsWindow",
			new DockWidgetPluginGuiInfo(
				Enum.InitialDockState.Float, // initDockState
				false, // initEnabled
				true, // overrideEnabledRestore
				250, // floatXSize
				24, // floatYSize
				250, // minWidth
				24, // minHeight
			),
		);

		this.dockWidgetPluginGui.Name = "EventLog_SettingsWindow";
		this.dockWidgetPluginGui.Title = this.localizedStringsManager.GetLocalizedString("SettingsMenuTitle", {});

		this.listenForWindowToBeClosed();
	}

	public static create(
		this: void,
		localizedStringsManager: LocalizedStringsManager,
		pluginReference: Plugin,
		settingsManager: SettingsManager,
	) {
		return new SettingsWindowManager(
			localizedStringsManager,
			pluginReference,
			SettingsMenuController.create(localizedStringsManager, settingsManager),
		);
	}

	public open() {
		this.settingsMenuController.show(this.dockWidgetPluginGui);
		this.dockWidgetPluginGui.Enabled = true;
	}

	private listenForWindowToBeClosed() {
		this.dockWidgetPluginGui.GetPropertyChangedSignal("Enabled").Connect(() => {
			if (!this.dockWidgetPluginGui.Enabled) {
				this.settingsMenuController.hide();
			}
		});
	}
}
