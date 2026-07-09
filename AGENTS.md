# Developer & Coding Instructions

## 1. Local-First Static Execution Rules
- **No Server Dependencies**: Both `/chunked_wcs.html` and `/chunked_bachata.html` (along with `/index.html`) must remain **fully static, self-contained, and loadable directly on a local machine** (e.g., using `file://` protocol in a browser) without requiring a running development or HTTP server.
- **No AJAX/Fetch on Local Resources**: Do not use `fetch()` or other network APIs to load local `.json`, `.html`, or data files, as this will trigger CORS blocking in modern browsers when opened from a local file path (`file://`). All data arrays (such as the landmark lists, tempos, and metadata) must remain inline in JS variables/constants or bundled in imported scripts.
- **Allowed Asset Extraction**: It is acceptable to extract JavaScript or CSS blocks to separate files in the same root folder (e.g., `/chunked_bachata.js` or `/chunked_bachata.css`) to improve readability, as long as they can be loaded cleanly via relative local paths.
