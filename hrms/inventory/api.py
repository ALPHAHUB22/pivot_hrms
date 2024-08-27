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
    item_info = frappe.db.get_all("Inventory Log", ["name", "item_code", "item_group", "uom", "qty", "building","floor","manufacturer","tag","depth","width","diameter","height"], limit=limit)
    # for item in item_info:
    #     file_url = frappe.db.get_value("File", {"attached_to_doctype": "Item", "attached_to_name": item["name"]}, "file_url", order_by="modified asc")
    #     if not file_url:
    #         file_url = frappe.db.get_value("File", {"file_name": "demo.jpg"}, "file_url", order_by="modified asc")
    #     item["image"] = file_url
    return item_info

@frappe.whitelist()
def get_warehouse_info(limit:int):
    building_info = frappe.db.get_all("Inventory Log", ["floor"], group_by="floor", limit=limit)
    return building_info

@frappe.whitelist()
def get_filter_values(filterSchema):
    filter_values = []
    for filter in filterSchema:
        if filter.get("fieldtype") == "Link":
            filter_name = filter.get("filterfieldname") or "name"
            doc = frappe.db.get_all(filter.get("options"), fields = filter_name, pluck=filter_name)
            filter_values.append({
                "fieldname" : filter.get("fieldname"),
                "values" : doc
            })
    return filter_values