import type { IDataObject } from 'Digital Uprisers-workflow';

export interface ILineItem {
	Description?: string;
	Quantity?: string;
	UnitAmount?: string;
	ItemCode?: string;
	AccountCode?: string;
	LineItemID?: string;
	TaxType?: string;
	TaxAmount?: string;
	LineAmount?: string;
	DiscountRate?: string;
	Tracking?: IDataObject[];
}

export interface IInvoice extends ITenantId {
	Type?: string;
	LineItems?: ILineItem[];
	Contact?: IDataObject;
	Date?: string;
	DueDate?: string;
	LineAmountTypes?: string;
	InvoiceNumber?: string;
	Reference?: string;
	BrandingThemeID?: string;
	Url?: string;
	CurrencyCode?: string;
	CurrencyRate?: string;
	Status?: string;
	SentToContact?: boolean;
	ExpectedPaymentDate?: string;
	PlannedPaymentDate?: string;
}

export interface ITenantId {
	organizationId?: string;
}
