"use client";
import React,{useState} from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
const Navbar = () => {
  const { data: session } = useSession();
  const [showdropdown, setshowdropdown] = useState(false)
  const router = useRouter();

  return (
    <nav className="flex justify-between p-2 bg-gray-900 text-white md:h-16 flex-col md:flex-row items-center">
      <Link href={'/'} className="logo font-bold text-lg flex justify-center items-center">
        <img width={44} src="/tea.gif" alt="" />
        <span>GETMeACoffee</span>
      </Link>




      <div className="relative flex flex-col md:block gap-4">


        {!session&&
                    
            <button
            onClick={()=>router.push("/login")}
              type="button"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Login
            </button>
      
            }

{session&&
<>
<button onClick={()=>setshowdropdown(!showdropdown)}  id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mx-4 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Welcome {session.user.email}<svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
</svg>
</button>



<div id="dropdown" className={`z-10 ${showdropdown?"":"hidden"} absolute left-[145px] bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700`} >
    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
      <li>
        <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</Link>
      </li>
      <li>
        <Link href={`/${session.user.name}`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">My Page</Link>
      </li>
      <li>
        {/* <Link onClick={()=>signOut()} href="/" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</Link> */}
                <Link
          onClick={(e) => {
          e.preventDefault();
          // In your code, you call e.preventDefault(), so the browser never actually follows href="#".
          signOut({ redirect: false }).then(() => {
          window.location.href = "/"; // or use router.push("/")
      });
    }}
    href="#"
    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</Link>
      </li>
    </ul>
</div> 
</>
}


        {session && (
       
            <button
            // onClick={()=>signOut()}
                 onClick={() =>
        signOut({ redirect: false }).then(() => {
          router.push("/"); // redirect to home page after logout
        })
      }
              type="button"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              LogOut
            </button>
    
        )} 

      </div>
  
    </nav>
  );
};

export default Navbar;





















