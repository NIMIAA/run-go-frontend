import Link from "next/link";
export default function Login() {
    return(
        <div className="md:flex">
            <div className=" w-1/2 bg-backgroundImg bg-cover bg-center bg-no-repeat bg-opacity-25">
            <div className="md:bg-foreground/50 w-1/2 absolute inset-0"></div>
            </div>
        <div className="h-screen flex justify-center items-center">
            <div className="text-center">
            <p className="text-3xl">Welcome back, Friend</p>
            <p>To stay connected with us, login with your personal info</p>
            <input type="text" placeholder="Matric No." className=" p-4 my-2 rounded w-2/3 bg-grey-bg focus:outline-black" />
            <input type="text" placeholder="Password" className=" p-4 my-2 rounded w-2/3 bg-grey-bg focus:outline-black" />
            <button className="bg-foreground text-background text-lg my-2 p-4 rounded w-2/3 cursor-pointer">Login</button>
            <div className="my-4">
                <p>Have an account? <Link className="text-foreground" href='signup'>Sign Up</Link></p>
            </div>
            </div>
        
        </div>
           
        </div>
    );
}