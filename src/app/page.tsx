"use client";

import { useState } from "react";

interface Result {
  data?: unknown;
  error?: string;
  latency?: number;
}

function CodeBlock({ code }: { code: string }) {
  return <pre>{code}</pre>;
}

function Section({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
}) {
  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>{title}</h2>
        <p style={styles.sectionDesc}>{description}</p>
      </div>
      <div style={styles.sectionBody}>
        <div style={styles.codeCol}>
          <div style={styles.codeLabel}>Code</div>
          <CodeBlock code={code} />
        </div>
        <div style={styles.tryCol}>{children}</div>
      </div>
    </section>
  );
}

function ResultBox({ result }: { result: Result | null }) {
  if (!result) return null;
  return (
    <div
      style={{
        ...styles.resultBox,
        borderColor: result.error ? "#ef4444" : "#22c55e",
      }}
    >
      {result.latency && (
        <div style={styles.latency}>{result.latency}ms</div>
      )}
      <pre style={{ margin: 0, background: "transparent", border: "none", padding: 0, fontSize: "0.8rem" }}>
        {result.error
          ? `Error: ${result.error}`
          : JSON.stringify(result.data, null, 2)}
      </pre>
    </div>
  );
}

export default function Home() {
  const [classifyMsg, setClassifyMsg] = useState("I need a refund for my last order");
  const [classifyResult, setClassifyResult] = useState<Result | null>(null);
  const [classifyLoading, setClassifyLoading] = useState(false);

  const [priorityMsg, setPriorityMsg] = useState("Our entire team is locked out of the system");
  const [priorityResult, setPriorityResult] = useState<Result | null>(null);
  const [priorityLoading, setPriorityLoading] = useState(false);

  const [intentsCategory, setIntentsCategory] = useState("technical_support");
  const [intentsResult, setIntentsResult] = useState<Result | null>(null);
  const [intentsLoading, setIntentsLoading] = useState(false);

  const [convosResult, setConvosResult] = useState<Result | null>(null);
  const [convosLoading, setConvosLoading] = useState(false);

  const [balanceResult, setBalanceResult] = useState<Result | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  async function callApi(
    endpoint: string,
    body: Record<string, unknown> | null,
    setResult: (r: Result) => void,
    setLoading: (l: boolean) => void
  ) {
    setLoading(true);
    const start = Date.now();
    try {
      const res = await fetch(endpoint, {
        method: body ? "POST" : "GET",
        headers: body ? { "Content-Type": "application/json" } : {},
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json();
      const latency = Date.now() - start;
      if (!res.ok) {
        setResult({ error: json.error || `HTTP ${res.status}`, latency });
      } else {
        setResult({ data: json, latency });
      }
    } catch (err) {
      setResult({ error: String(err), latency: Date.now() - start });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.badge}>supp-ts-starter</div>
        <h1 style={styles.title}>Supp SDK Examples</h1>
        <p style={styles.subtitle}>
          Interactive examples using the{" "}
          <a href="https://www.npmjs.com/package/supp-ts">supp-ts</a> SDK.
          Each example calls a Next.js API route that uses the SDK server-side.
        </p>
      </header>

      {/* Classification */}
      <Section
        title="Classify Message"
        description="Classify a customer message into one of 315 intents. Returns intent, confidence, and suggested action."
        code={`import { Supp } from "supp-ts";

const supp = new Supp(process.env.SUPP_SECRET_KEY);

const result = await supp.classify(message);
// result.intent → "refund_initiation"
// result.confidence → 0.94`}
      >
        <input
          style={styles.input}
          value={classifyMsg}
          onChange={(e) => setClassifyMsg(e.target.value)}
          placeholder="Enter a customer message..."
        />
        <button
          style={styles.button}
          disabled={classifyLoading || !classifyMsg}
          onClick={() =>
            callApi(
              "/api/classify",
              { message: classifyMsg },
              setClassifyResult,
              setClassifyLoading
            )
          }
        >
          {classifyLoading ? "Classifying..." : "Classify — $0.20"}
        </button>
        <ResultBox result={classifyResult} />
      </Section>

      {/* Priority Scoring */}
      <Section
        title="Priority Score"
        description="Score a message's urgency without classifying it. Returns low, medium, high, or critical."
        code={`const { priority } = await supp.priorityScore(
  "Our entire team is locked out"
);
// priority → "critical"`}
      >
        <input
          style={styles.input}
          value={priorityMsg}
          onChange={(e) => setPriorityMsg(e.target.value)}
          placeholder="Enter a message to score..."
        />
        <button
          style={styles.button}
          disabled={priorityLoading || !priorityMsg}
          onClick={() =>
            callApi(
              "/api/priority",
              { message: priorityMsg },
              setPriorityResult,
              setPriorityLoading
            )
          }
        >
          {priorityLoading ? "Scoring..." : "Score Priority — $0.03"}
        </button>
        <ResultBox result={priorityResult} />
      </Section>

      {/* Browse Intents */}
      <Section
        title="Browse Intents"
        description="List available intents by category. Supp has 315 intents across 13 categories."
        code={`const { intents, total } = await supp.intents.list({
  category: "technical_support"
});
// total → 47`}
      >
        <select
          style={styles.input}
          value={intentsCategory}
          onChange={(e) => setIntentsCategory(e.target.value)}
        >
          <option value="technical_support">Technical Support</option>
          <option value="billing_payment">Billing & Payment</option>
          <option value="account_management">Account Management</option>
          <option value="subscription_management">Subscription Management</option>
          <option value="product_inquiry">Product Inquiry</option>
          <option value="order_delivery">Order & Delivery</option>
          <option value="returns_refunds">Returns & Refunds</option>
          <option value="feature_requests">Feature Requests</option>
          <option value="complaints_feedback">Complaints & Feedback</option>
          <option value="general_inquiry">General Inquiry</option>
          <option value="verification_authentication">Verification & Auth</option>
          <option value="loyalty_rewards">Loyalty & Rewards</option>
          <option value="no_intent">No Intent</option>
        </select>
        <button
          style={styles.button}
          disabled={intentsLoading}
          onClick={() =>
            callApi(
              `/api/intents?category=${intentsCategory}`,
              null,
              setIntentsResult,
              setIntentsLoading
            )
          }
        >
          {intentsLoading ? "Loading..." : "List Intents — Free"}
        </button>
        <ResultBox result={intentsResult} />
      </Section>

      {/* Conversations */}
      <Section
        title="List Conversations"
        description="Fetch recent conversations from your Supp account."
        code={`const conversations = await supp.conversations.list({
  status: "open",
  limit: 5
});`}
      >
        <button
          style={styles.button}
          disabled={convosLoading}
          onClick={() =>
            callApi("/api/conversations", null, setConvosResult, setConvosLoading)
          }
        >
          {convosLoading ? "Loading..." : "List Conversations — Free"}
        </button>
        <ResultBox result={convosResult} />
      </Section>

      {/* Balance */}
      <Section
        title="Check Balance"
        description="View your current credit balance and recent charges."
        code={`const { balance, recentCharges } =
  await supp.billing.balance();
// balance → 47.50`}
      >
        <button
          style={styles.button}
          disabled={balanceLoading}
          onClick={() =>
            callApi("/api/balance", null, setBalanceResult, setBalanceLoading)
          }
        >
          {balanceLoading ? "Loading..." : "Check Balance — Free"}
        </button>
        <ResultBox result={balanceResult} />
      </Section>

      {/* Widget */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Widget Integration</h2>
          <p style={styles.sectionDesc}>
            Add the Supp chat widget to any page. Set{" "}
            <code>NEXT_PUBLIC_SUPP_PUBLISHABLE_KEY</code> in your{" "}
            <code>.env</code> file to enable it.
          </p>
        </div>
        <div style={{ padding: "1.5rem" }}>
          <CodeBlock
            code={`// app/layout.tsx
import Script from "next/script";

<Script
  src="https://supp.support/widget.js"
  data-api-key={process.env.NEXT_PUBLIC_SUPP_PUBLISHABLE_KEY}
  data-position="bottom-right"
  data-theme="light"
  strategy="lazyOnload"
/>`}
          />
        </div>
      </section>

      <footer style={styles.footer}>
        <a href="https://supp.support">supp.support</a>
        {" · "}
        <a href="https://www.npmjs.com/package/supp-ts">npm</a>
        {" · "}
        <a href="https://github.com/supp-support/supp-ts">github</a>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "2rem 1.5rem",
  },
  header: {
    textAlign: "center",
    marginBottom: "3rem",
  },
  badge: {
    display: "inline-block",
    fontSize: "0.75rem",
    fontFamily: "var(--mono)",
    background: "#1a1a2e",
    color: "#6366f1",
    padding: "0.25rem 0.75rem",
    borderRadius: "999px",
    marginBottom: "1rem",
    border: "1px solid #2a2a4a",
  },
  title: {
    fontSize: "2.25rem",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#888",
    fontSize: "1.05rem",
    maxWidth: 600,
    margin: "0 auto",
  },
  section: {
    background: "#141414",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    marginBottom: "1.5rem",
    overflow: "hidden",
  },
  sectionHeader: {
    padding: "1.25rem 1.5rem",
    borderBottom: "1px solid #2a2a2a",
  },
  sectionTitle: {
    fontSize: "1.15rem",
    fontWeight: 600,
    marginBottom: "0.25rem",
  },
  sectionDesc: {
    color: "#888",
    fontSize: "0.9rem",
    margin: 0,
  },
  sectionBody: {
    display: "flex",
    gap: "1px",
    background: "#2a2a2a",
  },
  codeCol: {
    flex: 1,
    padding: "1.25rem",
    background: "#141414",
  },
  codeLabel: {
    fontSize: "0.7rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    color: "#666",
    marginBottom: "0.5rem",
  },
  tryCol: {
    flex: 1,
    padding: "1.25rem",
    background: "#141414",
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.75rem",
  },
  input: {
    width: "100%",
    padding: "0.6rem 0.75rem",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "6px",
    color: "#ededed",
    fontSize: "0.9rem",
    fontFamily: "inherit",
    outline: "none",
  },
  button: {
    padding: "0.6rem 1rem",
    background: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.15s",
  },
  resultBox: {
    background: "#0a0a0a",
    border: "1px solid #2a2a2a",
    borderRadius: "6px",
    padding: "0.75rem",
    position: "relative" as const,
    maxHeight: 300,
    overflow: "auto",
  },
  latency: {
    position: "absolute" as const,
    top: "0.5rem",
    right: "0.5rem",
    fontSize: "0.7rem",
    color: "#666",
    fontFamily: "var(--mono)",
  },
  footer: {
    textAlign: "center",
    padding: "2rem 0",
    color: "#666",
    fontSize: "0.85rem",
  },
};
