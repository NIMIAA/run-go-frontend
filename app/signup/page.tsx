import Link from "next/link";
export default function SignupPage() {
    return (
        <div>
            <Link href='/'>go back home
            </Link>
        <div className="bg-background h-screen flex justify-center items-center">
            <div className="w-1/3 text-center">
            <p className="text-xl">Create an account to get started</p>
            <input type="text" placeholder="Full Name" className=" text-center p-4 my-2 rounded w-2/3 bg-grey-bg focus:outline-black" />
            <input type="text" placeholder="Matric No." className=" text-center p-4 my-2 rounded w-2/3 bg-grey-bg focus:outline-black" />
            <input type="text" placeholder="Password" className=" text-center p-4 my-2 rounded w-2/3 bg-grey-bg focus:outline-black" />
            <button className="bg-foreground text-background text-lg my-2 p-4 rounded w-2/3 cursor-pointer">Sign Up</button>
            <div className="my-4">
                <p>Have an account? <Link className="text-foreground" href='login'>Login</Link></p>
            </div>
            </div>
        </div>
        </div>
    );
}