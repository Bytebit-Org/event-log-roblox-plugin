import { RunService } from "@rbxts/services";
import { LocalizedStringsManager } from "./LocalizedStringsManager";

export class MainWindowManager {
	private readonly containerFrame: Frame;
	private readonly dockWidgetPluginGui: DockWidgetPluginGui;
	private readonly pluginToolbarButton: PluginToolbarButton;

	private constructor(
		private readonly localizedStringsManager: LocalizedStringsManager,
		pluginReference: Plugin,
		pluginToolbar: PluginToolbar,
		private readonly runService: RunService,
	) {
		this.containerFrame = new Instance("Frame");
		this.dockWidgetPluginGui = pluginReference.CreateDockWidgetPluginGui(
			"EventLog_MainWindow",
			new DockWidgetPluginGuiInfo(
				Enum.InitialDockState.Left, // initDockState
				false, // initEnabled
				false, // overrideEnabledRestore
				128, // floatXSize
				256, // floatYSize
				128, // minWidth
				256, // minHeight
			),
		);
		this.pluginToolbarButton = pluginToolbar.CreateButton(
			this.localizedStringsManager.GetLocalizedString("MainToolbarButtonText", {}),
			"",
			"",
		);

		this.containerFrame.Parent = this.dockWidgetPluginGui;

		this.dockWidgetPluginGui.Title = this.localizedStringsManager.GetLocalizedString("BaseMainWindowTitle", {});

		this.pluginToolbarButton.Enabled = this.runService.IsRunning();

		this.handleActiveStateOfPluginToolbarButton();
		this.listenToPluginToolbarButtonClicks();
	}

	public static create(
		this: void,
		localizedStringsManager: LocalizedStringsManager,
		pluginReference: Plugin,
		pluginToolbar: PluginToolbar,
	) {
		return new MainWindowManager(localizedStringsManager, pluginReference, pluginToolbar, RunService);
	}

	private handleActiveStateOfPluginToolbarButton() {
		this.pluginToolbarButton.SetActive(this.dockWidgetPluginGui.Enabled);

		this.dockWidgetPluginGui
			.GetPropertyChangedSignal("Enabled")
			.Connect(() => this.pluginToolbarButton.SetActive(this.dockWidgetPluginGui.Enabled));
	}

	private listenToPluginToolbarButtonClicks() {
		if (!this.runService.IsRunning()) {
			return;
		}

		this.pluginToolbarButton.Click.Connect(() => {
			this.dockWidgetPluginGui.Enabled = true;
		});
	}
}
