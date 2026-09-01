from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak

pdfmetrics.registerFont(TTFont('Chinese', '/System/Library/Fonts/STHeiti Medium.ttc', subfontIndex=0))
OUT = 'public/downloads/企业出海前-跨境资金与税务核查清单.pdf'
NAVY, GREEN, PAPER, MUTED, LINE = map(HexColor, ['#15293f','#2f6b5e','#f3f1ea','#5c6670','#e7e3d9'])
styles = {
 'title': ParagraphStyle('title', fontName='Chinese', fontSize=26, leading=34, textColor=NAVY, spaceAfter=10),
 'sub': ParagraphStyle('sub', fontName='Chinese', fontSize=11, leading=17, textColor=MUTED, spaceAfter=18),
 'h': ParagraphStyle('h', fontName='Chinese', fontSize=15, leading=22, textColor=NAVY, spaceBefore=14, spaceAfter=8),
 'p': ParagraphStyle('p', fontName='Chinese', fontSize=10.5, leading=17, textColor=NAVY),
 'small': ParagraphStyle('small', fontName='Chinese', fontSize=8.5, leading=13, textColor=MUTED),
}
def row(no, title, items):
    content = '<br/>'.join('□ ' + x for x in items)
    return [Paragraph(no, styles['small']), Paragraph('<b>%s</b><br/>%s' % (title, content), styles['p'])]
story = [Paragraph('企业出海前：跨境资金与税务核查清单', styles['title']),
 Paragraph('用于帮助企业在开展跨境交易、供应链调整或境外主体安排前，初步整理事实、文件与待核实事项。', styles['sub'])]
data = [
 row('01', '主体与交易安排', ['确认境内外主体、股权关系与实际承担的职能。', '梳理货物流、资金流、合同流及信息流是否能够相互印证。', '明确各主体在采购、生产、销售、收款与售后中的角色。']),
 row('02', '合同、单证与留存', ['核对合同、订单、发票、物流与付款文件的关键信息是否一致。', '建立可追溯的版本、审批与留存机制。', '识别需要补充或更新的原产地、报关、付款或业务证明文件。']),
 row('03', '资金与账户', ['确认收付款路径、币种、付款用途与合同约定是否一致。', '预先准备银行可能要求的业务真实性与资金来源说明。', '避免以不完整、矛盾或无法对应的材料解释跨境交易。']),
 row('04', '税务与申报一致性', ['识别交易涉及的税种、申报口径与潜在信息交换风险。', '关注定价、服务内容、费用承担与主体功能之间是否匹配。', '对跨境支付、发票和会计处理建立必要的交叉核验。']),
 row('05', '供应链与原产地', ['如涉及迁移生产或采购，梳理加工步骤、关键材料与价值贡献。', '确认原产地判断、标签、报关与客户文件是否一致。', '涉及特定市场时，单独评估关税与贸易救济等要求。']),
]
t = Table(data, colWidths=[18*mm, 157*mm], repeatRows=0)
t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(0,-1),PAPER),('LINEBELOW',(0,0),(-1,-1),0.5,LINE),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),12),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10)]))
story += [t, Spacer(1, 15), Paragraph('使用提示', styles['h']), Paragraph('本清单用于内部初筛与问题整理，不构成法律、税务、外汇、海关或投资意见，也不替代结合具体事实作出的专业判断。涉及账户受限、税务申报、原产地、制裁或贸易救济等事项，应在处理前取得针对性的专业意见。', styles['p']), Spacer(1, 14), Paragraph('江恒律师 · 跨境税务与出海合规 | 公开联系邮箱：j.heng@hotmail.com', styles['small'])]
doc = SimpleDocTemplate(OUT, pagesize=A4, rightMargin=18*mm, leftMargin=18*mm, topMargin=18*mm, bottomMargin=18*mm)
doc.build(story)
