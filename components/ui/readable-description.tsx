function sentencesOf(description: string): readonly string[] {
  return description
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function ReadableDescription({
  description,
  className = 'text-small text-text-secondary',
}: {
  description: string;
  className?: string;
}) {
  const sentences = sentencesOf(description);

  if (sentences.length <= 1) {
    return <p className={className}>{description}</p>;
  }

  return (
    <ul className={`flex list-disc flex-col gap-2 pl-5 ${className}`}>
      {sentences.map((sentence) => (
        <li key={sentence}>{sentence}</li>
      ))}
    </ul>
  );
}
