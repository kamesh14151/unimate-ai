import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMISSION_DATA = `{
  "university": "Meow University",
  "courses": [
    {"name": "B.Tech", "duration": "4 years", "eligibility": "12th with Physics, Chemistry, Mathematics", "fees": "₹1,20,000 per year"},
    {"name": "B.Sc Computer Science", "duration": "3 years", "eligibility": "12th with Mathematics", "fees": "₹60,000 per year"},
    {"name": "MBA", "duration": "2 years", "eligibility": "Any degree + entrance exam", "fees": "₹1,50,000 per year"}
  ],
  "admission": {
    "start_date": "May 1",
    "end_date": "July 31",
    "mode": "Online",
    "procedure": [
      "Create an application account on the admissions portal",
      "Fill in personal, academic, and program preference details",
      "Upload required documents",
      "Pay the application fee",
      "Submit and track application status",
      "Attend counseling/verification if shortlisted"
    ],
    "required_documents": [
      "10th and 12th marksheets",
      "Transfer certificate",
      "Government photo ID",
      "Passport-size photographs",
      "Category certificate (if applicable)",
      "Entrance scorecard (if applicable)"
    ]
  },
  "contact": {"phone": "+91 9876543210", "email": "admissions@meowuniversity.edu"}
}`;

const SYSTEM_PROMPT = `You are a university admission assistant for Meow University.
Only answer questions about:
- Admission procedure
- Courses
- Fees
- Eligibility
- Admission dates and deadlines
- Required documents
- Contact details

Use this data to answer:
${ADMISSION_DATA}

If a question is out of scope, reply:
"I can only help with university admission queries. Feel free to ask about procedure, courses, fees, eligibility, deadlines, required documents, or contact details!"

Response rules:
- Be friendly, concise, and use markdown formatting for readability.
- Prefer bullet points for steps and lists.
- When asked about process, provide the procedure in clear numbered steps.
- When asked about deadlines, explicitly mention both start and end dates.
- If data is unavailable in the provided dataset, clearly say it is not available and share contact details.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI error:", response.status, text);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Chat function error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
