import React, {useEffect, useState} from "react";
import CurrentPlan from "./CurrentPlan";
import UsageSection from "./UsageSection";
import {getMySubscription, getSubscriptionPlans, verifyStripePayment, cancelSubscription} from "@/api/payment.api";
import {getSelectedPlan, getUserInfo} from "@/utils/utils";
import PricingDialog from "../pricing-dialog";
import SuccessDialog from "../successD-dalog";

const PlansAndBillings = () => {

  // const [isSubscriptionActive, setIsSubscriptionActive] = useState(true)
  // const [subscriptions, setSubscriptions] = useState([
  //   {
  //     "planId": "price_1QBrk4JFtrniz3dWnNeQVZEZ",
  //     "subscriptionId": "sub_1QBt0cJFtrniz3dWsL2Ya6Pm",
  //     "status": "ACTIVE",
  //     "startTime": "Sun Oct 20 2024 14:53:02 GMT+0800 (Malaysia Time)",
  //     "currencyCode": "usd",
  //     "amount": 7.99,
  //     "nextBillingDate": "Fri Dec 27 2024 15:06:02 GMT+0800 (Malaysia Time)",
  //     "paymentMethod": "stripe",
  //     "name": null
  //   }
  // ])


  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false)
  const [subscriptions, setSubscriptions] = useState([])
  const [subscriptionPlan, setSubscriptionPlan] = useState([])
  const [subscriptionAmount, setSubscriptionAmount] = useState()
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Extract the session_id from the query string
  const query = new URLSearchParams(location.search);
  const sessionId = query.get('session_id');

  const [open, setOpen] = useState(false)

  useEffect(() => {

    const user = getUserInfo();
    
    if (!user) {
      return
    }

    const currentDate = new Date(); // Get the current date and time

    getMySubscription(user.id).then((response) => {
      if (response.data.length > 0 && response.data.some(sub => new Date(sub.nextBillingDate) > currentDate)) {
        setIsSubscriptionActive(true);
        setSubscriptions(response.data.filter(sub => new Date(sub.nextBillingDate) > currentDate))
      }
    })

     // Access the query string in the URL
     const queryParams = new URLSearchParams(window.location.search);
     // Get the 'session_id' and 'payment_status' from the query string
     const sessionIdFromQuery = queryParams.get('session_id');

    if(sessionIdFromQuery) {
      const formData = {
        sessionId: sessionIdFromQuery
      }

      verifyStripePayment(formData).then((response) => {
        setDialogOpen(response.data.payment_status.toLowerCase() === 'paid');
      })
    }


    const selectedPlan = getSelectedPlan()
    if (selectedPlan) {
      setSubscriptionPlan([selectedPlan])
      setSubscriptionAmount(selectedPlan.amount)
    } else {
      getSubscriptionPlans().then((response) => {
        let availablePlans = []
        if (response.data.length > 0) {
          availablePlans = response.data[1]
          setSubscriptionAmount(response.data[1].amount)
          setSubscriptionPlan([availablePlans])
        }
      });
    }
  }, []);

  // Log the subscription amount whenever it updates
  useEffect(() => {
    console.log("Updated subscription amount:", subscriptionAmount);
  }, [subscriptionAmount]);

  const handleCloseDialog = () => {

    // Ensure that window.location.href is being used as a string to construct a URL
    const currentUrl = window.location.href; // Get the full URL (including query params)
    
    // Log to see what the URL looks like
    console.log("Current URL:", currentUrl);

    // Convert the current URL to a URL object
    const url = new URL(currentUrl);

    // Remove query parameters
    url.searchParams.delete("session_id");

    // Log the updated URL to check
    console.log("Updated URL:", url.toString());

    // Update the URL without reloading the page (using replaceState)
    window.history.replaceState({}, "", url.toString());
    setDialogOpen(false);
  };

  const handleCancelSubscription = async () => {
    const user = getUserInfo();
    try {
      if (user) {
        const unsubscribe =  await getMySubscription(user.id);
  
        if(unsubscribe.status === 200) {
          await cancelSubscription(unsubscribe.data[0])
        } 
      }
    } catch (error) {
      console.error(error)
    } finally {
      closeModal(); // Close modal after action
      window.location.reload(); 
    }
  };

  return (
    <div className="bg-black2 text-white mt-8 min-h-screen">
      <div className="flex w-full justify-between lg:flex-row flex-col">

        <div>
          <h1 className="text-3xl font-bold">Plans & Billings</h1>
          <p className="text-gray-400 mb-6">Manage your plans and payments</p>
        </div>

        {
          isSubscriptionActive ?

            <div className="flex gap-4 mb-16 lg:min-w-96">
              <button className="bg-gray3 text-white py-2 lg:px-4 px-2 flex-1 rounded hover:bg-neutral-700" onClick={openModal}>
                Cancel Subscription
              </button>
              <button className="bg-red text-white py-2 lg:px-4 px-2 flex-1 rounded hover:bg-red" onClick={() => setOpen(true)}>
                Manage Payments
              </button>
            </div> :

            <div className="flex gap-4 mb-16 lg:min-w-96">
              <button className="bg-gray3 text-white py-2 lg:px-4 px-2 flex-1 rounded hover:bg-neutral-700">
                Manage Payments
              </button>
              <button className="bg-red text-white py-2 lg:px-4 px-2 flex-1 rounded hover:bg-red" onClick={() => setOpen(true)}>
                Upgrade to Premium
              </button>
            </div>
        }

        <PricingDialog open={open} setOpen={setOpen}/>
        {/* <SubscribeDialog open={open} setOpen={setOpen} subscriptionAmount={subscriptionAmount} subscriptionPlan={subscriptionPlan}/> */}
      </div>

      <SuccessDialog open={isDialogOpen} onClose={handleCloseDialog} />
      <CurrentPlan subscriptions={subscriptions} isSubscriptionActive={isSubscriptionActive} subscriptionAmount={subscriptionAmount}/>
      {/* <UsageSection/> */}
      {/* Conditionally render UsageSection only if the subscription is active */}
      {isSubscriptionActive && <UsageSection />}
       {/* Modal Background and Content */}
       {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-black p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Confirm Cancellation</h2>
            <p className="text-center mb-6 text-gray-600">Are you sure you want to cancel your subscription?</p>
            
            <div className="flex justify-center gap-6">
              <button
                onClick={closeModal}
                className="bg-gray3 text-white py-2 lg:px-4 px-2 flex-1 rounded hover:bg-neutral-700"
              >
                No, Keep Subscription
              </button>
              
              <button
                onClick={handleCancelSubscription}
                className="bg-red text-white py-2 lg:px-4 px-2 flex-1 rounded hover:bg-red"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
       </div>
      )}
    </div>
  );
};

export default PlansAndBillings;
