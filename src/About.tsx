import { useEffect } from "react";
import { useFooterStore } from "./store";

export default function About() {
  const { setMenu } = useFooterStore.getState();
  useEffect(() => {
    setMenu();
  }, []);

  const pClassName = "text-[4vh]";
  return (
    <div className="h-full w-full px-[6vw] py-[6vh] bg-gray-50 overflow-y-auto">
      <p className="text-[8vh] font-bold mb-4">About</p>
      <p className={pClassName}>Images are updated everyday!</p>
      <p className="my-2" />
      <p className="text-[4vh] font-bold my-2">References:</p>
      <ul className="list-disc pl-[6vw]">
        <li className={pClassName}>Images are from pxhere.com</li>
        <li className={pClassName}>
          Icon is from flaticon.com by SeyfDesigner
        </li>
      </ul>
    </div>
  );
}
