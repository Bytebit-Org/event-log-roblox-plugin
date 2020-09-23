import Roact from "@rbxts/roact";
import { StudioFrame, StudioScrollingFrame } from "@rbxts/roact-studio-components";
import { LocalizedStringsManager } from "classes/LocalizedStringsManager";
import { EventLog } from "types/EventLog";
import { ListDisplayHeader } from "./ListDisplayHeader";
import { ListItem } from "./ListItem";

type Props = {
	EventLogs: ReadonlyArray<EventLog>;
	IsLoggingActive: boolean;
	LocalizedStringsManager: LocalizedStringsManager;

	OnStartLoggingButtonActivated: () => void;
	OnStopLoggingButtonActivated: () => void;
};

export class ListDisplayView extends Roact.Component<Readonly<Props>> {
	private readonly canvasHeightBinding: Roact.RoactBinding<UDim>;
	private readonly setCanvasHeight: Roact.RoactBindingFunc<UDim>;

	public constructor(props: Readonly<Props>) {
		super(props);

		const [canvasHeightBinding, setCanvasHeight] = Roact.createBinding<UDim>(
			new UDim(0, props.EventLogs.size() * 24),
		);
		this.canvasHeightBinding = canvasHeightBinding;
		this.setCanvasHeight = setCanvasHeight;
	}

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
					CanvasSize={this.canvasHeightBinding.map((canvasHeight) => new UDim2(new UDim(1, 0), canvasHeight))}
					Position={new UDim2(0, 0, 0, 24)}
					Size={new UDim2(1, 0, 1, -24)}
				>
					<uilistlayout
						Key="UIListLayout"
						FillDirection={Enum.FillDirection.Vertical}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						SortOrder={Enum.SortOrder.LayoutOrder}
						VerticalAlignment={Enum.VerticalAlignment.Top}
						Ref={(uiListLayout) => this.connectToScrollingFrameListLayoutReference(uiListLayout)}
					/>
					{props.EventLogs.map((eventLog, index) => (
						<ListItem
							EventLog={eventLog}
							LayoutOrder={props.EventLogs.size() - index}
							LocalizedStringsManager={props.LocalizedStringsManager}
						/>
					))}
				</StudioScrollingFrame>
			</StudioFrame>
		);
	}

	private connectToScrollingFrameListLayoutReference(uiListLayout: UIListLayout | undefined) {
		if (uiListLayout === undefined) {
			return;
		}

		uiListLayout.GetPropertyChangedSignal("AbsoluteContentSize").Connect(() => {
			this.setCanvasHeight(new UDim(0, uiListLayout.AbsoluteContentSize.Y));
		});
	}
}
