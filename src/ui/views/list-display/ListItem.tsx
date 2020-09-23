import inspect from "@rbxts/inspect";
import Roact from "@rbxts/roact";
import { TextService } from "@rbxts/services";
import { LocalizedStringsManager } from "classes/LocalizedStringsManager";
import { EventEnvironmentType } from "enums/EventEnvironmentType";
import { EventLog } from "types/EventLog";
import { ListItemExpansionToggleButton } from "./ListItemExpansionToggleButton";

type Props = {
	EventLog: EventLog;
	LayoutOrder: number;
	LocalizedStringsManager: LocalizedStringsManager;
};

type State = {
	isExpanded: boolean;
};

const displayRowLabelWidth = 64;
const displayRowTextSize = 14;

const argumentTypeLabelWidth = 48;
const argumentRowTextSize = 14;

export class ListItem extends Roact.Component<Readonly<Props>, Readonly<State>> {
	private readonly contentHeightBinding: Roact.RoactBinding<UDim>;
	private readonly setContentHeight: Roact.RoactBindingFunc<UDim>;

	private readonly frameAbsoluteWidthBinding: Roact.RoactBinding<number>;
	private readonly setFrameAbsoluteWidth: Roact.RoactBindingFunc<number>;

	public constructor(props: Readonly<Props>) {
		super(props);

		const [contentHeightBinding, setContentHeight] = Roact.createBinding<UDim>(new UDim(0, 24));
		this.contentHeightBinding = contentHeightBinding;
		this.setContentHeight = setContentHeight;

		const [frameAbsoluteWidthBinding, setFrameAbsoluteWidth] = Roact.createBinding<number>(184);
		this.frameAbsoluteWidthBinding = frameAbsoluteWidthBinding;
		this.setFrameAbsoluteWidth = setFrameAbsoluteWidth;
	}

