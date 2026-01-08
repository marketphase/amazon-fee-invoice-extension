import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { ErrorDisplay, LoadingSpinner } from '@extension/ui';

const Popup = () => {
  return (
    <div className="popup-page">
      <header className="popup-page__header">
        <div className="popup-page__logo">
          <img src={chrome.runtime.getURL('logo_wide.svg')} alt="Staxxer" />
        </div>
      </header>

      <main className="popup-page__content">
        <div className="popup-page__text">
          <p>Follow these steps to download your Amazon Seller Fee invoices:</p>
          <ol>
            <li>
              Go to{' '}
              <a
                href="https://sellercentral.amazon.com/tax/seller-fee-invoices"
                target="_blank"
                rel="noopener noreferrer"
                className="link">
                Amazon Seller Central Fee Invoices
              </a>
            </li>
            <li>Select the date range for the invoices you want to download</li>
            <li>Click the Staxxer button that appears on the page</li>
            <li>Select the invoices you want to download</li>
            <li>Click "Download" to get your invoices as PDF files</li>
          </ol>
        </div>
      </main>

      <footer className="popup-page__footer">
        <a href="https://staxxer.com" target="_blank" rel="noopener noreferrer">
          staxxer.com
        </a>
        <a href="https://staxxer.com/support" target="_blank" rel="noopener noreferrer" className="link">
          Need help?
        </a>
      </footer>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <LoadingSpinner />), ErrorDisplay);
