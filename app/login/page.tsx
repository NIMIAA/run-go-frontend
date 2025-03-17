import Link from "next/link";
export default function Login() {
    return(
        <div>
            <Link href='/'>go back home</Link>
        <div className="bg-background h-screen flex justify-center items-center">
            <div className="w-1/3 text-center">
            <p className="text-xl">Log into your account</p>
            <input type="text" placeholder="Enter matric number or email" className=" text-center p-4 my-2 rounded w-2/3 bg-grey-bg focus:outline-black" />
            <input type="button" value="Continue" className="bg-foreground text-background text-lg my-2 p-4 rounded w-2/3 cursor-pointer" />
            <div className="my-4">
                <p>Don't have an account? <Link className="text-foreground" href='signup'>Sign Up</Link></p>
            </div>
            </div>
            
        </div>
        </div>
    );
}