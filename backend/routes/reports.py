import io
from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
import qrcode
from backend.database import db

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/qr-image/{recommendation_id}")
def generate_qr_code_image(recommendation_id: str):
    # QR contains report verification URL
    qr_content = f"https://packwise.ai/verify/{recommendation_id}"
    qr = qrcode.QRCode(version=1, box_size=8, border=2)
    qr.add_data(qr_content)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#245B35", back_color="#FFF8E7")
    
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    return StreamingResponse(img_byte_arr, media_type="image/png")

@router.get("/pdf/{recommendation_id}")
def generate_pdf_report(recommendation_id: str):
    # Find recommendation
    rec_data = None
    for item in db.history:
        if item["id"].upper() == recommendation_id.upper():
            rec_data = item["result_data"]
            break
    if not rec_data:
        for item in db.saved_recommendations:
            if item["id"].upper() == recommendation_id.upper():
                rec_data = item["result_data"]
                break

    if not rec_data:
        # Fallback to generating demo data if not found
        from backend.engine.recommendation import evaluate_recommendation
        rec_data = evaluate_recommendation({
            "commodity_name": "Tomato",
            "category": "Vegetables",
            "respiration_rate": "High",
            "storage_type": "Chilled"
        })
        rec_data["recommendation_id"] = recommendation_id

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        textColor=colors.HexColor('#245B35'),
        spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'SubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor('#7CB342'),
        spaceAfter=12
    )
    h2_style = ParagraphStyle(
        'H2Header',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=colors.HexColor('#245B35'),
        spaceBefore=10,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        textColor=colors.HexColor('#263238'),
        leading=13
    )

    elements = []

    # Header Title
    elements.append(Paragraph("PackWise AI — Packaging Recommendation Report", title_style))
    elements.append(Paragraph("Smarter Packaging. Better Food Protection. | SIH Problem Statement 26236", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#4CAF50'), spaceAfter=12))

    # Meta Info Box Table
    meta_table_data = [
        [Paragraph(f"<b>Report ID:</b> {rec_data['recommendation_id']}", body_style), Paragraph(f"<b>Date:</b> {rec_data['timestamp']}", body_style)],
        [Paragraph(f"<b>Commodity:</b> {rec_data['commodity_name']}", body_style), Paragraph(f"<b>Overall Score:</b> <font color='#245B35'><b>{rec_data['overall_score']}/100</b></font>", body_style)]
    ]
    t_meta = Table(meta_table_data, colWidths=[260, 260])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFF8E7')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#FFC107')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    elements.append(t_meta)
    elements.append(Spacer(1, 10))

    # Primary Recommendation
    mat = rec_data['primary_material']
    struct = rec_data['primary_structure']
    elements.append(Paragraph("Recommended Packaging Specification", h2_style))
    
    spec_table_data = [
        [Paragraph("<b>Primary Material</b>", body_style), Paragraph(mat['name'], body_style)],
        [Paragraph("<b>Structure Code</b>", body_style), Paragraph(struct['code_name'], body_style)],
        [Paragraph("<b>Layer Composition</b>", body_style), Paragraph(" / ".join(struct['layer_composition']), body_style)],
        [Paragraph("<b>WVTR Range</b>", body_style), Paragraph(rec_data['specifications']['water_vapor_transmission_rate_wvtr'], body_style)],
        [Paragraph("<b>OTR Range</b>", body_style), Paragraph(rec_data['specifications']['oxygen_transmission_rate_otr'], body_style)],
        [Paragraph("<b>Sealability</b>", body_style), Paragraph(rec_data['specifications']['sealability_rating'], body_style)],
        [Paragraph("<b>Recyclability</b>", body_style), Paragraph(mat['recyclability'], body_style)],
        [Paragraph("<b>Cost Tier</b>", body_style), Paragraph(mat['relative_cost'], body_style)]
    ]
    t_spec = Table(spec_table_data, colWidths=[150, 370])
    t_spec.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E0E0E0')),
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#F5F7F5')),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(t_spec)
    elements.append(Spacer(1, 10))

    # Why Selected
    elements.append(Paragraph("Technical Justification", h2_style))
    elements.append(Paragraph(rec_data['why_selected_explanation'], body_style))
    elements.append(Spacer(1, 10))

    # Score Breakdown Table
    elements.append(Paragraph("Compatibility Score Breakdown", h2_style))
    score_rows = [[Paragraph("<b>Criterion</b>", body_style), Paragraph("<b>Score</b>", body_style), Paragraph("<b>Evaluation Note</b>", body_style)]]
    for item in rec_data['score_breakdown']:
        score_rows.append([
            Paragraph(item['criterion'], body_style),
            Paragraph(f"{item['earned']}/{item['maximum']}", body_style),
            Paragraph(item['note'], body_style)
        ])
    t_score = Table(score_rows, colWidths=[160, 60, 300])
    t_score.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#245B35')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E0E0E0')),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t_score)
    elements.append(Spacer(1, 12))

    # Scientific Disclaimer
    elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#FF9800'), spaceAfter=8))
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        textColor=colors.HexColor('#E53935'),
        leading=11
    )
    elements.append(Paragraph(f"<b>Scientific Safety Note:</b> {rec_data['scientific_disclaimer']}", disclaimer_style))

    doc.build(elements)
    buffer.seek(0)

    return Response(
        content=buffer.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=PackWise_Report_{recommendation_id}.pdf"}
    )
