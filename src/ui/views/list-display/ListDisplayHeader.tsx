import Roact from "@rbxts/roact";
import { StudioFrame, StudioTextButton } from "@rbxts/roact-studio-components";

type Props = {
	Height: UDim;
	IsLoggingActive: boolean;

	OnClearEventLogStoreButtonActivated: () => void;
	OnSettingsMenuButtonActivated: () => void;
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
					Key="ToggleListeningButton"
					LayoutOrder={1}
					Text={props.IsLoggingActive ? `🟥` : `▶️`}
					Width={new UDim(0, StudioTextButton.HeightUDim.Offset)}
					Events={{
						MouseButton1Click: props.IsLoggingActive
							? props.OnStopLoggingButtonActivated
							: props.OnStartLoggingButtonActivated,
					}}
				></StudioTextButton>
				<StudioTextButton
					Key="SearchButton" // Maybe this should be a textbox on a separate line, instead?
					LayoutOrder={2}
					Text={`🔍`}
					Width={new UDim(0, StudioTextButton.HeightUDim.Offset)}
					Visible={false}
					Events={{
						MouseButton1Click: () => {},
					}}
				></StudioTextButton>
				<StudioTextButton
					Key="ClearListButton"
					LayoutOrder={3}
					Text={`❌`}
					Width={new UDim(0, StudioTextButton.HeightUDim.Offset)}
					Events={{
						MouseButton1Click: props.OnClearEventLogStoreButtonActivated,
					}}
				></StudioTextButton>
				<StudioTextButton
					Key="SettingsMenuButton"
					LayoutOrder={4}
					Text={`⚙️`}
					Width={new UDim(0, StudioTextButton.HeightUDim.Offset)}
					Events={{
						MouseButton1Click: props.OnSettingsMenuButtonActivated,
					}}
				></StudioTextButton>
				<StudioTextButton
					Key="PluginInfoButton" // TODO: Display a pop-up with info about the plugin, such as how to contribute
					LayoutOrder={5}
					Text={`ℹ️`}
					Width={new UDim(0, StudioTextButton.HeightUDim.Offset)}
					Visible={false}
					Events={{
						MouseButton1Click: () => {},
					}}
				></StudioTextButton>
			</frame>
		);
	}
}
