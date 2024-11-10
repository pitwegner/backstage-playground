from jinja2 import Template
import yaml

service_name = "document"
entity_name = "datatype"

exampleFailId = "d9460573-1f33-450a-8a24-6d73c3a7a008"
exampleSuccessId = "fe143bab-5f4c-48a6-96c1-7bb2ef8d60af"
exampleObject = {
    "id": exampleSuccessId,
    "created_at": "2012-04-23T18:25:43.511Z",
    "name": "contact_number",
    "display_name": "Kontaktnummer",
    "datatype": "phone_number",
    "owner": "frontend",
    "usage": "ENTITY",
}
exampleFailObject = {
    "id": exampleFailId,
    "created_at": "2012-04-23T18:25:43.511Z",
    "name": "invoice_total",
    "display_name": "Rechnunssumme",
    "datatype": "currency",
    "owner": "frontend",
    "usage": "ENTTY",
}
objectSchema = {
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "format": "uuid",
        },
        "created_at": {
            "type": "string",
            "format": "datetime",
        },
        "name": {
            "type": "string",
        },
        "display_name": {
            "type": "string",
        },
        "datatype": {
            "type": "string",
        },
        "owner": {
            "type": "string",
            "format": "servicename",
        },
        "usage": {
            "type": "string",
            "enum": ["ENTITY", "INTERNAL", "VISIBLE", "READONLY"]
        },
    }
}
create_required_attributes = ["name", "display_name", "datatype", "usage"]
create_id_attribute = objectSchema["properties"]["name"]
update_attribute = "usage"

create_schema = {
    **objectSchema,
    "required": create_required_attributes
}

create_example = {k: exampleObject[k] for k in create_required_attributes}
create_fail_example = {k: exampleFailObject[k] for k in create_required_attributes}

update_schema = {
    "type": "object",
    "properties": {
        "id": objectSchema["properties"]["id"],
        "update": {
            "type": "object",
            "properties": {k: v for k, v in objectSchema["properties"].items() if k != 'id'}
        }
    }
}

update_example = {
    "id": exampleSuccessId,
    "update": {
        update_attribute: exampleObject[update_attribute]
    }
}

update_fail_example1 = {
    "id": exampleFailId,
    "update": {
        update_attribute: exampleObject[update_attribute]
    }
}

update_fail_example2 = {
    "id": exampleFailId,
    "update": {
        update_attribute: exampleFailObject[update_attribute]
    }
}

fetch_example = {
    "id[eq]": exampleSuccessId
}

fetch_fail_example1 = {
    "display_name[eq]": exampleFailObject[update_attribute],
    "order_by": "usage"
}

fetch_fail_example2 = {
    "srt": "test"
}

with open("openapi-crud.yaml.j2", "r") as f:
    template = Template(f.read())
    render = template.render(
        service=service_name,
        entity=entity_name,
        exampleObject=yaml.dump(exampleObject),
        responseSchema=yaml.dump(objectSchema),
        createSchema=yaml.dump(create_schema),
        updateSchema=yaml.dump(update_schema),
        createExample=yaml.dump(create_example),
        createFailExample=yaml.dump(create_fail_example),
        update_example=yaml.dump(update_example),
        update_fail_example1=yaml.dump(update_fail_example1),
        update_fail_example2=yaml.dump(update_fail_example2),
        fetch_example=yaml.dump(fetch_example),
        fetch_fail_example1=yaml.dump(fetch_fail_example1),
        fetch_fail_example2=yaml.dump(fetch_fail_example2),
        create_id_attribute=yaml.dump(create_id_attribute),
        exampleSuccessId=exampleSuccessId,
        exampleFailId=exampleFailId,
    )

with open("openapi-crud.yaml", "w") as f:
    f.write(render)
