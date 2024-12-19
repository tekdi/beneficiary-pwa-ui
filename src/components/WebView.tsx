import React, { useEffect, useRef } from 'react';
import { transformData } from '../utils/jsHelper/helper';
import Layout from './common/layout/Layout';
interface FormData {
	user_id?: string;
	name?: string;
	current_class?: string;
	previous_year_marks?: string;
	phone_number?: string;
	username?: string;
	email?: string;
}
interface BenefitItem {
	descriptor?: {
		name?: string;
		long_desc?: string;
	};
	price?: {
		value?: number;
		currency?: string;
	};
	document?: string[];
	tags?: Array<{
		descriptor?: { code?: string; short_desc: string };
		list?: Array<{ value?: string }>;
	}>;
}
interface WebViewFormSubmitWithRedirectProps {
	url?: string;
	formData?: FormData;
	context?: FinancialSupportRequest;
	item?: BenefitItem;
	submitConfirm?: (content: string) => void;
}

interface FinancialSupportRequest {
	domain: string;
	action: string;
	version: string;
	bpp_id: string;
	bpp_uri: string;
	country: string;
	city: string;
	bap_id: string;
	bap_uri: string;
	transaction_id: string;
	message_id: string;
	ttl: string;
	timestamp: string;
}

const WebViewFormSubmitWithRedirect: React.FC<
	WebViewFormSubmitWithRedirectProps
> = ({ url, formData, submitConfirm }) => {
	const iframeRef = useRef<HTMLIFrameElement>(null);

	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			if (event.data?.type === 'FORM_SUBMIT') {
				const receivedData = event.data.data;
				if (receivedData) {
					submitConfirm(receivedData);
				}
			}
		};

		window.addEventListener('message', handleMessage);

		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, []);

	return (
		<Layout
			_heading={{
				heading: 'Complete Application',
			}}
			getBodyHeight={(height) =>
				(iframeRef.current!.style.height = `${height}px`)
			}
		>
			<iframe
				ref={iframeRef}
				src={url}
				style={{ width: '100%' }}
				title="Form UI"
				name={JSON.stringify(transformData(formData) ?? {})}
			></iframe>
		</Layout>
	);
};

export default WebViewFormSubmitWithRedirect;
