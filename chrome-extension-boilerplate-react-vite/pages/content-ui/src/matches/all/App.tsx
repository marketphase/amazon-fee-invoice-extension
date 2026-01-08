import { useState, useEffect } from 'react';
import { zipSync } from 'fflate';

const StaxxerLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="16" viewBox="0 0 147.484 23.46">
    <g transform="translate(0 4.929)">
      <path d="M-4263.622-874.916h3.435c0,1.4,1.246,2.6,3.246,2.6,2.038,0,3.284-1.019,3.284-2.34,0-1.17-.943-1.774-2.265-2.076l-2.378-.567c-3.284-.868-4.793-2.566-4.793-5.17,0-2.869,2.6-5.246,6.265-5.246,3.019,0,6.266,1.585,6.266,5.284h-3.548a2.455,2.455,0,0,0-2.642-2.151,2.385,2.385,0,0,0-2.6,2.227c0,1.094,1.02,1.7,2.114,1.962l2.68.642c3.775.943,4.6,3.284,4.6,5.171,0,3.359-3.321,5.4-6.944,5.4C-4260.187-869.179-4263.546-871.217-4263.622-874.916Z" transform="translate(4263.622 887.71)" fill="#1a1a1a"/>
      <path d="M-4122.284-887.257h3.7v17.625h-3.7v-2.981a7.144,7.144,0,0,1-6.265,3.434c-4.6,0-8.568-3.85-8.568-9.285,0-5.245,3.737-9.246,8.719-9.246a6.882,6.882,0,0,1,6.114,3.1Zm-.038,8.794a5.773,5.773,0,0,0-5.662-5.774,5.605,5.605,0,0,0-5.4,5.774,5.628,5.628,0,0,0,5.472,5.812A5.722,5.722,0,0,0-4122.322-878.464Z" transform="translate(4175.042 887.71)" fill="#1a1a1a"/>
      <path d="M-4031.744-868.575h-4.416l-4.717-6.6-4.756,6.6h-4.378l6.982-9.662-5.775-7.963h4.491l3.435,4.944,3.472-4.944h4.453l-5.774,7.963Z" transform="translate(4114.049 886.653)" fill="#1a1a1a"/>
      <path d="M-3965.707-868.575h-4.378l12.605-17.625h4.454Z" transform="translate(4058.086 886.653)" fill="#1a1a1a"/>
      <path d="M-3874.435-876.954h-14.04c.491,2.868,2.6,4.341,5.435,4.341a5.745,5.745,0,0,0,4.981-2.567l2.944,1.472a8.921,8.921,0,0,1-8.077,4.529,8.9,8.9,0,0,1-9.1-9.322,8.851,8.851,0,0,1,9.1-9.209c5.02,0,8.832,3.623,8.832,9.171C-3874.359-878.048-3874.4-877.52-3874.435-876.954Zm-3.624-2.981a4.809,4.809,0,0,0-5.095-4.341,4.939,4.939,0,0,0-5.284,4.341Z" transform="translate(4003.611 887.71)" fill="#1a1a1a"/>
      <circle cx="2.558" cy="2.558" r="2.558" transform="translate(99.343 13.272)" fill="#1a1a1a"/>
      <circle cx="2.878" cy="2.878" r="2.878" transform="translate(88.47 0.48)" fill="#1a1a1a"/>
      <circle cx="2.878" cy="2.878" r="2.878" transform="translate(99.08 12.632)" fill="#1a1a1a"/>
    </g>
    <path d="M-4193.863-896.392h-2.192v-3.137h2.192v-4.621h3.879v4.621h4.521v3.137h-4.521V-886.1c0,1.383.54,1.956,2.159,1.956h2.361v3.2h-3.036c-3.306,0-5.364-1.383-5.364-5.161Z" transform="translate(4216.312 904.15)" fill="#1a1a1a"/>
    <path d="M-3799.217-870.134h-3.846v-18.586h3.846v2.7a6.054,6.054,0,0,1,5.565-3v3.98h-.978c-2.833,0-4.587,1.181-4.587,5.127Z" transform="translate(3941.136 893.558)" fill="#1a1a1a"/>
  </svg>
);

interface Invoice {
  invoiceType: string;
  invoiceNumber: string;
  date: string;
  marketplace: string;
  // Data needed for PDF download
  documentVersionId: string;
  endDate: string;
  fileType: string;
  filterName: string;
  vatInvoiceNumber: string;
  payeeRegistrationNumber: string;
}

