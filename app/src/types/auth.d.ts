// Declare the User interface in the '@auth/core/types' module
declare module '@auth/core/types' {
	// Define the properties of the User interface
	interface User {
		id: string;
		email: string;
		name: string;
		image: string;
	}
}
