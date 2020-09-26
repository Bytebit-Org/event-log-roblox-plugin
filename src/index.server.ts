import { set } from "@rbxts/t";
import { LocalizedStringsManager } from "classes/LocalizedStringsManager";
import { SettingsManager } from "classes/SettingsManager";
import { MainWindowManager } from "classes/WindowManagers/MainWindowManager";
import { SettingsWindowManager } from "classes/WindowManagers/SettingsWindowManager";
/// <reference types="@rbxts/types/plugin" />

export {};

const localizedStringsManager = LocalizedStringsManager.create();
const settingsManager = SettingsManager.create(plugin);

const pluginToolbar = plugin.CreateToolbar(localizedStringsManager.GetLocalizedString("PluginToolbarText", {}));

const settingsWindowManager = SettingsWindowManager.create(localizedStringsManager, plugin, settingsManager);

MainWindowManager.create(localizedStringsManager, plugin, pluginToolbar, settingsManager, settingsWindowManager);
