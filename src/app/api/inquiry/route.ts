import { inquirySchema, labelFor, lookingForOptions, requestTypes } from "@/lib/forms/inquiry-schema";
import { handleSubmission } from "@/lib/server/submission";

export async function POST(request: Request) {
  return handleSubmission(request, {
    kind: "inquiry",
    prefix: "MVQ",
    schema: inquirySchema,
    toLead: (d, reference) => {
      const lookingFor = labelFor(lookingForOptions, d.lookingFor);
      const request = labelFor(requestTypes, d.requestType);
      return {
        kind: "inquiry",
        id: reference,
        replyTo: d.email,
        subject: `${request} — ${d.company} · ${lookingFor}`,
        sections: [
          {
            heading: "Contact",
            rows: [
              ["Full name", d.name],
              ["Work email", d.email],
              ["Company / organisation", d.company],
              ["Phone", d.phone],
            ],
          },
          {
            heading: "Enquiry",
            rows: [
              ["Request", request],
              ["Looking for", lookingFor],
              ["Project description", d.description],
            ],
          },
          { heading: "Meta", rows: [["Submitted from", d.source ?? ""]] },
        ],
        data: { ...d, website: undefined },
        // Contact Leads spreadsheet (Apps Script payload) — the same six keys the script reads.
        // The form no longer asks for a job title (sent empty); the phone, when given, is
        // appended to projectDetails so nothing submitted is dropped.
        sheet: {
          name: d.name,
          email: d.email,
          company: d.company,
          jobTitle: "",
          inquiryType: `${request} — ${lookingFor}`,
          projectDetails: [
            d.description,
            "",
            ...(d.phone ? [`Phone: ${d.phone}`] : []),
            `Reference: ${reference}`,
            `Submitted from: ${d.source ?? ""}`,
          ].join("\n"),
        },
      };
    },
  });
}
