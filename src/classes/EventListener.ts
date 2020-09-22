import { DoublyLinkedList } from "@rbxts/basic-utilities";
import { Dumpster, IDestroyable } from "@rbxts/dumpster";
import { Players, RunService } from "@rbxts/services";
import { EventEnvironmentType } from "enums/EventEnvironmentType";
import { DumpsterFactory } from "factories/DumpsterFactory";
import { IEventLogStore } from "interfaces/IEventLogStore";
import { EventEnvironment } from "types/EventEnvironment";

function getAncestorNames(instance: Instance) {
	const ancestorNamesStack = new DoublyLinkedList<string>();

	let currentInstance = instance.Parent;
	while (currentInstance !== undefined) {
		ancestorNamesStack.pushToHead(currentInstance.Name);
		currentInstance = currentInstance.Parent;
	}

	const ancestorNamesArray = new Array<string>();
	let instanceName = ancestorNamesStack.popHeadValue();
	while (instanceName !== undefined) {
		ancestorNamesArray.push(instanceName);
		instanceName = ancestorNamesStack.popHeadValue();
	}

	return ancestorNamesArray;
}

function safeIsA<T extends keyof Instances>(instance: Instance, className: T): instance is Instances[T] {
	try {
		return instance.IsA(className);
	} catch {
		return false;
	}
}

export class EventListener implements IDestroyable {
	private readonly dumpster: Dumpster;

	private constructor(
		dumpsterFactory: DumpsterFactory,
		private readonly eventLogStore: IEventLogStore,
		private readonly playersService: Players,
		roots: ReadonlyArray<Instance>,
		private readonly runService: RunService,
	) {
		this.dumpster = dumpsterFactory.createInstance();

		for (const root of roots) {
			if (root !== game) {
				if (safeIsA(root, "BindableEvent")) {
					this.listenToBindableEvent(root);
				} else if (safeIsA(root, "RemoteEvent")) {
					this.listenToRemoteEvent(root);
				}
			}

			this.dumpster.dump(
				root.DescendantAdded.Connect((descendant) => {
					if (safeIsA(descendant, "BindableEvent")) {
						this.listenToBindableEvent(descendant);
					} else if (safeIsA(descendant, "RemoteEvent")) {
						this.listenToRemoteEvent(descendant);
					}
				}),
			);

			const descendants = root.GetDescendants();
			for (const descendant of descendants) {
				if (safeIsA(descendant, "BindableEvent")) {
					this.listenToBindableEvent(descendant);
				} else if (safeIsA(descendant, "RemoteEvent")) {
					this.listenToRemoteEvent(descendant);
				}
			}
		}
	}

	public static create(this: void, eventLogStore: IEventLogStore, roots: ReadonlyArray<Instance>) {
		return new EventListener(new DumpsterFactory(), eventLogStore, Players, roots, RunService);
	}

	public destroy() {
		this.dumpster.burn();
	}

	private listenToBindableEvent(bindableEvent: BindableEvent) {
		let eventEnvironment!: EventEnvironment;

		if (this.runService.IsServer()) {
			eventEnvironment = {
				type: EventEnvironmentType.Server,
			};
		} else {
			const localPlayer = this.playersService.LocalPlayer;
			eventEnvironment = {
				type: EventEnvironmentType.Client,
				player: localPlayer,
			};
		}

		let ancestorNames = getAncestorNames(bindableEvent);
		this.dumpster.dump(
			bindableEvent.AncestryChanged.Connect(() => (ancestorNames = getAncestorNames(bindableEvent))),
		);

		this.dumpster.dump(
			bindableEvent.Event.Connect((...args: ReadonlyArray<unknown>) => {
				this.eventLogStore.recordEventLog({
					Arguments: args,
					EventInstanceAncestorNames: ancestorNames,
					EventInstanceName: bindableEvent.Name,
					FiringEnvironment: eventEnvironment,
					ListeningEnvironment: eventEnvironment,
					UnixTimestamp: DateTime.now().UnixTimestamp,
				});
			}),
		);
	}

	private listenToRemoteEvent(remoteEvent: RemoteEvent) {
		let ancestorNames = getAncestorNames(remoteEvent);
		this.dumpster.dump(remoteEvent.AncestryChanged.Connect(() => (ancestorNames = getAncestorNames(remoteEvent))));

		if (this.runService.IsClient()) {
			const localPlayer = this.playersService.LocalPlayer;

			this.dumpster.dump(
				remoteEvent.OnClientEvent.Connect((...args: ReadonlyArray<unknown>) => {
					this.eventLogStore.recordEventLog({
						Arguments: args,
						EventInstanceAncestorNames: ancestorNames,
						EventInstanceName: remoteEvent.Name,
						FiringEnvironment: {
							type: EventEnvironmentType.Server,
						},
						ListeningEnvironment: {
							type: EventEnvironmentType.Client,
							player: localPlayer,
						},
						UnixTimestamp: DateTime.now().UnixTimestamp,
					});
				}),
			);
		}

		if (this.runService.IsServer()) {
			this.dumpster.dump(
				remoteEvent.OnServerEvent.Connect((player, ...args: ReadonlyArray<unknown>) => {
					this.eventLogStore.recordEventLog({
						Arguments: args,
						EventInstanceAncestorNames: ancestorNames,
						EventInstanceName: remoteEvent.Name,
						FiringEnvironment: {
							type: EventEnvironmentType.Client,
							player: player,
						},
						ListeningEnvironment: {
							type: EventEnvironmentType.Server,
						},
						UnixTimestamp: DateTime.now().UnixTimestamp,
					});
				}),
			);
		}
	}
}
