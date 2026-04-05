import ChatWidget from "@/components/ChatWidget";

const Index = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center space-y-4 px-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-foreground">Meow University</h1>
      <p className="text-sm text-muted-foreground max-w-md">
        Welcome to our website. Click the chat icon in the bottom-right corner to speak with our admission assistant.
      </p>
      <div className="rounded-2xl border border-border bg-muted/20 p-4 text-left">
        <h2 className="text-sm font-semibold text-foreground">11. University Admission Enquiries</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          <strong>Problem:</strong> Students repeatedly ask about admission procedures, eligibility, and deadlines.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          <strong>Chatbot Solution:</strong> This assistant provides instant answers about courses, fees, admission requirements, and key timelines.
        </p>
      </div>
    </div>
    <ChatWidget />
  </div>
);

export default Index;
