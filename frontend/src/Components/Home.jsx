import { LeftNavbar, RightNavbar, Midfeed } from "./import";

export default function Home() {
  return (
    <div className="grid grid-cols-3 w-screen h-screen justify-center">
      <div className="grid-item-1 col-span-1 overflow-auto">
        <LeftNavbar />
      </div>
      <Midfeed />
      <div className="grid-item-3">
        <RightNavbar />
      </div>
    </div>
  );
}
