import { AnimatePresence } from 'framer-motion';
import * as React from 'react';
import { useState } from 'react';
import CreditCardInfoForm from './CreditCardInfoForm'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe} from '@stripe/stripe-js';
import {PAYPAL_ClIENT_ID} from "@/utils/utils";
import {getPlanId, getStripeConfigById, processPayment, getStripeConfig} from "@/api/payment.api";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Image from "next/image";


type PropTypes = {};

type PaymentMethods = 'NOTSELECTED' | 'CARD' | 'PAYPAL';

export type FormSchema = {
  cardNumber: string;
  cardExpiry: string;
  cvv: string;
  processingError: string;
};

const PaymentMethod = ({subscriptionPlan}) => {
  //From now on we can safely assume that we have a selected plan on:
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethods>('NOTSELECTED');
  const [stripePlanID, setStripePlanID] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);

  React.useEffect(() => {
    // Log the subscriptionPlan to understand the flow
    const subsPlan = subscriptionPlan[0].paymentType.filter(sub => sub.type === 'stripe');
    if (subscriptionPlan) {
      setStripePlanID(subsPlan[0].planId);
    }
  }, [subscriptionPlan]);

  React.useEffect(() => {
    if (stripePlanID) {
      getStripeConfigById(stripePlanID)
        .then((response) => {
          if (response?.data?.publishableKey) {
            // Load Stripe with the publishable key
            const stripe = loadStripe(response.data.publishableKey);
            setStripePromise(stripe);
          }
        })
        .catch((error) => {
          console.error('Error fetching Stripe config:', error);
          setStripePromise(null);
        });
    }
  }, [stripePlanID]);
  

  return (
    <main className='content_component' style={{ maxWidth: '712px', alignItems: 'flex-start' }}>
      <h1 style={{ fontWeight: 600, fontSize: '28px', marginBottom: '30px', width: '100%' }}>
        Select a payment method:
      </h1>
      <SelectCreditCardButton />
      <AnimatePresence>{selectedPaymentMethod === 'CARD' && <Elements stripe={stripePromise}> <CreditCardInfoForm subscriptionPlan={subscriptionPlan}/></Elements> }</AnimatePresence>
      <SelectPayPalButton />
      <AnimatePresence>{selectedPaymentMethod === 'PAYPAL' && <ContinueToPayPalCheckoutButton subscriptionPlan={subscriptionPlan} />}</AnimatePresence> 
    </main>
  );

  function ContinueToPayPalCheckoutButton({subscriptionPlan}) {
    const subsPlan = subscriptionPlan[0].paymentType.filter(sub => sub.type === 'paypal');
    const [isPaypalBtnLoading, setPaypalBtnLoading] = useState(false);
    const buttonStyles = {
      textAlign: "center",
      padding: "1rem",
      margin: "1rem",
      width: "50%",
    }
    return (
      <div style={{ maxWidth: "750px", minHeight: "200px" }}>
        {/*vault:true,*/}
        <PayPalScriptProvider options={{ clientId: subsPlan[0].clientId,  components: "buttons", currency: "USD", vault: true  }}>

          <PayPalButtons style={{ layout: "horizontal" }}
                         createSubscription={(data: any, actions: { subscription: { create: (arg0: { plan_id: any; auto_renewal: boolean; }) => any; }; }) => {
                           return actions.subscription.create({
                             plan_id: subsPlan[0].planId,
                             auto_renewal: true
                           });
                         }}
                         onApprove={async (data: any, actions: any) => {
                           try {
                             const response = await processPayment(data);
                             console.log(response);
                             if (response === 201) {
                               console.log('success')
                               window.location.replace('/my-account');
                             }
                           } catch (err) {
                             console.log("Error ::: ", err);
                           }
                         }}

          />
        </PayPalScriptProvider>
      </div>
    );
  }

  function SelectCreditCardButton() {
    return (
      <button
        onClick={() => setSelectedPaymentMethod('CARD')}
        style={{
          width: '100%',
          height: '50px',
          border: 'none',
          display: 'flex',
          borderRadius: '10px',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          marginBottom: '40px',
        }}

        className="text-black2 bg-white px-1.5"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className='RadioInputsContainer'>
            <label htmlFor='cardMethod' style={{ marginBottom: '0px' }}>
              <input
                type='radio'
                id='cardMethod'
                onChange={() => setSelectedPaymentMethod('CARD')}
                checked={selectedPaymentMethod === 'CARD'}
              />
              <span
                className="pl-3"
                style={{ fontWeight: 500, fontSize: '24px' }}>Bank Card</span>
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <Image src={`/logos/GooglePay.svg`} alt="GooglePay's Logo" width={24} height={24}/>
          <Image src={`/logos/visaLogo.svg`} alt="Visa's Logo" width={24} height={24} />
          <Image src={`/logos/Mastercard.svg`} alt="Mastercard's Logo" width={24} height={24} />
          <Image src={`/logos/Maestro.svg`} alt="Maestro's Logo" width={24} height={24} />
        </div>
      </button>
    );
  }

  function SelectPayPalButton() {
    return (
      <button
        onClick={() => setSelectedPaymentMethod('PAYPAL')}
        style={{
          width: '100%',
          backgroundColor: 'white',
          border: 'none',
          color: '#17212B',
          cursor: 'pointer',
          height: '50px',
          display: 'flex',
          borderRadius: '10px',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className='RadioInputsContainer'>
              <label htmlFor='paypalMethod' style={{ marginBottom: '12px' }}>
                <input
                  type='radio'
                  id='paypalMethod'
                  onChange={() => setSelectedPaymentMethod('PAYPAL')}
                  checked={selectedPaymentMethod === 'PAYPAL'}
                />
                <span style={{ fontWeight: 500, fontSize: '24px' }}>Оnline payment system</span>
              </label>
            </div>
          </div>
          <img src={`/logos/payPalLogo.svg`} alt="PayPal's Logo" style={{ width: '100px' }} />
        </div>
        {/* <div style={{ textAlign: 'left' }}>
          <p style={{ fontWeight: 400, fontSize: '14px', color: '#8A8A8A' }}>Convenient method of payment using</p>
          <p style={{ fontWeight: 400, fontSize: '14px', color: '#8A8A8A' }}>
            YouMoney and Perfect Money payment systems
          </p>
        </div> */}
      </button>
    );
  }
};

export default PaymentMethod;
