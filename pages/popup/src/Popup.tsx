import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { ErrorDisplay, LoadingSpinner } from '@extension/ui';

const StaxxerLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="120" height="20" viewBox="0 0 147.484 23.46">
    <g transform="translate(0 4.929)">
      <path
        d="M-4263.622-874.916h3.435c0,1.4,1.246,2.6,3.246,2.6,2.038,0,3.284-1.019,3.284-2.34,0-1.17-.943-1.774-2.265-2.076l-2.378-.567c-3.284-.868-4.793-2.566-4.793-5.17,0-2.869,2.6-5.246,6.265-5.246,3.019,0,6.266,1.585,6.266,5.284h-3.548a2.455,2.455,0,0,0-2.642-2.151,2.385,2.385,0,0,0-2.6,2.227c0,1.094,1.02,1.7,2.114,1.962l2.68.642c3.775.943,4.6,3.284,4.6,5.171,0,3.359-3.321,5.4-6.944,5.4C-4260.187-869.179-4263.546-871.217-4263.622-874.916Z"
        transform="translate(4263.622 887.71)"
        fill="#1a1a1a"
      />
      <path
        d="M-4122.284-887.257h3.7v17.625h-3.7v-2.981a7.144,7.144,0,0,1-6.265,3.434c-4.6,0-8.568-3.85-8.568-9.285,0-5.245,3.737-9.246,8.719-9.246a6.882,6.882,0,0,1,6.114,3.1Zm-.038,8.794a5.773,5.773,0,0,0-5.662-5.774,5.605,5.605,0,0,0-5.4,5.774,5.628,5.628,0,0,0,5.472,5.812A5.722,5.722,0,0,0-4122.322-878.464Z"
        transform="translate(4175.042 887.71)"
        fill="#1a1a1a"
      />
      <path
        d="M-4031.744-868.575h-4.416l-4.717-6.6-4.756,6.6h-4.378l6.982-9.662-5.775-7.963h4.491l3.435,4.944,3.472-4.944h4.453l-5.774,7.963Z"
        transform="translate(4114.049 886.653)"
        fill="#1a1a1a"
      />
      <path d="M-3965.707-868.575h-4.378l12.605-17.625h4.454Z" transform="translate(4058.086 886.653)" fill="#1a1a1a" />
      <path
        d="M-3874.435-876.954h-14.04c.491,2.868,2.6,4.341,5.435,4.341a5.745,5.745,0,0,0,4.981-2.567l2.944,1.472a8.921,8.921,0,0,1-8.077,4.529,8.9,8.9,0,0,1-9.1-9.322,8.851,8.851,0,0,1,9.1-9.209c5.02,0,8.832,3.623,8.832,9.171C-3874.359-878.048-3874.4-877.52-3874.435-876.954Zm-3.624-2.981a4.809,4.809,0,0,0-5.095-4.341,4.939,4.939,0,0,0-5.284,4.341Z"
        transform="translate(4003.611 887.71)"
        fill="#1a1a1a"
      />
      <circle cx="2.558" cy="2.558" r="2.558" transform="translate(99.343 13.272)" fill="#1a1a1a" />
      <circle cx="2.878" cy="2.878" r="2.878" transform="translate(88.47 0.48)" fill="#1a1a1a" />
      <circle cx="2.878" cy="2.878" r="2.878" transform="translate(99.08 12.632)" fill="#1a1a1a" />
    </g>
    <path
      d="M-4193.863-896.392h-2.192v-3.137h2.192v-4.621h3.879v4.621h4.521v3.137h-4.521V-886.1c0,1.383.54,1.956,2.159,1.956h2.361v3.2h-3.036c-3.306,0-5.364-1.383-5.364-5.161Z"
      transform="translate(4216.312 904.15)"
      fill="#1a1a1a"
    />
    <path
      d="M-3799.217-870.134h-3.846v-18.586h3.846v2.7a6.054,6.054,0,0,1,5.565-3v3.98h-.978c-2.833,0-4.587,1.181-4.587,5.127Z"
      transform="translate(3941.136 893.558)"
      fill="#1a1a1a"
    />
  </svg>
);

const Popup = () => (
  <div className="popup-page">
    <header className="popup-page__header">
      <div className="popup-page__logo">
        <StaxxerLogo />
      </div>
    </header>

    <main className="popup-page__content">
      <div className="popup-page__text">
        <p>Follow these steps to download your Amazon Seller Fee invoices:</p>
        <ol>
          <li>
            <span>
              Go to{' '}
              <a
                href="https://sellercentral.amazon.de/tax/seller-fee-invoices"
                target="_blank"
                rel="noopener noreferrer"
                className="link">
                Amazon Seller Central Fee Invoices
              </a>
            </span>
          </li>
          <li>
            <span>Select the date range for the invoices you want to download</span>
          </li>
          <li>
            <span>Click the Staxxer button that appears on the right side of the page</span>
          </li>
          <li>
            <span>Filter the invoices if needed</span>
          </li>
          <li>
            <span>Click "Download" to get your invoices as a ZIP file</span>
          </li>
        </ol>
      </div>
    </main>

    <footer className="popup-page__footer">
      <a href="https://staxxer.com" target="_blank" rel="noopener noreferrer">
        staxxer.com
      </a>
      <a href="mailto:support@staxxer.com" className="link">
        Need help?
      </a>
    </footer>
  </div>
);

export default withErrorBoundary(withSuspense(Popup, <LoadingSpinner />), ErrorDisplay);
