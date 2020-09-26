import { SettingsKeys } from "./SettingsKeys";

export type LocalizedStringKey =
	| SettingsKeys
	| "PluginToolbarText"
	| "MainToolbarButtonText"
	| "MainToolbarButtonTooltip"
	| "BaseMainWindowTitle"
	| "AncestryLabel"
	| "SourceEnvironmentLabel"
	| "TargetEnvironmentLabel"
	| "ArgumentsSectionLabel"
	| "ArgumentTypeHeader"
	| "ArgumentValueHeader"
	| "PrintPrefix"
	| "ListeningToEventsWithRoots"
	| "ListeningToEventsInDataModel"
	| "SettingsMenuTitle";
