import React, { useEffect, useRef } from 'react';
import Layout from './common/layout/Layout';
import { removeNullKeysTopLevel } from '../utils/jsHelper/helper';
interface FormData {
	[key: string]: string | null | undefined;
}
interface WebViewFormSubmitWithRedirectProps {
	url?: string;
	formData?: FormData;
	submitConfirm?: (content: string) => void;
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
				name={JSON.stringify(removeNullKeysTopLevel(formData ?? {}))}
			></iframe>
		</Layout>
	);
};

export default WebViewFormSubmitWithRedirect;
