const PDFDocument = require("pdfkit");

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasItems(value) {
  return Array.isArray(value) && value.length > 0;
}

function addSectionTitle(doc, title) {
  doc.moveDown(0.8);

  doc.fontSize(15).fillColor("#12294a").font("Helvetica-Bold").text(title);

  doc.moveDown(0.3);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#d9e2f0").stroke();

  doc.moveDown(0.5);
}

function addLabelValue(doc, label, value) {
  if (!hasText(value)) {
    return;
  }

  doc.fontSize(9).fillColor("#64748b").font("Helvetica-Bold").text(label);

  doc.fontSize(10).fillColor("#1e293b").font("Helvetica").text(value);

  doc.moveDown(0.35);
}

function addBulletList(doc, title, items) {
  if (!hasItems(items)) {
    return;
  }

  doc.fontSize(10).fillColor("#334155").font("Helvetica-Bold").text(title);

  doc.moveDown(0.2);

  for (const item of items) {
    if (!hasText(item)) {
      continue;
    }

    doc.fontSize(10).fillColor("#475569").font("Helvetica").text(`• ${item}`, {
      indent: 12,
      lineGap: 2,
    });

    doc.moveDown(0.15);
  }

  doc.moveDown(0.3);
}

function addRecommendation(doc, recommendation, index) {
  doc
    .fontSize(13)
    .fillColor("#2f6fe4")
    .font("Helvetica-Bold")
    .text(
      `${index + 1}. ${
        hasText(recommendation.standardNumber)
          ? recommendation.standardNumber
          : "Indian Standard"
      }`,
    );

  if (hasText(recommendation.title)) {
    doc
      .moveDown(0.15)
      .fontSize(12)
      .fillColor("#12294a")
      .font("Helvetica-Bold")
      .text(recommendation.title);
  }

  doc.moveDown(0.3);

  if (hasText(recommendation.applicability)) {
    addLabelValue(doc, "Applicability", recommendation.applicability);
  }

  if (recommendation.relevance && hasText(recommendation.relevance.level)) {
    addLabelValue(doc, "Relevance", recommendation.relevance.level);
  }

  if (hasText(recommendation.reason)) {
    addLabelValue(doc, "Why recommended", recommendation.reason);
  }

  if (recommendation.version) {
    const version = recommendation.version;

    if (hasText(version.edition)) {
      addLabelValue(doc, "Edition", version.edition);
    }

    if (typeof version.year === "number" && version.year > 0) {
      addLabelValue(doc, "Year", String(version.year));
    }

    if (hasText(version.status)) {
      addLabelValue(doc, "Current status", version.status);
    }

    if (version.latestAmendment) {
      const amendment = version.latestAmendment;

      const amendmentText = [
        hasText(amendment.amendmentNumber)
          ? `Amendment ${amendment.amendmentNumber}`
          : "",
        hasText(amendment.date) ? amendment.date : "",
        hasText(amendment.title) ? amendment.title : "",
      ]
        .filter(Boolean)
        .join(" · ");

      if (amendmentText) {
        addLabelValue(doc, "Latest amendment", amendmentText);
      }
    }
  }

  if (recommendation.certification) {
    const certification = recommendation.certification;

    if (hasText(certification.status)) {
      addLabelValue(doc, "Certification status", certification.status);
    }

    if (hasText(certification.scheme)) {
      addLabelValue(doc, "Certification scheme", certification.scheme);
    }

    if (typeof certification.mandatory === "boolean") {
      addLabelValue(doc, "Mandatory", certification.mandatory ? "Yes" : "No");
    }

    if (typeof certification.crsApplicable === "boolean") {
      addLabelValue(
        doc,
        "CRS applicable",
        certification.crsApplicable ? "Yes" : "No",
      );
    }

    if (typeof certification.hallmarkingApplicable === "boolean") {
      addLabelValue(
        doc,
        "Hallmarking applicable",
        certification.hallmarkingApplicable ? "Yes" : "No",
      );
    }

    if (hasText(certification.qualityControlOrder)) {
      addLabelValue(
        doc,
        "Quality Control Order",
        certification.qualityControlOrder,
      );
    }

    if (hasText(certification.note)) {
      addLabelValue(doc, "Compliance note", certification.note);
    }
  }

  if (recommendation.testing) {
    const testing = recommendation.testing;

    if (typeof testing.required === "boolean") {
      addLabelValue(doc, "Testing required", testing.required ? "Yes" : "No");
    }

    addBulletList(doc, "Test methods", testing.testMethods);

    addBulletList(doc, "Related test standards", testing.relatedTestStandards);

    addBulletList(
      doc,
      "Inspection requirements",
      testing.inspectionRequirements,
    );
  }

  if (recommendation.procurement) {
    const procurement = recommendation.procurement;

    if (typeof procurement.applicable === "boolean") {
      addLabelValue(
        doc,
        "Applicable to procurement",
        procurement.applicable ? "Yes" : "No",
      );
    }

    addBulletList(doc, "Recommended for", procurement.recommendedFor);

    addBulletList(doc, "Specification points", procurement.specificationPoints);

    addBulletList(doc, "Buyer considerations", procurement.buyerConsiderations);
  }

  if (hasItems(recommendation.relatedStandards)) {
    doc
      .fontSize(10)
      .fillColor("#334155")
      .font("Helvetica-Bold")
      .text("Related standards");

    doc.moveDown(0.2);

    for (const related of recommendation.relatedStandards) {
      const parts = [
        hasText(related.standardNumber) ? related.standardNumber : "",
        hasText(related.title) ? related.title : "",
        hasText(related.relationship) ? related.relationship : "",
        hasText(related.reason) ? related.reason : "",
      ].filter(Boolean);

      if (parts.length > 0) {
        doc
          .fontSize(10)
          .fillColor("#475569")
          .font("Helvetica")
          .text(`• ${parts.join(" — ")}`, {
            indent: 12,
            lineGap: 2,
          });

        doc.moveDown(0.15);
      }
    }

    doc.moveDown(0.3);
  }

  if (hasItems(recommendation.evidence)) {
    doc
      .fontSize(10)
      .fillColor("#334155")
      .font("Helvetica-Bold")
      .text("Evidence / sources");

    doc.moveDown(0.2);

    for (const evidence of recommendation.evidence) {
      const metadata = [
        hasText(evidence.source) ? evidence.source : "",
        hasText(evidence.standardNumber) ? evidence.standardNumber : "",
        evidence.page !== null && evidence.page !== undefined
          ? `Page ${evidence.page}`
          : "",
        evidence.chunkIndex !== null && evidence.chunkIndex !== undefined
          ? `Chunk ${evidence.chunkIndex}`
          : "",
      ]
        .filter(Boolean)
        .join(" · ");

      if (metadata) {
        doc
          .fontSize(9)
          .fillColor("#64748b")
          .font("Helvetica-Bold")
          .text(metadata);
      }

      if (hasText(evidence.excerpt)) {
        doc
          .fontSize(9)
          .fillColor("#475569")
          .font("Helvetica")
          .text(evidence.excerpt, {
            lineGap: 2,
          });
      }

      doc.moveDown(0.35);
    }
  }

  if (index < 1000) {
    doc.moveDown(0.6);
  }
}

