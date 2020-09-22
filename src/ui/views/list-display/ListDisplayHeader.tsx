import Roact from "@rbxts/roact";
import { StudioFrame, StudioTextButton } from "@rbxts/roact-studio-components";

type Props = {
	Height: UDim;
	IsLoggingActive: boolean;

	OnStartLoggingButtonActivated: () => void;
	OnStopLoggingButtonActivated: () => void;
};

export class ListDisplayHeader extends Roact.Component<Readonly<Props>> {
	public render() {
		const props = this.props;

		return (
			<frame BackgroundTransparency={1} BorderSizePixel={0} Size={new UDim2(new UDim(1, 0), props.Height)}>
				<uilistlayout
					Key="UIListLayout"
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					SortOrder={Enum.SortOrder.LayoutOrder}
					VerticalAlignment={Enum.VerticalAlignment.Center}
				/>
				<StudioTextButton
					Key="StartButton"
					LayoutOrder={1}
					Text={props.IsLoggingActive ? `🟥` : `▶️`}
					Width={new UDim(0, StudioTextButton.HeightUDim.Offset)}
					Events={{
						MouseButton1Click: props.IsLoggingActive
							? props.OnStopLoggingButtonActivated
							: props.OnStartLoggingButtonActivated,
					}}
				></StudioTextButton>
			</frame>
		);
	}
}
