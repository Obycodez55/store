import Home from "./Home";
// import dynamic from "next/dynamic";

// const Home = dynamic(() => import("./Home"), { ssr: false });
export default function Page() {
  return <Home />;
}
