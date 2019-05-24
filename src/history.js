export function getPathname() {
	return window.location.pathname;
}

export function redirect(path) {
	window.history.pushState(null, 'Something', path);
}