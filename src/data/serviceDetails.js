export const SERVICE_DETAILS = {
  Consulting: {
    summary:
      "I help teams make backend architecture decisions before code gets written — the ones that are expensive to reverse once three sprints have been built on top of them.",
    sections: [
      {
        heading: "How I approach it",
        type: "steps",
        items: [
          "Discovery call — understand the problem you think you have, and the one you might actually have",
          "Audit — review existing architecture, data flow, dependencies, and where things have quietly gone wrong",
          "Risk mapping — what breaks first under load, what's expensive to change later, what's fine to leave alone",
          "Roadmap — a prioritized, sequenced plan, not a rewrite pitch dressed up as a diagram",
          "Implementation support — pairing with your team as changes land, available for questions as they come up, not gone after the doc is delivered",
        ],
      },
      {
        heading: "What you walk away with",
        type: "list",
        items: [
          "A written architecture assessment, not just a conversation",
          "A prioritized list of changes, ranked by risk and effort",
          "Direct access to ask follow-up questions for a set period after delivery",
        ],
      },
      {
        heading: "Is this a good fit?",
        type: "compare",
        good: [
          "You have a system in production and something's starting to hurt",
          "You're about to make a decision (new service, new DB, new queue) and want a second opinion first",
          "You want an outside read on tech debt priority, not just a list",
        ],
        notGood: [
          "You're pre-MVP and haven't shipped anything yet",
          "You want someone to just build it, not advise on it — that's the API Development or System Design service",
        ],
      },
    ],
  },

  "API Development": {
    summary:
      "REST and GraphQL services built with Spring Boot — designed to be predictable, versioned, and hard to misuse by the next developer who touches them, including future me.",
    sections: [
      {
        heading: "Design approach",
        type: "text",
        content:
          "Resource-oriented URLs, consistent error shapes across every endpoint, and versioning from day one (/api/v1/...) so breaking changes don't break existing clients. Validation happens at the boundary — a malformed request never reaches business logic. Pagination and filtering follow the same query-param convention everywhere in the API, not reinvented per endpoint.",
      },
      {
        heading: "Example — successful request",
        type: "api",
        method: "GET",
        endpoint: "/api/v1/orders/{orderId}",
        request: `GET /api/v1/orders/8841 HTTP/1.1
Authorization: Bearer <token>
Accept: application/json`,
        response: `{
  "id": 8841,
  "status": "FULFILLED",
  "customer": {
    "id": 231,
    "name": "Jane Doe"
  },
  "items": [
    { "sku": "SKU-1092", "quantity": 2, "unitPrice": 19.99 }
  ],
  "total": 39.98,
  "createdAt": "2026-07-01T10:14:22Z"
}`,
      },
      {
        heading: "Example — validation error",
        type: "code",
        label: "422 Unprocessable Entity",
        content: `{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "email": "Email must be valid",
    "description": "Description is required"
  }
}`,
      },
      {
        heading: "What's included",
        type: "list",
        items: [
          "Endpoint design, implementation, and OpenAPI/Swagger documentation",
          "Input validation and consistent error handling across the whole API",
          "Auth (JWT/OAuth2/API key — whichever fits the client)",
          "Rate limiting on public-facing endpoints, where it matters",
        ],
      },
      {
        heading: "Stack",
        type: "tags",
        items: ["Java", "Spring Boot", "PostgreSQL", "Spring Security", "OpenAPI"],
      },
    ],
  },

  "System Design": {
    summary:
      "Systems designed to survive real traffic, not just the demo — with the boring parts (caching, queues, failure handling, backpressure) treated as first-class from the start, not bolted on after the first outage.",
    sections: [
      {
        heading: "What I focus on",
        type: "list",
        items: [
          "Horizontal scalability — stateless services behind a load balancer, no server-side session state to fight later",
          "Caching strategy — Redis for hot paths, with an invalidation plan decided up front, not discovered in production",
          "Async processing — Kafka for anything that doesn't need a synchronous response, so slow work doesn't block fast requests",
          "Database design — indexing, partitioning, and read/write separation, applied only where the traffic pattern actually justifies the complexity",
          "Failure isolation — one dependency going down shouldn't take the whole system with it",
        ],
      },
      {
        heading: "Example scenario",
        type: "text",
        content:
          "A common one: a monolith's checkout flow slows down under load because order creation, payment, and email confirmation all happen synchronously in one request. The fix usually isn't 'rewrite everything' — it's separating what has to be synchronous (payment authorization) from what doesn't (confirmation emails, inventory sync), moving the latter to a queue, and measuring before assuming.",
      },
      {
        heading: "Typical stack",
        type: "tags",
        items: ["Spring Boot", "PostgreSQL", "Redis", "Kafka", "Docker", "Kubernetes"],
      },
      {
        heading: "Deliverables",
        type: "list",
        items: [
          "Architecture diagram with the actual data flow, not a marketing-slide version",
          "Documented tradeoffs — why this approach over the alternatives, and when to revisit the decision",
          "A migration plan if this touches an existing system, not just a greenfield design",
        ],
      },
    ],
  },

  Support: {
    summary:
      "Ongoing maintenance for systems already in production — the unglamorous work of keeping something reliable after launch day, when the initial excitement has worn off and it just needs to keep working.",
    sections: [
      {
        heading: "What's included",
        type: "list",
        items: [
          "Monitoring and alerting review — catching issues before users report them, not after",
          "Dependency and security patching on a regular, agreed cadence",
          "Performance tuning as real traffic patterns emerge and change",
          "Incident response within an agreed window, not an open-ended 'I'll get to it'",
        ],
      },
      {
        heading: "Response targets",
        type: "table",
        items: [
          { label: "Critical incident response", value: "< 4 hours" },
          { label: "Non-critical bug response", value: "< 2 business days" },
          { label: "Dependency/security patch cadence", value: "Monthly" },
          { label: "Monitoring review", value: "Weekly" },
        ],
      },
      {
        heading: "How engagements usually work",
        type: "text",
        content:
          "Either a fixed monthly retainer for a set number of hours, or pay-as-needed for occasional check-ins — depends on how actively the system is changing. Either way, the goal is the same: you're not the one staring at logs at 11pm trying to figure out why something's slow.",
      },
    ],
  },
};

export function getServiceDetails(title) {
  return (
    SERVICE_DETAILS[title] || {
      summary: "More detail on this service is coming soon.",
      sections: [],
    }
  );
}