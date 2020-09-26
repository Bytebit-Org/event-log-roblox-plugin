import { BooleanSettingsKeys, SettingsKeys } from "./SettingsKeys";

export type SettingValueTypes<T extends SettingsKeys> = T extends BooleanSettingsKeys ? boolean : never;
