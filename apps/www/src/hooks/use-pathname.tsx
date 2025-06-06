import { useEffect, useState } from "react";

export function usePathname() {
	const [pathname, setPathname] = useState(() => {
		if (typeof window === "undefined") return ""; // server
		return window.location.pathname; // client
	});

	useEffect(() => {
		if (typeof window === "undefined") return;

		const handlePopState = () => {
			setPathname(window.location.pathname);
		};

		window.addEventListener("popstate", handlePopState);
		return () => {
			window.removeEventListener("popstate", handlePopState);
		};
	}, []);

	return pathname;
}
