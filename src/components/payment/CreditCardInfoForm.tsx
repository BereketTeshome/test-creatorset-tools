import { Formik, FormikProps } from 'formik';
import React, { useState } from 'react';
import { AnimatePresence, motion as m } from 'framer-motion';
import { FormSchema } from './PaymentMethod';
import {Button} from "@/components/ui/button";
import {getUserInfo} from "@/utils/utils";
import {createStripeSubscription, createStripeSubscriptionCheckout} from "@/api/payment.api";
import {
	CardNumberElement,
	CardCvcElement,
	CardExpiryElement,
	useStripe,
	useElements,
} from '@stripe/react-stripe-js';

const CreditCardInfoForm = ({subscriptionPlan}) => {
	const [animationFinished, setAnimationFinished] = useState(false);
	const inputContainerStyle = {
		width: '100%',
		height: '80px',
		background: '#fff',
		border: '1px solid #EEF2F7',
		borderRadius: '8px',
		padding: '30px 20px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	};

	const inputStyle = {
		height: '50px',
		width: 'calc(100% - 20px)',
		border: 'none',
		outline: 'none',
		backgroundColor: '#fff',
	};

	const footerStyle = {
		marginTop: '16px',
		marginBottom: '32px',
		fontWeight: 400,
		fontSize: '14px',
		color: '#8A8A8A',
		maxWidth: '666px',
	};

	const initialFormValues = {
		cardNumber: '',
		cardExpiry: '',
		cvv: '',
		processingError: '',
	} as FormSchema;

	// Initialize an instance of stripe.
	const stripe = useStripe();
	const elements = useElements();
	// const history = useHistory();

	const FormErrorMessage = ({ condition, message }: { condition: boolean; message: string | undefined }) => {
		return (
			<AnimatePresence>
				{condition && (
					<m.p
						initial={{ opacity: 0, height: '0px' }}
						animate={{ opacity: 1, height: '40px' }}
						exit={{ opacity: 0, height: '0px' }}
						style={{ padding: '10px 0px', color: '#f41d3bd1' }}>
						{message ?? ''}
					</m.p>
				)}
			</AnimatePresence>
		);
	};

	const CardNumberInput = ({ props }: { props: FormikProps<FormSchema> }) => {
		const isInputCorrect = !props.errors.cardNumber && props.touched.cardNumber;
		return (
			<div id="card-element" style={inputContainerStyle}>
				<div style={{ width: 'inherit'}}>
					<CardNumberElement 
						id="cardNumber"
						onChange={props.handleChange}
						options={{
							style: {
								base: inputStyle,
							},
						}}
					/>
				 </div>
				<div style={{ width: '24px', height: '100%', position: 'relative' }}>
					<AnimatePresence>
						{isInputCorrect && (
							<m.img
								exit={{ opacity: 0, scale: 0 }}
								animate={{ opacity: 1, scale: 1 }}
								style={{ width: '100%', position: 'absolute' }}
								src={'/paymentMethod/tick.svg'}
							/>
						)}
					</AnimatePresence>
					<AnimatePresence>
						{!isInputCorrect && (
							<m.img
								exit={{ opacity: 0, scale: 0 }}
								animate={{ opacity: 1, scale: 1 }}
								src={'/paymentMethod/card.svg'}
								style={{ width: '100%', position: 'absolute' }}
							/>
						)}
					</AnimatePresence>
				</div>
			</div>
		);
	};

	const CardCVVInput = ({ props }: { props: FormikProps<FormSchema> }) => {
		const isInputCorrect = !props.errors.cvv && props.touched.cvv;
		return (
			<div style={{ ...inputContainerStyle, width: 'calc(50% - 8px)' }}>
				<div style={{ width: 'inherit'}}>
					<CardCvcElement 
						id='cvv'
						onChange={props.handleChange}
						options={{
							style: {
								base: inputStyle,
							},
						}}
					/>
				</div>
				<div style={{ width: '24px', height: '100%', position: 'relative' }}>
					<AnimatePresence>
						{isInputCorrect && (
							<m.img
								exit={{ opacity: 0, scale: 0 }}
								animate={{ opacity: 1, scale: 1 }}
								style={{ width: '100%', position: 'absolute' }}
								src={'/paymentMethod/tick.svg'}
							/>
						)}
					</AnimatePresence>
					<AnimatePresence>
						{!isInputCorrect && (
							<m.img
								exit={{ opacity: 0, scale: 0 }}
								animate={{ opacity: 1, scale: 1 }}
								src={'/paymentMethod/cvv.svg'}
								style={{ width: '100%', position: 'absolute' }}
							/>
						)}
					</AnimatePresence>
				</div>
			</div>
		);
	};

	const CardExpirationDateInputs = ({ props }: { props: FormikProps<FormSchema> }) => {
		const isInputCorrect =
			!props.errors.cardExpiry && props.touched.cardExpiry;

		return (
			<section style={{ width: 'calc(50% - 8px)' }}>
				<div style={inputContainerStyle}>
					<div style={{ width: 'inherit'}}>
						<CardExpiryElement 
							id="cardExpiry"
							onChange={props.handleChange}
							options={{
								style: {
									base: inputStyle,
								},
							}}
						/>
					</div>
					<div style={{ width: '24px', height: '100%', position: 'relative' }}>
						<AnimatePresence>
							{isInputCorrect && (
								<m.img
									exit={{ opacity: 0, scale: 0 }}
									animate={{ opacity: 1, scale: 1 }}
									style={{ width: '100%', position: 'absolute' }}
									src={'/paymentMethod/tick.svg'}
								/>
							)}
						</AnimatePresence>
						<AnimatePresence>
							{!isInputCorrect && (
								<m.img
									exit={{ opacity: 0, scale: 0 }}
									animate={{ opacity: 1, scale: 1 }}
									src={'/paymentMethod/calendar.svg'}
									style={{ width: '100%', position: 'absolute' }}
								/>
							)}
						</AnimatePresence>
					</div>
				</div>
			</section>
		);
	};

	return (
		<m.div
			initial={{ opacity: 0, height: '0px' }}
			animate={{ opacity: 1, height: animationFinished ? 'auto' : '336px' }}
			onAnimationComplete={() => setAnimationFinished(true)}
			exit={{ opacity: 0, height: '0px' }}
			style={{ width: '100%' }}>
			<Formik initialValues={initialFormValues} validate={handleValidation} onSubmit={(values, { setSubmitting }) => {
				submitForm(values, setSubmitting);
			}}>
				{(props) => (
					<form onSubmit={props.handleSubmit} style={{ width: '100%' }}>
						<CardNumberInput props={props} />
						<FormErrorMessage
							condition={Boolean(props.errors.cardNumber && props.touched.cardNumber)}
							message={props.errors.cardNumber}
						/>
						<div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
							<CardExpirationDateInputs props={props} />
							<CardCVVInput props={props} />
						</div>
						<FormErrorMessage
							condition={Boolean(props.errors.cardExpiry && props.touched.cardExpiry)}
							message={props.errors.cardExpiry}
						/>
						<FormErrorMessage condition={Boolean(props.errors.cvv && props.touched.cvv)} message={props.errors.cvv} />
						<FormErrorMessage condition={Boolean(props.errors.processingError)} message={props.errors.processingError} />
						
						<p style={footerStyle}>
							Data is protected under the PCI DSS standard. We do not store your data and do not share it with the
							merchant.
						</p>
						<Button
                            className={`bg-[#E13943] ${
                                Boolean(props.isSubmitting) ? "bg-[#7e2529] cursor-not-allowed" : "hover:bg-[#E13943]/80"
                            } duration-150 w-full mt-8 rounded-md py-2.5 justify-center gap-1 flex items-center text-[#FDF8F8]`}
                            disabled={Boolean(props.isSubmitting)}
                            type='submit'
                            
                            style={{ width: '192px', height: '56px', fontWeight: '700', fontSize: '14px', marginBottom: '20px' }}
                        >
                            Proceed to Checkout
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
		// setIsLoading(true);
		const errors: any = {};

		const onlyNumbers = /^\d+$/;
		
		if (!stripe || !elements) {
			// Stripe.js has not yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}
	  
		const cardElement = elements?.getElement(CardNumberElement);
        const name = getUserInfo().name;
        // const stripeSubscription = await createStripeSubscription()
        // const clientSecret = stripeSubscription.data.clientSecret
		// const name = getUserInfo().name;
        const subsPlan = subscriptionPlan.filter(sub => sub.type === 'stripe');
        const formData = {
            subscriptionPlan: subsPlan,
        }
        const stripeSubscription = await createStripeSubscription(formData)
        const clientSecret = stripeSubscription?.data.clientSecret
        
		if (stripe && cardElement) {
			let { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
				  card: cardElement,
				  billing_details: {
					name: name,
				  }
				}
			});
			if (error) {
				switch(error.code) {
					case 'invalid_number':
					case 'expired_card':
					case 'card_declined':
					case 'incorrect_number':
						errors.cardNumber = error.message
						break;
					case 'incorrect_cvc':
					case 'incomplete_cvc':
						errors.cvv = error.message
						break;
					case 'expired_card':
						errors.cardExpiry = error.message
						break;
					default:
						errors.processingError = error.message
						break;
				}
			}
			if(paymentIntent && paymentIntent.status === 'succeeded') {
				localStorage.setItem('isPaymentSuccess', 'true')
				window.location.replace('/my-account');
			}
		}
		return errors;
	}
};

export default CreditCardInfoForm;
