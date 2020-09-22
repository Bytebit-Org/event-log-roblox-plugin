import Roact from "@rbxts/roact";
import { StudioFrame, StudioScrollingFrame } from "@rbxts/roact-studio-components";
import { LocalizedStringsManager } from "classes/LocalizedStringsManager";
import { EventLog } from "types/EventLog";
import { ListButton } from "./ListButton";
import { ListDisplayHeader } from "./ListDisplayHeader";

type Props = {
	EventLogs: ReadonlyArray<EventLog>;
	IsLoggingActive: boolean;
	LocalizedStringsManager: LocalizedStringsManager;

	OnStartLoggingButtonActivated: () => void;
	OnStopLoggingButtonActivated: () => void;
};

export class ListDisplayView extends Roact.Component<Readonly<Props>> {
	public render() {
		const props = this.props;

		return (
			<StudioFrame Size={UDim2.fromScale(1, 1)}>
				<ListDisplayHeader
					Key="ListDisplayHeader"
					Height={new UDim(0, 24)}
					IsLoggingActive={props.IsLoggingActive}
					OnStartLoggingButtonActivated={props.OnStartLoggingButtonActivated}
					OnStopLoggingButtonActivated={props.OnStopLoggingButtonActivated}
				/>
				<StudioScrollingFrame
					Key="ListScrollingFrame"
					CanvasSize={new UDim2(1, 0, 0, 24 * props.EventLogs.size())}
					Position={new UDim2(0, 0, 0, 24)}
					Size={new UDim2(1, 0, 1, -24)}
				>
					<uilistlayout
						Key="UIListLayout"
						FillDirection={Enum.FillDirection.Vertical}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						SortOrder={Enum.SortOrder.LayoutOrder}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					/>
					{props.EventLogs.map((eventLog, index) => (
						<ListButton
							EventLog={eventLog}
							LayoutOrder={props.EventLogs.size() - index}
							OnActivated={() => {}}
						/>
					))}
				</StudioScrollingFrame>
			</StudioFrame>
		);
	}
}
