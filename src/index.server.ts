/// <reference types="@rbxts/types/plugin" />

import inspect from "@rbxts/inspect";
import { RunService } from "@rbxts/services";
import { EventListener } from "classes/EventListener";
import { EventLogStore } from "classes/EventLogStore";

export {};

const toolbar = plugin.CreateToolbar("Event Log");
const button = toolbar.CreateButton("Toggle", "", "");

const eventLogStore = EventLogStore.create();
eventLogStore.eventLogAdded.Connect((eventLog) => print(inspect(eventLog)));

let eventListener: EventListener | undefined;

button.Click.Connect(() => {
	if (!RunService.IsRunning()) {
		return;
	}

	if (eventListener === undefined) {
		print("Toggling on");
		eventListener = EventListener.create(eventLogStore, [game]);
	} else {
		print("Toggling off");
		eventListener.destroy();
		eventListener = undefined;
	}
});
