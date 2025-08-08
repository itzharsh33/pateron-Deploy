"use client";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { fetchuser, fetchpayments, initiate } from "@/actions/useractions";
import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { Bounce } from "react-toastify";
// import Router from "next/navigation";
import { useRouter } from "next/navigation";
const PaymentPage = ({ username }) => {
  // const {data:session}= useSession()
  const [paymentform, setpaymentform] = useState({
    name: "",
    message: "",
    amount: "",
  });
  // An object to hold the data from the payment form inputs (name, message, amount).
  const [currentUser, setcurrentUser] = useState({});
  // An object to store the profile information of the creator being paid.
  const [payments, setpayments] = useState([]);
  // An array to store the list of past payments made to this creator.
  // const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const handleChange = (e) => {
    setpaymentform({ ...paymentform, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getData();
  }, []);
  //  It runs only once when the component first loads. Its job is to call the getData function to fetch the initial page data.
  useEffect(() => {
    if (searchParams.get("paymentdone") == "true") {
      toast("Thanks for tour donation", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      router.replace(`/${username}`);
    }
  }, []);
  //  It also runs only once. It checks if the URL has a query parameter ?paymentdone=true. This happens after a successful payment verification.
  // If the parameter exists, it shows a "Thank you" toast notification and then cleans the URL using router.push().
  const getData = async () => {
    let u = await fetchuser(username);
    // to get the creator's profile details
    setcurrentUser(u);
    let dbpayments = await fetchpayments(username);
    //  to get a list of their supporters.
    setpayments(dbpayments);
    //  It then uses setcurrentUser and setpayments to save this data into the component's state, which updates the UI.
    console.log(u, dbpayments);
  };

  const pay = async (amount) => {
    //  This is the core function that starts the payment process when a user clicks a "Pay" button.
    let a = await initiate(amount, username, paymentform);
    //  It calls a server action named initiate to create a Razorpay order on the backend and get back an order ID.

    let orderId = a.id;
    var options = {
      // key: process.env.NEXT_PUBLIC_KEY_ID, // Enter the Key ID generated from the Dashboard
      key: currentUser.razorpayid,
      amount: amount, // Amount is in currency subunits.
      currency: "INR",
      name: "Get Me A Chai", //your business name
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: orderId, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
      //  This tells Razorpay which backend URL to redirect to after the payment is attempted. This is a crucial connection point.
      // basically it is calling razorpay/route.js to verify payment
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
        name: "Gaurav Kumar", //your customer's name
        email: "gaurav.kumar@example.com",
        contact: "+919876543210", //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
    // this above var options things is present on web integration named documentation on razorpay
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

      <div className="cover w-full relative">
        <img
          className="object-cover w-full h-48 md:h-[350px]"
          src={currentUser?.coverpic || "/cover.gif"}
          alt=""
        />
        <div className="absolute -bottom-16 right-[38%] md:right-[46%] ">
          <img
            className="rounded-full border-4"
            height={110}
            width={110}
            // src="https://lh3.googleusercontent.com/a/ACg8ocKOngEzKMY5FIOY4CjdijwmIcLRN_Yz8aSpTadGBquZqNus0EH1=s360-c-no"
            // src={currentUser?.profilepic||"https://lh3.googleusercontent.com/a/ACg8ocKOngEzKMY5FIOY4CjdijwmIcLRN_Yz8aSpTadGBquZqNus0EH1=s360-c-no"}
            // alt="hii"
            src={currentUser?.profilepic || "/proPhoto.jpg"}
            alt="photo"
            //  src={"/proPhoto.jpg"}
            // alt="photo"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center my-20">
        <div className="text-lg font-bold">@ {username}</div>
        <div className="text-slate-400">
          Lets help {username} to get a coffee !
        </div>
        <div className="text-slate-400">
          {payments.length} Payments . ₹
          {payments.reduce((a, b) => a + b.amount, 0)} raised
          {/* payments.reduce(...) is a JavaScript function that calculates the total amount from the payments array. */}
        </div>
      </div>

      <div className="flex w-[80%] gap-3 mx-auto flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-slate-700 rounded-lg p-10">
          <h2 className="text-center text-2xl font-bold">Top 10 Supporters</h2>
          <ul className="my-6 text-lg">
            {payments.length == 0 && <li>No payments yet</li>}
            {payments.map((p, i) => {
              return (
                <li key={i} className="my-2 flex items-center">
                  <img width={43} src="avatar.gif" alt="profile" />
                  <span>
                    {p.name} donated{" "}
                    <span
                      className="font-bold" // onClick={() => { //   pay(10);   // }}
                    >
                      ₹{p.amount}
                    </span>{" "}
                    with a message "{p.message}"
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="w-full md:w-1/2 bg-slate-700 rounded-lg p-10">
          <h2 className="text-center text-2xl font-bold">Make a Payment</h2>
          <div className="flex flex-col gap-2 my-4">
            <input
              onChange={handleChange}
              value={paymentform.name}
              className="w-full rounded-lg bg-slate-900 p-3"
              type="text"
              name="name"
              id=""
              placeholder="Enter name of minimum three character"
            />
            <input
              onChange={handleChange}
              value={paymentform.message}
              className="w-full rounded-lg bg-slate-900 p-3"
              type="text"
              name="message"
              id=""
              placeholder="Enter message of minimum 4 characters"
            />
            <input
              onChange={handleChange}
              value={paymentform.amount}
              className="w-full rounded-lg bg-slate-900 p-3"
              type="text"
              name="amount"
              id=""
              placeholder="Enter amount"
            />
            {/* understanding input */}
            {/* When the page first loads: Your state is paymentform.amount: "". Because the value is an empty string, the input is empty, so you see the placeholder "Enter amount". */}

            {/* When you start typing: Let's say you type "50". The handleChange function updates your state to paymentform.amount: "50". */}
            {/* 
            The input updates: The value of the input is now "50". Because the value is no longer empty, the input field shows "50", and the placeholder text disappears. */}

            {/* In short, the value prop always wins. The placeholder is just a temporary hint for when the value is empty. */}
            <button
              onClick={() => pay(Number.parseInt(paymentform.amount) * 100)}
              type="button"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:bg-slate-500 disabled:from-purple-400"
              disabled={
                paymentform.name?.length < 3 ||
                paymentform.message?.length < 4 ||
                paymentform.amount?.length < 1
              }
            >
              Pay
            </button>
          </div>
          <div className="flex gap-2 mt-5">
            <button
              className="bg-slate-800 rounded-lg p-3 cursor-pointer"
              onClick={() => pay(1000)}
            >
              ₹10
            </button>
            <button
              className="bg-slate-800 rounded-lg p-3 cursor-pointer"
              onClick={() => pay(2000)}
            >
              ₹20
            </button>
            <button
              className="bg-slate-800 rounded-lg p-3 cursor-pointer"
              onClick={() => pay(3000)}
            >
              ₹30
            </button>
            <button
              className="bg-slate-800 rounded-lg p-3 cursor-pointer"
              onClick={() => pay(4000)}
            >
              ₹40
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
