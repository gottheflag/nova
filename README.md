# Theme controller

[![Socket Badge](https://badge.socket.dev/npm/package/@gottheflag/nova/0.1.0-beta.1)](https://badge.socket.dev/npm/package/@gottheflag/nova/0.1.0-beta.1)

A controller for managing the theming for applications.

## Installation

```sh
pnpm add @gottheflag/nova
```

## Usage

```js
import { Controller } from "@gottheflag/nova";
import { Button } from "@gottheflag/nova/adapters";

const ctl = new Controller(document, {
	// all configs are optional
	storage: { key: "theme" },
	attribute: "data-theme",
	initial: "dark",
	dark: "dark",
	light: "light",
	system: "system",
});

ctl.use(Button); // use adapters
```
