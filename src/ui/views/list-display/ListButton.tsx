import Roact from "@rbxts/roact";
import { DeriveColorModifier } from "@rbxts/roact-studio-components";
import IStudioComponentState from "@rbxts/roact-studio-components/out/Interfaces/IStudioComponentState";
import { EventLog } from "types/EventLog";
import { Spritesheet } from "ui/data/Spritesheet";

type Props = {
	EventLog: EventLog;
	LayoutOrder: number;

	OnActivated: () => void;
};

export class ListButton extends Roact.Component<Readonly<Props>, IStudioComponentState> {
	public render() {
		const props = this.props;

		const theme = settings().Studio.Theme;

		const styleGuideModifier = DeriveColorModifier(
			{
				Active: true,
			},
			this.state,
		);

		const isBindableEvent = props.EventLog.FiringEnvironment.type === props.EventLog.ListeningEnvironment.type;
		const sprite = isBindableEvent ? Spritesheet.sprites.bindableEventIcon : Spritesheet.sprites.remoteEventIcon;

		return (
			<textbutton
				BackgroundColor3={theme.GetColor(Enum.StudioStyleGuideColor.MainButton, styleGuideModifier)}
				BackgroundTransparency={styleGuideModifier !== Enum.StudioStyleGuideModifier.Default ? 0 : 1}
				BorderSizePixel={0}
				LayoutOrder={props.LayoutOrder}
				Size={new UDim2(1, 0, 0, 24)}
				Text={""}
				Event={{
					Activated: props.OnActivated,
					MouseEnter: () => {
						this.setState({
							IsMouseOver: true,
						});
					},
					MouseLeave: () => {
						this.setState({
							IsMouseOver: false,
						});
					},
					MouseButton1Down: () => {
						this.setState({
							IsPressed: true,
						});
					},
					MouseButton1Up: () => {
						this.setState({
							IsPressed: false,
						});
					},
					SelectionGained: () => {
						this.setState({
							IsSelected: true,
						});
					},
					SelectionLost: () => {
						this.setState({
							IsSelected: false,
						});
					},
				}}
			>
				<imagelabel
					Key="IconImageLabel"
					Active={false}
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Image={Spritesheet.image}
					ImageRectOffset={sprite.offset}
					ImageRectSize={sprite.size}
					Position={new UDim2(0, 0, 0.5, 0)}
					Size={UDim2.fromOffset(16, 16)}
				/>
				<textlabel
					Key="EventInstanceNameLabel"
					Active={false}
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Font={Enum.Font.SourceSans}
					Position={new UDim2(0, 18, 0.5, 0)}
					Size={new UDim2(1, -36, 1, 0)}
					Text={props.EventLog.EventInstanceName}
					TextColor3={theme.GetColor(Enum.StudioStyleGuideColor.ButtonText, styleGuideModifier)}
					TextSize={16}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Center}
				/>
			</textbutton>
		);
	}
}
