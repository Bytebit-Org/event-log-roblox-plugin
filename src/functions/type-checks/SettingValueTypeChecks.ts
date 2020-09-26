import t from "@rbxts/t";
import { SettingsKeys } from "types/SettingsKeys";
import { SettingValueTypes } from "types/SettingValueTypes";

export const SettingValueTypeChecks: { [T in SettingsKeys]: t.check<SettingValueTypes<T>> } = {
	ShouldRunOnWindowOpen: t.boolean,
};
