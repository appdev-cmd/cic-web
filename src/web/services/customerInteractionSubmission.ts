import type {
  CustomerInteractionSubmissionGateway,
  CustomerInteractionSubmissionInput,
  CustomerInteractionSubmissionResult,
} from '../../shared/customerInteractionContract';

const MOCK_SUBMISSIONS_STORAGE_KEY = 'cic.mock.customer-interaction-submissions';

const createRequestId = () => `request_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

class MockCustomerInteractionSubmissionGateway implements CustomerInteractionSubmissionGateway {
  async submit(input: CustomerInteractionSubmissionInput): Promise<CustomerInteractionSubmissionResult> {
    const result = {
      requestId: createRequestId(),
      submittedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      const current = JSON.parse(window.localStorage.getItem(MOCK_SUBMISSIONS_STORAGE_KEY) || '[]') as unknown[];
      window.localStorage.setItem(
        MOCK_SUBMISSIONS_STORAGE_KEY,
        JSON.stringify([{ ...result, ...input }, ...current].slice(0, 100)),
      );
    }

    return result;
  }
}

// Replace this instance with an HTTP gateway when the backend is available.
export const customerInteractionSubmissionGateway: CustomerInteractionSubmissionGateway =
  new MockCustomerInteractionSubmissionGateway();

export const submitCustomerInteraction = (input: CustomerInteractionSubmissionInput) =>
  customerInteractionSubmissionGateway.submit(input);

