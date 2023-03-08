import { Navbar } from "~/components/shared/Navbar";

export default function Error404() {
  return (
    <div>
      <Navbar />

      <h1
        style=" background-color: #282c34; 
            min-height: 100vh;
            display: flex; 
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: calc(10px + 2vmin);
            color: white;"
      >
        The page you have requested does not exist{" "}
      </h1>
    </div>
  );
}
