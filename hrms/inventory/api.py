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
    item_info = frappe.db.get_all("Item", {"disabled":0}, ["name", "item_code", "item_group", "stock_uom", "custom_qty", "custom_building","custom_floor","custom_manufacturer","custom_tag","custom_depth","custom_width","custom_diameter","custom_height"], limit=limit)
    for item in item_info:
        file_url = frappe.db.get_value("File", {"attached_to_doctype": "Item", "attached_to_name": item["name"]}, "file_url", order_by="modified asc")
        if not file_url:
            file_url = frappe.db.get_value("File", {"file_name": "demo.jpg"}, "file_url", order_by="modified asc")
        item["image"] = file_url
    return item_info

@frappe.whitelist()
def get_warehouse_info(limit:int):
    building_info = frappe.db.get_all("Item", ["custom_building"], group_by="custom_building", limit=limit)
    frappe.errprint([building_info])
    return building_info