	public render() {
		const props = this.props;
		const state = this.state;

		const theme = settings().Studio.Theme;

		const ancestryString = props.EventLog.EventInstanceAncestorNames.reduce((accumulator, name) =>
			accumulator.size() === 0 ? name : `${accumulator}.${name}`,
		);
		const getAncestryLabelHeight = (frameAbsoluteWidth: number) => {
			const textSize = TextService.GetTextSize(
				ancestryString,
				displayRowTextSize,
				Enum.Font.SourceSans,
				new Vector2(frameAbsoluteWidth - (displayRowLabelWidth + 12), math.huge),
			);
			return new UDim(0, textSize.Y);
		};

		const sourceEnvString =
			props.EventLog.SourceEnvironment.type === EventEnvironmentType.Server
				? "Server"
				: props.EventLog.SourceEnvironment.player.Name;

		const targetEnvString =
			props.EventLog.TargetEnvironment.type === EventEnvironmentType.Server
				? "Server"
				: props.EventLog.TargetEnvironment.player.Name;

		const getArgumentValueLabelHeight = (frameAbsoluteWidth: number, text: string) => {
			const textSize = TextService.GetTextSize(
				text,
				argumentRowTextSize,
				Enum.Font.SourceSans,
				new Vector2(frameAbsoluteWidth - (argumentTypeLabelWidth + 12), math.huge),
			);
			return new UDim(0, textSize.Y);
		};
		const argumentRows = new Array<Roact.Element>();
		for (let i = 0; i < props.EventLog.Arguments.size(); i++) {
			const argument = props.EventLog.Arguments[i];
			const argumentText = inspect(argument);

			argumentRows.push(
				<frame
					Key={`ArgumentDisplayRow_${i}`}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					LayoutOrder={8 + i}
					Size={this.frameAbsoluteWidthBinding.map((frameAbsoluteWidth) => {
						return new UDim2(new UDim(1, 0), getArgumentValueLabelHeight(frameAbsoluteWidth, argumentText));
					})}
				>
					<textlabel
						Key="TypeLabel"
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Font={Enum.Font.SourceSansItalic}
						Position={UDim2.fromOffset(4, 0)}
						Size={UDim2.fromOffset(argumentTypeLabelWidth, argumentRowTextSize)}
						Text={typeOf(argument)}
						TextColor3={theme.GetColor(Enum.StudioStyleGuideColor.MainText)}
						TextSize={argumentRowTextSize}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Center}
					/>
					<textlabel
						Key="ValueLabel"
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Font={Enum.Font.SourceSans}
						Position={UDim2.fromOffset(argumentTypeLabelWidth + 8, 0)}
						Size={this.frameAbsoluteWidthBinding.map((frameAbsoluteWidth) => {
							return new UDim2(
								new UDim(1, -(argumentTypeLabelWidth + 12)),
								getArgumentValueLabelHeight(frameAbsoluteWidth, argumentText),
							);
						})}
						Text={argumentText}
						TextColor3={theme.GetColor(Enum.StudioStyleGuideColor.MainText)}
						TextSize={argumentRowTextSize}
						TextWrapped={true}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Center}
					/>
				</frame>,
			);
		}

		return (
			<frame
				BackgroundTransparency={1}
				BorderSizePixel={0}
				ClipsDescendants={true}
				LayoutOrder={props.LayoutOrder}
				Size={this.contentHeightBinding.map(
					(contentHeight) => new UDim2(new UDim(1, 0), state.isExpanded ? contentHeight : new UDim(0, 24)),
				)}
				Ref={(frame) => this.connectToFrameReference(frame)}
			>
				<uilistlayout
					Key="UIListLayout"
					FillDirection={Enum.FillDirection.Vertical}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					Padding={new UDim(0, 2)}
					SortOrder={Enum.SortOrder.LayoutOrder}
					VerticalAlignment={Enum.VerticalAlignment.Top}
					Ref={(uiListLayout) => this.connectToUIListLayoutReference(uiListLayout)}
				/>
				<ListItemExpansionToggleButton
					Key="ExpansionToggleButton"
					EventLog={props.EventLog}
					LayoutOrder={1}
					OnActivated={() =>
						this.setState((prevState) => ({
							isExpanded: !prevState.isExpanded,
						}))
					}
				/>
				<frame
					Key="AncestryDisplayRow"
					BackgroundTransparency={1}
					BorderSizePixel={0}
					LayoutOrder={2}
					Size={this.frameAbsoluteWidthBinding.map((frameAbsoluteWidth) => {
						return new UDim2(new UDim(1, 0), getAncestryLabelHeight(frameAbsoluteWidth));
					})}
				>
					<textlabel
						Key="Label"
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Font={Enum.Font.SourceSansSemibold}
						Position={UDim2.fromOffset(4, 0)}
						Size={UDim2.fromOffset(displayRowLabelWidth, displayRowTextSize)}
						Text={props.LocalizedStringsManager.GetLocalizedString("AncestryLabel", {})}
						TextColor3={theme.GetColor(Enum.StudioStyleGuideColor.MainText)}
						TextSize={displayRowTextSize}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Center}
					/>
					<textlabel
						Key="Display"
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Font={Enum.Font.SourceSans}
						Position={UDim2.fromOffset(displayRowLabelWidth + 8, 0)}
						Size={this.frameAbsoluteWidthBinding.map((frameAbsoluteWidth) => {
							return new UDim2(
								new UDim(1, -(displayRowLabelWidth + 12)),
								getAncestryLabelHeight(frameAbsoluteWidth),
							);
						})}
						Text={ancestryString}
						TextColor3={theme.GetColor(Enum.StudioStyleGuideColor.MainText)}
						TextSize={displayRowTextSize}
						TextWrapped={true}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Center}
					/>
				</frame>

				<frame
					Key="SourceEnvironmentDisplayRow"
					BackgroundTransparency={1}
					BorderSizePixel={0}
					LayoutOrder={3}
					Size={new UDim2(1, 0, 0, displayRowTextSize)}
				>
					<textlabel
						Key="Label"
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Font={Enum.Font.SourceSansSemibold}
						Position={UDim2.fromOffset(4, 0)}
						Size={UDim2.fromOffset(displayRowLabelWidth, displayRowTextSize)}
						Text={props.LocalizedStringsManager.GetLocalizedString("SourceEnvironmentLabel", {})}
						TextColor3={theme.GetColor(Enum.StudioStyleGuideColor.MainText)}
						TextSize={displayRowTextSize}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Center}
					/>
					<textlabel
						Key="Display"
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Font={Enum.Font.SourceSans}
						Position={UDim2.fromOffset(displayRowLabelWidth + 8, 0)}
						Size={new UDim2(1, -(displayRowLabelWidth + 12), 1, 0)}
						Text={sourceEnvString}
						TextColor3={theme.GetColor(Enum.StudioStyleGuideColor.MainText)}
						TextSize={displayRowTextSize}
						TextWrapped={true}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Center}
					/>
				</frame>

				<frame
					Key="TargetEnvironmentDisplayRow"
					BackgroundTransparency={1}
					BorderSizePixel={0}
					LayoutOrder={4}
					Size={new UDim2(1, 0, 0, displayRowTextSize)}
				>
					<textlabel
						Key="Label"
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Font={Enum.Font.SourceSansSemibold}
						Position={UDim2.fromOffset(4, 0)}
						Size={UDim2.fromOffset(displayRowLabelWidth, displayRowTextSize)}
						Text={props.LocalizedStringsManager.GetLocalizedString("TargetEnvironmentLabel", {})}
						TextColor3={theme.GetColor(Enum.StudioStyleGuideColor.MainText)}
						TextSize={displayRowTextSize}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Center}
					/>
					<textlabel
						Key="Display"
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Font={Enum.Font.SourceSans}
						Position={UDim2.fromOffset(displayRowLabelWidth + 8, 0)}
						Size={new UDim2(1, -(displayRowLabelWidth + 12), 1, 0)}
						Text={targetEnvString}
						TextColor3={theme.GetColor(Enum.StudioStyleGuideColor.MainText)}
						TextSize={displayRowTextSize}
						TextWrapped={true}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Center}
					/>
				</frame>
				<textlabel
					Key="ArgumentsSectionLabel"
					BackgroundTransparency={1}
					BorderSizePixel={4}
					Font={Enum.Font.SourceSansBold}
					LayoutOrder={5}
					Size={new UDim2(1, -8, 0, 16)}
					Text={props.LocalizedStringsManager.GetLocalizedString("ArgumentsSectionLabel", {})}
					TextColor3={theme.GetColor(Enum.StudioStyleGuideColor.MainText)}
					TextSize={16}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Center}
				/>

				<frame
					Key="ArgumentsHeader"
					BackgroundTransparency={1}
					BorderSizePixel={0}
					LayoutOrder={7}
					Size={new UDim2(1, 0, 0, argumentRowTextSize)}
				>
					<textlabel
						Key="TypeHeader"
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Font={Enum.Font.SourceSansSemibold}
						Position={UDim2.fromOffset(4, 0)}
						Size={UDim2.fromOffset(argumentTypeLabelWidth, argumentRowTextSize)}
						Text={props.LocalizedStringsManager.GetLocalizedString("ArgumentTypeHeader", {})}
						TextColor3={theme.GetColor(Enum.StudioStyleGuideColor.MainText)}
						TextSize={argumentRowTextSize}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Center}
					/>
					<textlabel
						Key="ValueHeader"
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Font={Enum.Font.SourceSansSemibold}
						Position={UDim2.fromOffset(argumentTypeLabelWidth + 8, 0)}
						Size={new UDim2(1, -(argumentTypeLabelWidth + 12), 0, argumentRowTextSize)}
						Text={props.LocalizedStringsManager.GetLocalizedString("ArgumentValueHeader", {})}
						TextColor3={theme.GetColor(Enum.StudioStyleGuideColor.MainText)}
						TextSize={argumentRowTextSize}
						TextWrapped={true}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Center}
					/>
				</frame>
				{argumentRows}
			</frame>
		);
	}

	private connectToFrameReference(frame: Frame | undefined) {
		if (frame === undefined) {
			return;
		}

		frame.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
			this.setFrameAbsoluteWidth(frame.AbsoluteSize.X);
		});
	}

	private connectToUIListLayoutReference(uiListLayout: UIListLayout | undefined) {
		if (uiListLayout === undefined) {
			return;
		}

		uiListLayout.GetPropertyChangedSignal("AbsoluteContentSize").Connect(() => {
			this.setContentHeight(new UDim(0, uiListLayout.AbsoluteContentSize.Y));
		});
	}
}
