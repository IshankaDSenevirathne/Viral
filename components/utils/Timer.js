import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useRouter } from "next/router";

const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className="timer">Redirecting...</div>;
    }
  
    return (
      <div className="timer">
        <div className="value text-4xl">{remainingTime}</div>
      </div>
    );
  };
  

export default function Timer() {
  const router =useRouter();
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="timer-wrapper">
        <CountdownCircleTimer
          isPlaying
          duration={30}
          colors={["#3b82f6"]}
          onComplete={() => router.push("/private/ManageUser?panel=0")}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
      <div className="mt-5 grid grid-cols-4">
        <div></div>
        <button
            onClick={()=>router.push("/")}
            type="button"
            className="inline-flex m-1 px-2 justify-center rounded-md bg-blue-500  py-2 items-center text-sm font-semibold text-white hover:bg-blue-400  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 duration-300 delay-10"
            >
            Back to Store
        </button>
        <button
            onClick={()=>router.push("/private/ManageUser?panel=0")}
            type="button"
            className="inline-flex m-1 px-2 justify-center rounded-md bg-blue-500  py-2 items-center text-sm font-semibold text-white hover:bg-blue-400  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 duration-300 delay-10"
            >
            Back to Dashboard
        </button>
      </div>
    </div>
  );
}

