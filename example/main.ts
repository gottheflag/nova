import { Button, Radio, Select } from "../src/adapters/index.js";
import { Controller } from "../src/core/controller.js";

const ctl = new Controller(document, /* all optional > */ {
	storage: { key: "theme" },
	attribute: "data-theme",
	initial: "dark",
	dark: "dark",
	light: "light",
	system: "system",
});

ctl.use(Button);
ctl.use(Select);
ctl.use(Radio);