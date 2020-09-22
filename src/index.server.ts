import { LocalizedStringsManager } from "classes/LocalizedStringsManager";
/// <reference types="@rbxts/types/plugin" />

import { MainWindowManager } from "classes/MainWindowManager";

export {};

const localizedStringsManager = LocalizedStringsManager.create();

const toolbar = plugin.CreateToolbar(localizedStringsManager.GetLocalizedString("PluginToolbarText", {}));

MainWindowManager.create(localizedStringsManager, plugin, toolbar);
