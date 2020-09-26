import Roact from "@rbxts/roact";
import { LocalizedStringsManager } from "classes/LocalizedStringsManager";
import { SettingsManager } from "classes/SettingsManager";
import { SettingsMenu } from "ui/views/settings-menu/SettingsMenu";

export class SettingsMenuController {
	private componentInstanceHandle?: Roact.ComponentInstanceHandle;

	private constructor(
		private readonly localizedStringsManager: LocalizedStringsManager,
		private readonly settingsManager: SettingsManager,
		private readonly studioSettings: Studio,
	) {
		this.listenForStudioThemeChanges();
	}

	public static create(
		this: void,
		localizedStringsManager: LocalizedStringsManager,
		settingsManager: SettingsManager,
	) {
		return new SettingsMenuController(localizedStringsManager, settingsManager, settings().Studio);
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

		this.componentInstanceHandle = Roact.mount(this.createElement(), parent);
	}

	private createElement() {
		return (
			<SettingsMenu
				CurrentSettings={this.settingsManager.getAllCurrentSettings()}
				LocalizedStringsManager={this.localizedStringsManager}
				OnSettingValueChanged={(settingKey, settingValue) => {
					this.settingsManager.setSettingValue(settingKey, settingValue);
					this.updateIfShowing();
				}}
			/>
		);
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
