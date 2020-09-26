import { SettingsKeys } from "types/SettingsKeys";
import { SettingValueTypes } from "types/SettingValueTypes";

export const SettingValueDefaults: { [T in SettingsKeys]: SettingValueTypes<T> } = {
	ShouldRunOnWindowOpen: false,
};
