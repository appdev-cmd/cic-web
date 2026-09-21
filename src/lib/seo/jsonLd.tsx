import React from 'react';

/**
 * Serializes data to a JSON string safe for embedding in a <script type="application/ld+json"> tag.
 * Replaces '<' with unicode escape '\u003c' to prevent script breakout attacks.
 */
export function safeJsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export interface JsonLdScriptProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
  id?: string;
}

export function JsonLdScript({ data, id }: JsonLdScriptProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdString(data) }}
    />
  );
}
