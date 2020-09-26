import Roact from "@rbxts/roact";
import { StudioScrollingFrame, StudioTextLabel, StudioToggle } from "@rbxts/roact-studio-components";
import { LocalizedStringsManager } from "classes/LocalizedStringsManager";
import { SettingsKeys } from "types/SettingsKeys";
import { SettingValueTypes } from "types/SettingValueTypes";

type Props = {
	CurrentSettings: { [T in SettingsKeys]: SettingValueTypes<T> };
	LocalizedStringsManager: LocalizedStringsManager;
	OnSettingValueChanged: <T extends SettingsKeys>(settingKey: T, settingValue: SettingValueTypes<T>) => void;
};

const settingKeyLabelWidthOffset = 200;
const settingKeyLabelPaddingOffset = 8;

export class SettingsMenu extends Roact.Component<Readonly<Props>> {
	private readonly canvasSizeBinding: Roact.RoactBinding<UDim2>;
	private readonly setCanvasSize: Roact.RoactBindingFunc<UDim2>;

	public constructor(props: Readonly<Props>) {
		super(props);

		const [canvasSizeBinding, setCanvasSize] = Roact.createBinding<UDim2>(UDim2.fromScale(1, 1));
		this.canvasSizeBinding = canvasSizeBinding;
		this.setCanvasSize = setCanvasSize;
	}

	public render() {
		const props = this.props;

		return (
			<StudioScrollingFrame CanvasSize={this.canvasSizeBinding} Size={UDim2.fromScale(1, 1)}>
				<uilistlayout
					Key="UIListLayout"
					FillDirection={Enum.FillDirection.Vertical}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					SortOrder={Enum.SortOrder.LayoutOrder}
					VerticalAlignment={Enum.VerticalAlignment.Top}
					Ref={(uiListLayout) => this.connectToScrollingFrameListLayoutReference(uiListLayout)}
				/>
				<frame
					Key="ShouldRunOnWindowOpen"
					BackgroundTransparency={1}
					BorderSizePixel={0}
					LayoutOrder={1}
					Size={new UDim2(new UDim(1, 0), StudioTextLabel.HeightUDim)}
				>
					<uisizeconstraint 
						Key="UISizeConstraint"
						MinSize={new Vector2(settingKeyLabelWidthOffset + 2*settingKeyLabelPaddingOffset + 40)}
					/>
					<StudioTextLabel
						Key="Label"
						Position={UDim2.fromOffset(settingKeyLabelPaddingOffset, 0)}
						Text={props.LocalizedStringsManager.GetLocalizedString("ShouldRunOnWindowOpen", {})}
						TextXAlignment={Enum.TextXAlignment.Left}
						Width={new UDim(0, settingKeyLabelWidthOffset)}
					/>
					<StudioToggle
						Key="Toggle"
						AnchorPoint={new Vector2(0, 0.5)}
						IsOnByDefault={props.CurrentSettings.ShouldRunOnWindowOpen}
						Position={new UDim2(0, settingKeyLabelWidthOffset + 2*settingKeyLabelPaddingOffset, 0.5, 0)}
						Events={{
							Toggled: () =>
								props.OnSettingValueChanged(
									"ShouldRunOnWindowOpen",
									!props.CurrentSettings.ShouldRunOnWindowOpen,
								),
						}}
					/>
				</frame>
			</StudioScrollingFrame>
		);
	}

	private connectToScrollingFrameListLayoutReference(uiListLayout: UIListLayout | undefined) {
		if (uiListLayout === undefined) {
			return;
		}

		uiListLayout.GetPropertyChangedSignal("AbsoluteContentSize").Connect(() => {
			this.setCanvasSize(
				UDim2.fromOffset(uiListLayout.AbsoluteContentSize.X, uiListLayout.AbsoluteContentSize.Y),
			);
		});
	}
}
