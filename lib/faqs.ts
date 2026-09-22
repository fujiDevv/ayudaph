/**
 * FAQ ids, shared by the client list and the server-rendered FAQPage JSON-LD.
 *
 * This lives in its own module on purpose: `FaqsClient` is a `"use client"`
 * component, and importing a plain value from a client component into a server
 * component yields a client-reference proxy rather than the value itself
 * (`FAQ_ITEMS.map is not a function`). Keeping the data here lets both sides
 * read the real array.
 */
export const FAQ_ITEMS = [
  { id: "1", category: "catGeneral" },
  { id: "2", category: "catGeneral" },
  { id: "3", category: "catPrivacy" },
  { id: "4", category: "catData" },
  { id: "5", category: "catData" },
  { id: "6", category: "catContrib" },
] as const;
