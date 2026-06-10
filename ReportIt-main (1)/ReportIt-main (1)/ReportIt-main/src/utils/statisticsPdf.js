import jsPDF from "jspdf";

const page = {
  width: 210,
  height: 297,
  margin: 14,
};

const colors = {
  ink: [20, 28, 55],
  muted: [96, 111, 150],
  line: [205, 213, 232],
  blue: [0, 162, 220],
  panel: [245, 248, 253],
};

const safe = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return String(value);
};

const formatDateTime = (date = new Date()) =>
  date.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const addPageIfNeeded = (pdf, y, neededHeight = 20) => {
  if (y + neededHeight <= page.height - page.margin) {
    return y;
  }
  pdf.addPage();
  return page.margin;
};

const sectionTitle = (pdf, title, y) => {
  y = addPageIfNeeded(pdf, y, 16);
  pdf.setTextColor(...colors.ink);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text(title, page.margin, y);
  pdf.setDrawColor(...colors.blue);
  pdf.setLineWidth(0.6);
  pdf.line(page.margin, y + 3, page.width - page.margin, y + 3);
  return y + 10;
};

const drawHeader = (pdf, title, subtitle) => {
  pdf.setDrawColor(8, 13, 40);
  pdf.setLineWidth(0.8);
  pdf.rect(6, 6, page.width - 12, page.height - 12);
  pdf.setFillColor(8, 13, 40);
  pdf.rect(0, 0, page.width, 34, "F");
  pdf.setFillColor(...colors.blue);
  pdf.setDrawColor(...colors.blue);
  pdf.roundedRect(page.margin, 8, 11, 14, 2, 2, "FD");
  pdf.setFillColor(8, 13, 40);
  pdf.triangle(page.margin + 2.5, 10, page.margin + 8.5, 10, page.margin + 5.5, 19, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text(title, page.margin + 16, 15);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(subtitle, page.margin + 16, 23);
  pdf.text(`Generated: ${formatDateTime()}`, page.margin + 16, 29);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 191, 255);
  pdf.setFontSize(12);
  pdf.text("ReportIt", page.width - page.margin - 24, 15);
  return 46;
};

const drawSummaryCards = (pdf, items, y) => {
  y = sectionTitle(pdf, "Overall Summary", y);
  const gap = 4;
  const cardWidth = (page.width - page.margin * 2 - gap * 3) / 4;
  const cardHeight = 26;

  items.forEach((item, index) => {
    const x = page.margin + index * (cardWidth + gap);
    pdf.setFillColor(...colors.panel);
    pdf.setDrawColor(...colors.line);
    pdf.roundedRect(x, y, cardWidth, cardHeight, 2, 2, "FD");
    pdf.setTextColor(...colors.muted);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.text(item.label, x + 4, y + 8, { maxWidth: cardWidth - 8 });
    pdf.setTextColor(...colors.ink);
    pdf.setFontSize(16);
    pdf.text(safe(item.value), x + 4, y + 20);
  });

  return y + cardHeight + 12;
};

const drawTable = (pdf, title, columns, rows, y) => {
  y = sectionTitle(pdf, title, y);
  const tableWidth = page.width - page.margin * 2;
  const headerHeight = 9;
  const rowHeight = 8;
  const colWidth = tableWidth / columns.length;

  y = addPageIfNeeded(pdf, y, headerHeight + rowHeight);
  pdf.setFillColor(12, 20, 53);
  pdf.setDrawColor(...colors.line);
  pdf.rect(page.margin, y, tableWidth, headerHeight, "FD");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  columns.forEach((column, index) => {
    pdf.text(column, page.margin + index * colWidth + 3, y + 6);
  });
  y += headerHeight;

  const normalizedRows = rows.length > 0 ? rows : [["No data available"]];
  normalizedRows.forEach((row, rowIndex) => {
    y = addPageIfNeeded(pdf, y, rowHeight + 8);
    pdf.setFillColor(rowIndex % 2 === 0 ? 255 : 248, rowIndex % 2 === 0 ? 255 : 250, rowIndex % 2 === 0 ? 255 : 254);
    pdf.setDrawColor(...colors.line);
    pdf.rect(page.margin, y, tableWidth, rowHeight, "FD");
    pdf.setTextColor(...colors.ink);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);

    columns.forEach((_, index) => {
      const text = safe(row[index]);
      pdf.text(text, page.margin + index * colWidth + 3, y + 5.5, {
        maxWidth: colWidth - 6,
      });
    });
    y += rowHeight;
  });

  return y + 10;
};

const addNotes = (pdf, notes, y) => {
  y = sectionTitle(pdf, "Report Notes", y);
  pdf.setTextColor(...colors.ink);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  notes.forEach((note) => {
    y = addPageIfNeeded(pdf, y, 10);
    const lines = pdf.splitTextToSize(`- ${note}`, page.width - page.margin * 2);
    pdf.text(lines, page.margin, y);
    y += lines.length * 5 + 2;
  });
  return y;
};

const trendRows = (items, firstColumnLabel) =>
  (items || []).map((item) => {
    const total = Number(item.total ?? item.cases ?? item.complaints ?? 0);
    const resolved = Number(item.resolved ?? 0);
    const pending = Number(item.pending ?? Math.max(total - resolved, 0));
    return [
      item.label || item[firstColumnLabel] || item.month || item.day,
      total,
      resolved,
      pending,
    ];
  });

export const exportStatisticsPdf = ({
  reportTitle,
  generatedFor,
  fileName,
  summary,
  weeklyData = [],
  monthlyData = [],
  categoryData = [],
  statusData = [],
  officerPerformanceData = [],
}) => {
  const pdf = new jsPDF("p", "mm", "a4");
  let y = drawHeader(pdf, reportTitle, generatedFor);

  y = drawSummaryCards(pdf, summary, y);

  y = drawTable(
    pdf,
    "Weekly Report Details",
    ["Week / Day", "Total", "Resolved", "Pending"],
    trendRows(weeklyData, "day"),
    y
  );

  y = drawTable(
    pdf,
    "Monthly Report Details",
    ["Month", "Total", "Resolved", "Pending"],
    trendRows(monthlyData, "month"),
    y
  );

  if (categoryData.length > 0) {
    y = drawTable(
      pdf,
      "Category Summary",
      ["Category", "Total"],
      categoryData.map((item) => [item.label, item.total ?? item.value ?? 0]),
      y
    );
  }

  if (statusData.length > 0) {
    y = drawTable(
      pdf,
      "Status Summary",
      ["Status", "Total"],
      statusData.map((item) => [item.label, item.total ?? item.value ?? 0]),
      y
    );
  }

  if (officerPerformanceData.length > 0) {
    y = drawTable(
      pdf,
      "Officer Performance Summary",
      ["Officer", "Assigned", "Resolved"],
      officerPerformanceData.map((item) => [
        item.officerName || item.label,
        item.assigned ?? item.total ?? 0,
        item.resolved ?? 0,
      ]),
      y
    );
  }

  addNotes(
    pdf,
    [
      "All values are fetched from the ReportIt backend analytics APIs.",
      "Weekly and monthly details include the data currently available in the database.",
      "Resolution rate is calculated from resolved cases against total cases.",
    ],
    y
  );

  pdf.save(fileName);
};
