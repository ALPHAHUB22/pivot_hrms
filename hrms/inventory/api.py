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
    item_info = frappe.db.get_all("Item", {"disabled":0}, ["name", "item_code", "stock_uom", "custom_qty"], limit=limit)
    return item_info

@frappe.whitelist()
def get_warehouse_info(limit:int):
    building_info = frappe.db.get_all("Item", ["custom_building"], group_by="custom_building", limit=limit)
    frappe.errprint([building_info])
    return building_info