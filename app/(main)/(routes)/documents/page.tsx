import { cookies } from "next/headers";

import { MainView } from "./_components/main-view";

export default function DocumentsPage() {
  const layout = cookies().get("react-resizable-panels:layout");
  const navCollapsed = cookies().get("react-resizable-panels:navCollapsed");
  const chatCollapsed = cookies().get("react-resizable-panels:chatCollapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultNavCollapsed = navCollapsed
    ? JSON.parse(navCollapsed.value)
    : undefined;
  const defaultChatCollapsed = chatCollapsed
    ? JSON.parse(chatCollapsed.value)
    : undefined;

  return (
    <div className="flex flex-col h-full">
      <MainView
        defaultLayout={defaultLayout}
        defaultNavCollapsed={defaultNavCollapsed}
        defaultChatCollapsed={defaultChatCollapsed}
        navCollapsedSize={4}
      />
    </div>
  );
}
