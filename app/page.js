import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center items-center text-white h-[44vh]  md:gap-4 px-5 md:px-0">
        <div className=" text-2xl md:text-5xl font-bold flex items-center justify-center">
          <span>Get Me A COFFEE</span>
          <img
            width={84}
            className="filter [filter:invert(0.23)]"
            src="/tea.gif"
            alt=""
          />
        </div>
        <p className="text-center md:text-left">
          A crowd funding platefrm for creators. Get funded by your fans and
          followers. Start now!
        </p>
        <div>
          <Link href={"/login"}>
            <button
              type="button"
              className="text-white bg-gradient-to-br from-purple-400 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Start Here
            </button>
          </Link>
          <Link href={"/about"}>
            <button
              type="button"
              className="text-white bg-gradient-to-br from-purple-400 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Read More
            </button>
          </Link>
        </div>
      </div>
      <div className="bg-white h-1 opacity-10"></div>
      <div className="text-white container mx-auto py-14 px-10">
        <h2 className="text-3xl text-center font-bold mb-10">
          Your fans can buy you a coffee
        </h2>
        <div className="flex gap-5 justify-around">
          <div className=" item space-y-2 flex flex-col justify-center items-center">
            <img
              className="bg-slate-400 rounded-full p-2 text black"
              width={88}
              src="/man.gif"
              alt=""
            />
            <p className="font-bold text-center">Fans want to help</p>
            <p className="text-center">
              Your fans are available for you to help
            </p>
          </div>
          <div className=" item space-y-2 flex flex-col justify-center items-center">
            <img
              className="bg-slate-400 rounded-full p-2 text black"
              width={88}
              src="/coin.gif"
              alt=""
            />
            <p className="font-bold text-center">Fans want to contribute</p>
            <p className="text-center">
              Your fans are available for you to help
            </p>
          </div>
          <div className=" item space-y-2 flex flex-col justify-center items-center">
            <img
              className="bg-slate-400 rounded-full p-2 text black"
              width={88}
              src="/group.gif"
              alt=""
            />
            <p className="font-bold text-center">Fans want to collaborate</p>
            <p className="text-center">
              Your fans are available for you to help
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white h-1 opacity-10"></div>
      <div className="text-white container mx-auto py-14 flex flex-col justify-center items-center">
        <h2 className="text-3xl text-center font-bold mb-10">
          Learn more about us through YT
        </h2>
        <div className="w-[40%] h-[10vh] md:w-[50%] md:h-[40vh] lg:w-[50%] lg:h-[40vh] xl:w-[50%] xl:h-[40vh]">
        <iframe
        className="w-full h-full"
          src="https://www.youtube.com/embed/HbNfCM4ilBQ?si=3kT-lZK67jTRe9cT"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        </div>
      </div>
    </>
  );
}

