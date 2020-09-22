import { LocalizedStringKeyDataMap } from "types/LocalizedStringKeyDataMap";
import { LocalizedStringKey } from "types/LocalizedStringKey";

export class LocalizedStringsManager {
	private readonly translator: Translator;

	private constructor(localizationTable: LocalizationTable, studioService: StudioService) {
		this.translator = localizationTable.GetTranslator(studioService.StudioLocaleId);
	}

	public static create(this: void) {
		const localizationTable = script.Parent?.Parent?.WaitForChild("data").WaitForChild("LocalizationTable");
		if (localizationTable === undefined || !localizationTable.IsA("LocalizationTable")) {
			throw `Could not find a valid localization table`;
		}

		return new LocalizedStringsManager(localizationTable, game.GetService("StudioService"));
	}

	public GetLocalizedString<T extends LocalizedStringKey>(key: T, data: LocalizedStringKeyDataMap<T>) {
		return this.translator.FormatByKey(key, data);
	}
}
