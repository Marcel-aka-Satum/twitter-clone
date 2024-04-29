import { LeftNavbar, RightNavbar, Midfeed } from "../import";

export default function Home() {
  return (
    <div className="grid grid-cols-3 max-w-screen h-screen">
      <div className="grid-item-1 col-span-1 border-r border-gray-500">
        <LeftNavbar />
      </div>
      <div className="grid-item-2 col-span-1">
        <Midfeed />
      </div>
      <div className="grid-item-3 col-span-1">
        <RightNavbar />
      </div>
    </div>
  );
}
