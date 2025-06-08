import { load, render } from "brosel";

export default load({
	path: "/examples",
	handler: async () => {
		return await render({
			component: <Component />,
			props: {},
		});
	},
});

export const Component = () => {
	return <div>Examples</div>;
};
