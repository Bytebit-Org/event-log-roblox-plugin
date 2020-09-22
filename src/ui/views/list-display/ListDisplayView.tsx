import Roact from "@rbxts/roact";
import { LocalizedStringsManager } from "classes/LocalizedStringsManager";
import { EventLog } from "types/EventLog";

type Props = {
	EventLogs: ReadonlyArray<EventLog>;
	LocalizedStringsManager: LocalizedStringsManager;
};

export class ListDisplayView extends Roact.Component<Readonly<Props>> {
	public render() {
		return <frame />;
	}
}