function parseInvoicesFromPage(): Invoice[] {
  const invoices: Invoice[] = [];

  // Find all View buttons - the actual button element has the data attributes
  const viewButtons = document.querySelectorAll('button[id="view_invoice_button-announce"]');

  viewButtons.forEach((button) => {
    const btn = button as HTMLElement;
    const row = btn.closest('tr');
    if (!row) return;

    // Get only cells with class "info" (skip hidden inputs)
    const infoCells = row.querySelectorAll('td.info');
    const cellTexts = Array.from(infoCells).map(cell => cell.textContent?.trim() || '');

    // Extract data attributes from button
    const dataset = btn.dataset;

    // Cell indices for .info cells:
    // 0: Invoice Type, 1: File Type, 2: Invoice Number, 3: Payer,
    // 4: VAT Number, 5: Issuer, 6: Registration, 7: Marketplace,
    // 8: Start Date, 9: End Date
    invoices.push({
      invoiceType: cellTexts[0] || '',
      invoiceNumber: dataset.invoice || cellTexts[2] || '',
      date: cellTexts[8] || '', // Start Date
      marketplace: cellTexts[7] || '',
      documentVersionId: btn.getAttribute('value') || dataset.value || '',
      endDate: dataset.enddate || cellTexts[9] || '',
      fileType: dataset.filetype || 'PDF',
      filterName: dataset.filtername || '',
      vatInvoiceNumber: dataset.invoice || '',
      payeeRegistrationNumber: dataset.payeeregistrationnumber || '',
    });
  });

  console.log('[Staxxer] Found invoices:', invoices);
  return invoices;
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });
  const [marketplaceFilter, setMarketplaceFilter] = useState<string>('');
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');

  // Parse invoices when sidebar opens
  useEffect(() => {
    if (isOpen) {
      const parsed = parseInvoicesFromPage();
      setInvoices(parsed);
      // Reset filters when reopening
      setMarketplaceFilter('');
      setStartDateFilter('');
      setEndDateFilter('');
    }
  }, [isOpen]);

  // Parse date string like "Sun Jun 01 16:52:09 UTC 2025" to Date object
  const parseInvoiceDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  // Get unique marketplaces from invoices (only real Amazon marketplaces)
  const isValidMarketplace = (mp: string) => /^Amazon\.(com|co\.|ca|de|fr|it|es|nl|pl|se|in|sg|ae|sa|br|mx|com\.)/.test(mp);
  const marketplaces = [...new Set(invoices.map(inv => inv.marketplace).filter(mp => mp && isValidMarketplace(mp)))].sort();

  // Filter invoices based on selected filters
  const filteredInvoices = invoices.filter(inv => {
    // Marketplace filter
    if (marketplaceFilter && inv.marketplace !== marketplaceFilter) {
      return false;
    }

    // Date range filter (using invoice start date)
    const invoiceDate = parseInvoiceDate(inv.date);
    if (invoiceDate) {
      if (startDateFilter) {
        const startFilter = new Date(startDateFilter);
        if (invoiceDate < startFilter) return false;
      }
      if (endDateFilter) {
        const endFilter = new Date(endDateFilter);
        endFilter.setHours(23, 59, 59, 999); // Include the entire end day
        if (invoiceDate > endFilter) return false;
      }
    }

    return true;
  });

  const handleDownloadAll = async () => {
    if (filteredInvoices.length === 0 || isDownloading) return;

    const invoicesToDownload = filteredInvoices;

    setIsDownloading(true);
    setDownloadProgress({ current: 0, total: invoicesToDownload.length });

    const pdfFiles: { [filename: string]: Uint8Array } = {};
    const errors: string[] = [];

    for (let i = 0; i < invoicesToDownload.length; i++) {
      const invoice = invoicesToDownload[i];

      try {
        // Call Amazon's API to get the presigned PDF URL
        const response = await fetch(`https://${window.location.hostname}/tax/view-seller-fee-invoice-execute`, {
          method: 'POST',
          headers: {
            'accept': '*/*',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            documentVersionId: invoice.documentVersionId,
            endDate: invoice.endDate,
            fileType: invoice.fileType,
            filterName: invoice.filterName,
            vatInvoiceNumber: invoice.vatInvoiceNumber,
            payeeRegistrationNumber: invoice.payeeRegistrationNumber,
          }),
          mode: 'cors',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.url) {
          // Fetch the actual PDF from the presigned URL
          const pdfResponse = await fetch(data.url);
          if (!pdfResponse.ok) {
            throw new Error(`PDF fetch failed: ${pdfResponse.status}`);
          }

          const pdfBuffer = await pdfResponse.arrayBuffer();
          const filename = `${invoice.invoiceNumber || `invoice_${i + 1}`}.PDF`;
          pdfFiles[filename] = new Uint8Array(pdfBuffer);
        } else {
          throw new Error('No URL in response');
        }
      } catch (error) {
        console.error(`[Staxxer] Failed to download invoice ${invoice.invoiceNumber}:`, error);
        errors.push(invoice.invoiceNumber || `Invoice ${i + 1}`);
      }

      setDownloadProgress({ current: i + 1, total: invoicesToDownload.length });

      // Small delay between requests to avoid rate limiting
      if (i < invoicesToDownload.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    // Create ZIP file
    if (Object.keys(pdfFiles).length > 0) {
      try {
        const zipData = zipSync(pdfFiles);
        const blob = new Blob([zipData.buffer], { type: 'application/zip' });
        const url = URL.createObjectURL(blob);

        // Trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = `amazon-invoices-${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (errors.length > 0) {
          alert(`Downloaded ${Object.keys(pdfFiles).length} invoices. Failed: ${errors.join(', ')}`);
        }
      } catch (zipError) {
        console.error('[Staxxer] Failed to create ZIP:', zipError);
        alert('Failed to create ZIP file');
      }
    } else {
      alert(`Failed to download any invoices. Errors: ${errors.join(', ')}`);
    }

    setIsDownloading(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: '100px',
          right: isOpen ? '360px' : '0px',
          zIndex: 10000,
          width: '36px',
          height: '72px',
          backgroundColor: '#572ee9',
          border: 'none',
          borderTopLeftRadius: '6px',
          borderBottomLeftRadius: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'right 0.2s ease',
          boxShadow: '0 2px 8px rgba(87, 46, 233, 0.3)',
        }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
          {isOpen ? (
            <path d="M9 18l6-6-6-6" />
          ) : (
            <path d="M15 18l-6-6 6-6" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '360px',
          height: '100vh',
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
          zIndex: 9999,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.2s ease',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #e5e5e5',
          boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.08)',
        }}>
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e5e5e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <StaxxerLogo />
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e5e5' }}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: '#666666', display: 'block', marginBottom: '6px' }}>
              Marketplace
            </label>
            <select
              value={marketplaceFilter}
              onChange={(e) => setMarketplaceFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '13px',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                color: '#1a1a1a',
                cursor: 'pointer',
                outline: 'none',
              }}>
              <option value="">All Marketplaces</option>
              {marketplaces.map(mp => (
                <option key={mp} value={mp}>{mp}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', color: '#666666', display: 'block', marginBottom: '6px' }}>
                Start Date (after)
              </label>
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '13px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  color: '#1a1a1a',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', color: '#666666', display: 'block', marginBottom: '6px' }}>
                End Date (before)
              </label>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '13px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  color: '#1a1a1a',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>

        {/* Invoice Count & Download Button */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e5e5' }}>
          <div style={{ fontSize: '13px', color: '#666666', marginBottom: '12px' }}>
            {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''}
            {marketplaceFilter && ` for ${marketplaceFilter}`}
          </div>
          <button
            onClick={handleDownloadAll}
            disabled={isDownloading || filteredInvoices.length === 0}
            style={{
              width: '100%',
              padding: '10px 16px',
              backgroundColor: filteredInvoices.length > 0 ? '#572ee9' : '#e5e5e5',
              color: filteredInvoices.length > 0 ? '#ffffff' : '#999999',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: filteredInvoices.length > 0 ? 'pointer' : 'not-allowed',
              transition: 'opacity 0.2s',
              opacity: isDownloading ? 0.7 : 1,
            }}>
            {isDownloading
              ? `Downloading ${downloadProgress.current}/${downloadProgress.total}...`
              : `Download ${filteredInvoices.length} as ZIP`
            }
          </button>
        </div>

        {/* Invoice List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {filteredInvoices.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999999', fontSize: '13px' }}>
              {invoices.length === 0
                ? 'No invoices found. Make sure you\'re on the Seller Fee Invoices page.'
                : 'No invoices match the selected filter.'}
            </div>
          ) : (
            filteredInvoices.map((invoice, index) => (
              <div
                key={index}
                style={{
                  padding: '12px 20px',
                  borderBottom: '1px solid #f0f0f0',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#1a1a1a' }}>
                    {invoice.invoiceNumber || 'Unknown'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666666', backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>
                    {invoice.marketplace}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#666666', marginBottom: '4px' }}>
                  {invoice.invoiceType}
                </div>
                <div style={{ fontSize: '11px', color: '#999999' }}>
                  {invoice.date}{invoice.endDate && invoice.endDate !== invoice.date ? ` — ${invoice.endDate}` : ''}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #e5e5e5',
            fontSize: '11px',
            color: '#999999',
            textAlign: 'center',
          }}>
          Powered by Staxxer
        </div>
      </div>
    </>
  );
}
