// This config holds the fields that should be shown in the request summary action sheet
// TODO: This should be config-driven somehow

export const ITEM_FIELDS = [
	{
		fieldname: "name",
		label: "ID",
		fieldtype: "Link",
	},
	{
		fieldname: "item_code",
		label: "Item Tite",
		fieldtype: "Data",
	},
	{
		fieldname: "custom_building",
		label: "Building",
		fieldtype: "Data",
	},
	{
		fieldname: "custom_floor",
		label: "Floor",
		fieldtype: "Data",
	},
]

export const EXPENSE_CLAIM_FIELDS = [
	{
		fieldname: "name",
		label: "ID",
		fieldtype: "Data",
	},
	{
		fieldname: "posting_date",
		label: "Posting Date",
		fieldtype: "Date",
	},
	{
		fieldname: "employee",
		label: "Employee",
		fieldtype: "Link",
	},
	{
		fieldname: "expenses",
		label: "Expenses",
		fieldtype: "Table",
		componentName: "ExpenseItems",
	},
	{
		fieldname: "total_claimed_amount",
		label: "Total Claimed Amount",
		fieldtype: "Currency",
	},
	{
		fieldname: "total_sanctioned_amount",
		label: "Total Sanctioned Amount",
		fieldtype: "Currency",
	},
	{
		fieldname: "total_taxes_and_charges",
		label: "Total Taxes and Charges",
		fieldtype: "Currency",
	},
	{
		fieldname: "total_advance_amount",
		label: "Total Advance Amount",
		fieldtype: "Currency",
	},
	{
		fieldname: "grand_total",
		label: "Grand Total",
		fieldtype: "Currency",
	},
	{
		fieldname: "status",
		label: "Status",
		fieldtype: "Select",
	},
	{
		fieldname: "approval_status",
		label: "Approval Status",
		fieldtype: "Select",
	},
]
