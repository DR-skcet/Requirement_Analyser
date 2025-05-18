import os
import json
import pandas as pd
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4


# Mapping to IEEE 830 and ISO 9126
def map_to_standards(requirements_dict):
    mapping = {
        "Functional Requirements": {"IEEE": "3.2", "ISO": "Functionality"},
        "Non-Functional Requirements": {"IEEE": "3.3", "ISO": "Usability"},
        "Constraints": {"IEEE": "3.4", "ISO": "Portability"},
        "Assumptions": {"IEEE": "3.5", "ISO": "Maintainability"},
    }

    enriched = {}
    for section, values in requirements_dict.items():
        enriched[section] = {
            "tag": mapping.get(section, {}),
            "requirements": values
        }
    return enriched


# Export to JSON
def export_to_json(requirements_dict, output_path="output/requirements.json"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(requirements_dict, f, indent=4)
    return output_path


# Export to Excel
def export_to_excel(data, output_path):
    import pandas as pd
    from openpyxl import Workbook

    with pd.ExcelWriter(output_path, engine="openpyxl") as writer:
        if not data:
            # Write an empty sheet with a message
            pd.DataFrame(["No requirements extracted"]).to_excel(writer, sheet_name="Sheet1", index=False, header=False)
        else:
            for category, reqs in data.items():
                df = pd.DataFrame(reqs, columns=["Requirement"])
                # Avoid sheet name length > 31 characters
                sheet_name = category[:31]
                df.to_excel(writer, sheet_name=sheet_name, index=False)


# Export to PDF
def export_to_pdf(requirements_dict, output_path="output/requirements.pdf"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    doc = SimpleDocTemplate(output_path, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []

    for section, content in requirements_dict.items():
        tag = content["tag"]
        story.append(Paragraph(f"<b>{section}</b>", styles["Heading2"]))
        story.append(Paragraph(f"IEEE: {tag.get('IEEE', 'N/A')} | ISO: {tag.get('ISO', 'N/A')}", styles["Normal"]))
        story.append(Spacer(1, 6))

        for item in content["requirements"]:
            story.append(Paragraph(f"- {item}", styles["Normal"]))
        story.append(Spacer(1, 12))

    doc.build(story)
    return output_path
