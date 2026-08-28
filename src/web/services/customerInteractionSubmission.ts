import type { CustomerInteractionSubmissionInput } from '../../shared/customerInteractionContract';
import { submitCustomerInteractionAction } from '../../features/contact/server/actions';
export const submitCustomerInteraction = (input: CustomerInteractionSubmissionInput) => submitCustomerInteractionAction(input);