function createPdfBuffer(history) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        info: {
          Title: "BIS Recommendation Engine Report",
          Author: "Bureau of Indian Standards Recommendation Engine",
          Subject: "Indian Standards Recommendation Report",
        },
      });

      const chunks = [];

      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });

      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", reject);

      const result = history.ragResponse || {};
      const tender = result.tenderRequirements || {};

      /* ======================================================
         COVER / TITLE
         ====================================================== */

      doc
        .fontSize(22)
        .fillColor("#12294a")
        .font("Helvetica-Bold")
        .text("BIS Recommendation Engine");

      doc
        .moveDown(0.35)
        .fontSize(15)
        .fillColor("#2f6fe4")
        .font("Helvetica-Bold")
        .text("Indian Standards Recommendation Report");

      doc.moveDown(0.8);

      doc
        .fontSize(9)
        .fillColor("#64748b")
        .font("Helvetica")
        .text(`Generated: ${new Date().toLocaleString("en-IN")}`);

      doc.moveDown(1);

      /* ======================================================
         ANALYSIS INFORMATION
         ====================================================== */

      addSectionTitle(doc, "1. Analysis Information");

      addLabelValue(doc, "Query / Tender", history.query);

      if (history.hasDocument) {
        addLabelValue(doc, "Input type", "Tender document");
      } else {
        addLabelValue(doc, "Input type", "Procurement query");
      }

      /* ======================================================
         SUMMARY
         ====================================================== */

      if (hasText(result.summary)) {
        addSectionTitle(doc, "2. Executive Summary");

        doc
          .fontSize(10)
          .fillColor("#334155")
          .font("Helvetica")
          .text(result.summary, {
            lineGap: 3,
          });
      }

      /* ======================================================
         TENDER REQUIREMENTS
         ====================================================== */

      const hasTenderData = isTenderAvailable(tender);

      if (hasTenderData) {
        addSectionTitle(doc, "3. Tender Requirements");

        addLabelValue(doc, "Product / Work", tender.product);

        addBulletList(doc, "Materials", tender.materials);

        addBulletList(doc, "Dimensions", tender.dimensions);

        addBulletList(doc, "Grades", tender.grades);

        addBulletList(
          doc,
          "Performance requirements",
          tender.performanceRequirements,
        );

        addBulletList(doc, "Testing requirements", tender.testingRequirements);

        addBulletList(
          doc,
          "Certification requirements",
          tender.certificationRequirements,
        );

        addBulletList(doc, "Intended uses", tender.uses);
      }

      /* ======================================================
         RECOMMENDATIONS
         ====================================================== */

      if (hasItems(result.recommendations)) {
        addSectionTitle(doc, "4. Recommended Indian Standards");

        result.recommendations.forEach((recommendation, index) => {
          addRecommendation(doc, recommendation, index);
        });
      }

      /* ======================================================
         WARNINGS
         ====================================================== */

      if (hasItems(result.warnings)) {
        addSectionTitle(doc, "5. Important Notices");

        result.warnings.forEach((warning) => {
          if (hasText(warning)) {
            doc
              .fontSize(10)
              .fillColor("#475569")
              .font("Helvetica")
              .text(`• ${warning}`, {
                indent: 12,
                lineGap: 2,
              });

            doc.moveDown(0.15);
          }
        });
      }

      /* ======================================================
         FOOTER
         ====================================================== */

      doc
        .moveDown(1)
        .fontSize(8)
        .fillColor("#94a3b8")
        .font("Helvetica")
        .text("Generated by BIS AI-powered Recommendation Engine", {
          align: "center",
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function isTenderAvailable(tender) {
  if (!tender || typeof tender !== "object") {
    return false;
  }

  return (
    hasText(tender.product) ||
    hasItems(tender.materials) ||
    hasItems(tender.dimensions) ||
    hasItems(tender.grades) ||
    hasItems(tender.performanceRequirements) ||
    hasItems(tender.testingRequirements) ||
    hasItems(tender.certificationRequirements) ||
    hasItems(tender.uses)
  );
}

module.exports = {
  createPdfBuffer,
};
