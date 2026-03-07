export interface SearchFilters {
  query: string;
  isSubscribed?: boolean;
  isPrivate?: boolean;
  isPublic?: boolean;
  org?: string;
  user?: string;
  language?: string;
  topic?: string;
  archived?: boolean;
  fork?: boolean;
}

export function parseSearchQuery(searchText: string): SearchFilters {
  const filters: SearchFilters = { query: "" };

  // Match all filter patterns
  const patterns = {
    is: /is:(subscribed|private|public|archived|fork)/gi,
    org: /org:(\S+)/gi,
    user: /user:(\S+)/gi,
    language: /language:(\S+)/gi,
    topic: /topic:(\S+)/gi,
  };

  // Parse is: filters
  let match;
  while ((match = patterns.is.exec(searchText)) !== null) {
    const filterType = match[1].toLowerCase();

    if (filterType === "subscribed") {
      filters.isSubscribed = true;
    } else if (filterType === "private") {
      filters.isPrivate = true;
    } else if (filterType === "public") {
      filters.isPublic = true;
    } else if (filterType === "archived") {
      filters.archived = true;
    } else if (filterType === "fork") {
      filters.fork = true;
    }
  }

  // Parse org: filter
  while ((match = patterns.org.exec(searchText)) !== null) {
    filters.org = match[1];
  }

  // Parse user: filter
  while ((match = patterns.user.exec(searchText)) !== null) {
    filters.user = match[1];
  }

  // Parse language: filter
  while ((match = patterns.language.exec(searchText)) !== null) {
    filters.language = match[1];
  }

  // Parse topic: filter
  while ((match = patterns.topic.exec(searchText)) !== null) {
    filters.topic = match[1];
  }

  // Remove all filter tokens from the query to get the actual search text
  const remainingQuery = searchText
    .replace(/is:(subscribed|private|public|archived|fork)/gi, "")
    .replace(/org:\S+/gi, "")
    .replace(/user:\S+/gi, "")
    .replace(/language:\S+/gi, "")
    .replace(/topic:\S+/gi, "")
    .trim();

  filters.query = remainingQuery;

  return filters;
}

export function buildSearchSuggestions(): string[] {
  return [
    "is:subscribed",
    "is:private",
    "is:public",
    "org:owner",
    "user:username",
    "language:typescript",
  ];
}
