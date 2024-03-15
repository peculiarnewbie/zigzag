// tried syncing with replicache
// this should be its own plugin

import { Replicache, TEST_LICENSE_KEY } from "replicache";
import { Message } from "types";

const workerURL = this.settings.workerurl;

const rep = process
	? new Replicache({
			name: "zigzag",
			licenseKey: TEST_LICENSE_KEY,
			pushURL: workerURL + "/api/replicache-push",
			pullURL: workerURL + "/api/replicache/pull",
	  })
	: null;

let messages = [] as Message[];

rep?.subscribe(
	async (tx) => {
		const list = await tx
			.scan<Message>({ prefix: "message/" })
			.entries()
			.toArray();
		list.sort(([, { order: a }], [, { order: b }]) => a - b);
		messages = list.map((tuple) => tuple[1] as Message);
		return list;
	},
	{
		onData: (res) => {
			messages = res.map((tuple) => tuple[1] as Message);
			// messages = res.;
		},
	}
);
