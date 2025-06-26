export const serverEntryExample = `import { load, render } from "brosel";
import Component from "./Component";

export default load(async (req) => {
    const user = await getUserFromDatabase(req.cookies.get("sessionId"));

    return await render({
        component: <Component user={user} />,
        props: {
            user,
        },
    });
}`;
