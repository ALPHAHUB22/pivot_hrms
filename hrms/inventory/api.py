import frappe

# Form View APIs
@frappe.whitelist()
def get_doctype_fields(doctype, field_list):
    fields = frappe.get_meta(doctype).fields
    return [
        field
        for field in fields
        if field.fieldname in field_list
    ]

@frappe.whitelist()
def get_item_info(limit:int):
    item_info = frappe.db.get_all("Item", {"disabled":0}, ["name", "item_code", "stock_uom", "opening_stock"], limit=limit)
    return item_info