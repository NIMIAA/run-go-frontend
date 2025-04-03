import Link from "next/link";
import Authenticationlayout from "../components/layouts/authentication";
export default function Login() {
  return (
    <div className="md:flex">
      <div className=" w-1/2">
        <div className="md:bg-black/50 bg-blend-multiply md:bg-[url(/images/background/bg-4.jpg)] w-1/2  bg-cover bg-center bg-no-repeat bg-opacity-25 absolute inset-0"></div>
      </div>
      <Authenticationlayout className="">
        <div className="text-center">
          <p className="text-3xl font-bold ">Welcome back!</p>
          <p className="prose-lg leading-1 text-gray-400 mb-6 mt-2">
            To stay connected with us, login with your personal info
          </p>
          <input
            type="text"
            placeholder="Matric No."
            className=" p-4 my-2 rounded md:w-2/3 w-full bg-grey-bg focus:outline-black"
          />
          <input
            type="text"
            placeholder="Password"
            className=" p-4 my-2 rounded md:w-2/3 w-full bg-grey-bg focus:outline-black"
          />
          <button className="bg-foreground text-background text-lg my-2 p-4 rounded md:w-2/3 w-full cursor-pointer">
            Continue as a user
          </button>
          <button className="text-foreground border-foreground border-rounded  border-2 text-lg my-2 p-4 rounded md:w-2/3 w-full cursor-pointer">
            Continue as a driver
          </button>
          <div className="my-4">
            <p>
              Don&apos;t have an account?{" "}
              <Link className="text-foreground" href="signup">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </Authenticationlayout>
    </div>
  );
}
