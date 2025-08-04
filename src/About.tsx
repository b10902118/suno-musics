import { useEffect } from "react";
import { useFooterStore } from "./store";

export default function About() {
  const { setMenu } = useFooterStore.getState();
  useEffect(() => {
    setMenu();
  }, []);

  return (
    <div className="h-full w-full flex items-start justify-start bg-white">
      <div className="h-full w-full px-[6vw] py-[6vh] bg-gray-50 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4">About</h1>
        <p>Images are from pxhere.com</p>
        <br />
        <p>Icon is from flaticon.com by SeyfDesigner</p>
      </div>
    </div>
  );
}
