import React from "react";
import Header from "../components/Header";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectItems, selectTotal } from "../slices/basketSlice";
import CheckoutProduct from "../components/CheckoutProduct";
import Currency from "react-currency-formatter";
import { useSession } from "next-auth/client";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
const stripePromise = loadStripe(process.env.stripe_public_key);

function Checkout() {
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const [session] = useSession();

  const createCheckoutSession = async () => {
    const stripe = await stripePromise;
    console.log("before axio");
    const checkoutSession = await axios.post("/api/create-checkout-session", {
      items: items,
      email: "akash.kushwaha@gmail.com",
    });
    console.log("after axio");

    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });

    if (result.error) alert(result.error.message);
  };

  console.log(session, "session ");
  return (
    <div className="bg-gray-100">
      <Header />

      <main className="lg:flex max-w-screen-2xl mx-auto">
        {/* Left */}
        <div className="flex-grow m-5 shadow">
          <Image
            src="https://links.papareact.com/ikj"
            width={1020}
            height={250}
            objectFit={"contain"}
          />
          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">
              {items.length === 0
                ? `Amazon basket is empty`
                : `Shopping basket`}
            </h1>

            {items.map((item, i) => {
              return (
                <CheckoutProduct
                  key={i}
                  title={item?.title}
                  id={item?.id}
                  description={item?.description}
                  image={item?.image}
                  category={item?.category}
                  price={item?.price}
                  rating={item?.rating}
                  hasPrime={item?.hasPrime}
                />
              );
            })}
          </div>
        </div>

        {/* right */}
        <div className="flex flex-col bg-white p-10 shadow-md">
          {items.length > 0 && (
            <>
              <h2 className="whitespace-nowrap">
                SubTotal {items.length} items
              </h2>
              <span className="font-bold">
                {" "}
                <Currency quantity={total} currency={"INR"} />
              </span>
              <button
                role="link"
                disabled={!session}
                onClick={createCheckoutSession}
                className={`button mt-2 ${
                  !session &&
                  "from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed"
                }`}
              >
                {!session ? "Sign in to checkout" : "Proceed to checkout"}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Checkout;
