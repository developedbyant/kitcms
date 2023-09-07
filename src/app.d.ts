// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			mdbCMS:import("mdbCMS/types/locals").Locals
		}
		interface PageData {
			mdbCMS:import("mdbCMS/types/locals").PageData
		}
		// interface Platform {}
	}
}

export {};
