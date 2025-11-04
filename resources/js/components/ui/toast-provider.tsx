import { Toaster } from 'react-hot-toast';
import { toastDefaultOptions } from '@/lib/toast-config';

export default function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={toastDefaultOptions}
            containerClassName="toast-container"
            containerStyle={{
                top: '1rem',
                right: '1rem',
                gap: '0.75rem',
            }}
            gutter={12}
        />
    );
}
