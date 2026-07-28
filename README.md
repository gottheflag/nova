# Theme controller

A controller for managing the theming for applications.

## Installation

```sh
pnpm add @gottheflag/nova
```

## Usage

```js
import { Controller } from "@gottheflag/nova";
import { Button } from "@gottheflag/nova/adapters";
import { LocalStorage } from "@gottheflag/nova/storage";

const ctl = new Controller(document, {
	// all configs are optional
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

// use adapters
ctl.use(Button, {
	prefix: "theme:",
	animate: {
		enabled: true,
		duration: 1000,
		easing: "ease-in-out",
	},
});

// listen for changes
ctl.on("change", ({ theme }) => {
	console.log("theme changed", theme);
});

// listen for applied theme
ctl.on("apply", ({ theme }) => {
	console.log("theme applied", theme);
});
```

## License

[Apache-2.0](LICENSE)