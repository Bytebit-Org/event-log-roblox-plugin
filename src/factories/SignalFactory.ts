import { AnyArgs, ISignal, Signal } from "@rbxts/signals-tooling";

export class SignalFactory {
	public createInstance<T extends AnyArgs>(): ISignal<T> {
		return new Signal<T>();
	}
}
