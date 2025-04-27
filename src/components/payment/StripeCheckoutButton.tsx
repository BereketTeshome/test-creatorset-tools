import { Formik } from 'formik';
import React, { useState } from 'react';
import {motion, motion as m} from 'framer-motion';
import { FormSchema } from './PaymentMethod';
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {createStripeSubscription, createStripeSubscriptionCheckout} from "@/api/payment.api";
import {
    CardElement,
    useStripe,
    useElements,
    ExpressCheckoutElement,
  } from '@stripe/react-stripe-js';


const CreditCardInfoForm = () => {
	const [animationFinished, setAnimationFinished] = useState(false);

	const initialFormValues = {
		cardNumber: '',
		cardExpiry: '',
		cvv: '',
		processingError: '',
	} as FormSchema;
	
	return (
		<m.div
			initial={{ opacity: 0, height: '0px' }}
			animate={{ opacity: 1, height: animationFinished ? 'auto' : 'auto' }}
			onAnimationComplete={() => setAnimationFinished(true)}
			exit={{ opacity: 0, height: '0px' }}
			style={{ width: '100%' }}>
			<Formik initialValues={initialFormValues} validate={handleValidation} onSubmit={(values, { setSubmitting }) => {
				submitForm(values, setSubmitting);
			}}>
				{(props) => (
					<form onSubmit={props.handleSubmit} style={{ width: '100%' }}>
						<Button
							className={`bg-[#E13943] ${
								Boolean(props.isSubmitting) ? "bg-[#7e2529] cursor-not-allowed" : "hover:bg-[#E13943]/80"
							} duration-150 w-full mt-8 rounded-md py-2.5 justify-center gap-1 flex items-center text-[#FDF8F8]`}
							disabled={Boolean(props.isSubmitting)}
							type='submit'
							style={{ width: '192px', height: '56px', fontWeight: '700', fontSize: '14px', marginBottom: '20px' }}
						>

							{
								Boolean(props.isSubmitting) ? (
								<>
									<motion.div
										initial={{rotate: 0}}
										animate={{
											rotate: 360,
											transition: {duration: 1, repeat: Infinity, ease: "linear"},
										}}
									>
										<Image
											src="/loading.png"
											alt=""
											draggable={false}
											width={20}
											height={20}
											className="h-6 w-6"
										/>
									</motion.div>
									Processing...
								</>
							) : (
								<>
									Proceed to Checkout
								</>
							)}

						</Button>
					</form>
				)}
			</Formik>
		</m.div>
	);

	function submitForm(values: FormSchema, setSubmitting: (isSubmitting: boolean) => void) {
		setSubmitting(false);
	}
	async function handleValidation(values: FormSchema) {
        await createStripeSubscription()
		const checkoutSession = await createStripeSubscriptionCheckout()
		window.location.replace(checkoutSession?.data.url)
	}
};

export default CreditCardInfoForm;
