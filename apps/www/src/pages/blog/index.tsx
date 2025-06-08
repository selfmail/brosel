import { load, render } from "brosel";

export default load({
	path: "/blog",
	handler: async () => {
		return await render({
			component: <Component />,
			props: {},
		});
	},
});

export const Component = () => {
	return <div>blog</div>;
};
