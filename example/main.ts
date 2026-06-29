import { Button, Radio, Select } from "../src/adapters/index.js";
import { Controller } from "../src/core/controller.js";
import { LocalStorage } from "../src/storage/local.js";

const ctl = new Controller(document, /* all optional > */ {
	storage: new LocalStorage({
		key: "theme",
	}),
	attribute: "data-theme",
	initial: "dark",
	dark: "dark",
	light: "light",
	system: "system",
	observe: true,
});

/**
 * To test the observer, execute the following in the console:
 *
 * const btn = document.createElement("button");
 * btn.setAttribute("value", "theme:light");
 * document.body.appendChild(btn);
 */

ctl.use(Button, {
	animate: {
		enabled: true,
	}
});
ctl.use(Select);
ctl.use(Radio);

ctl.on("change", ({ theme }) => {
	console.log("theme changed", theme);
});

ctl.on("apply", ({ theme }) => {
	console.log("theme applied", theme);
});