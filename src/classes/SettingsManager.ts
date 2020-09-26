import { SettingValueDefaults } from "data/SettingValueDefaults";
import { SettingValueTypeChecks } from "functions/type-checks/SettingValueTypeChecks";
import { SettingsKeys } from "types/SettingsKeys";
import { SettingValueTypes } from "types/SettingValueTypes";

export class SettingsManager {
	private constructor(private readonly pluginReference: Plugin) {}

	public static create(this: void, pluginReference: Plugin) {
		return new SettingsManager(pluginReference);
	}

	public getAllCurrentSettings() {
		const currentSettings: { [T in SettingsKeys]: SettingValueTypes<T> } = Object.deepCopy(SettingValueDefaults);

		for (const settingKey of Object.keys(currentSettings)) {
			currentSettings[settingKey] = this.getSettingValue(settingKey);
		}

		return currentSettings;
	}

	public getSettingValue<T extends SettingsKeys>(settingKey: T) {
		const storedSettingValue = this.pluginReference.GetSetting(settingKey);
		if (SettingValueTypeChecks[settingKey](storedSettingValue)) {
			return storedSettingValue;
		}

		return SettingValueDefaults[settingKey];
	}

	public setSettingValue<T extends SettingsKeys>(settingKey: T, settingValue: SettingValueTypes<T>) {
		this.pluginReference.SetSetting(settingKey, settingValue);
	}
}
