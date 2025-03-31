import Link from "next/link";
export default function SignupPage() {
    return (
      <div className="md:flex">
        <div className=" w-1/2 ">
          <div className="md:bg-black/30 w-1/2 md:bg-[url(/images/users-sign-up.jpg)] bg-cover bg-center bg-no-repeat bg-opacity-25 absolute inset-0"></div>
        </div>

        <div className="h-screen flex justify-center items-center">
          <div className="text-center">
            <p className="text-3xl">Hello, Friend</p>
            <p>Enter your details to get your journey with us started</p>

            <input
              type="text"
              placeholder="Full Name"
              className="p-4 my-2 rounded w-2/3 bg-grey-bg focus:outline-black"
            />
            <input
              type="text"
              placeholder="Matric No."
              className=" p-4 my-2 rounded w-2/3 bg-grey-bg focus:outline-black"
            />
            <input
              type="text"
              placeholder="Password"
              className=" p-4 my-2 rounded w-2/3 bg-grey-bg focus:outline-black"
            />
            <button className="bg-foreground text-background text-lg my-2 p-4 rounded w-2/3 cursor-pointer">
              Sign Up
            </button>
            <div className="my-4">
              <p>
                Have an account?{" "}
                <Link className="text-foreground" href="login">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
}