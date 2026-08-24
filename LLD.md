# Low-Level Design (LLD): School CRM v23

## 1. RESTful Endpoint Design
All backend services adhere to **System design basics: Frontend, backend, DB and other systems integration**. 
Endpoints utilize **HTTP status codes used correctly** (200, 201, 400, 401, 403, 404, 500) and are connected via Express **Middleware**.

### Example: POST /api/payments/checkout
- **Middleware:** Auth verification, **Role-based authorization checks** (Parent only), **Rate limiting**.
- **Logic:** **Request body validation** (Zod). Initializes **Payment gateway integration**.
- **DB:** Opens a SQL **Transaction** using Prisma. Updates the invoice status.
- **Error Handling:** **Server-side error handling** catches failures, rolls back the transaction, and returns a 500 status code.

## 2. AI Architecture (Multi-Step Agent)
- **Endpoint:** `POST /api/ai/agent`
- **Logic:** 
  1. Input is passed through **Input sanitization & injection awareness** filters.
  2. The LLM utilizes **Function calling / tool use** to decide whether to query the DB or the vector store.
  3. **RAG — embeddings & vector retrieval** fetches relevant context (e.g., school handbooks).
  4. The LLM generates a response using strict **Prompt engineering** to guarantee **Structured outputs** (JSON format).
  5. The response is sent via **Streaming responses** back to the UI.
  6. A background worker logs the usage for **Token & cost monitoring**.
- **Testing:** The AI logic is tested against established **LLM eval sets** in the CI pipeline.

## 3. JavaScript Fundamentals Implemented
The frontend and backend codebases rigorously apply core JavaScript concepts:
- **JavaScript — async/await:** Used extensively over raw promises for readability in controllers and data fetching.
- **JavaScript — Promises vs callbacks:** Legacy callbacks are avoided; all I/O operations return Promises.
- **JavaScript — Event loop:** Non-blocking architecture ensures heavy DB queries don't block concurrent user requests.
- **JavaScript — Closures:** Utilized in factory functions, memoization, and custom React hooks.
- **JavaScript — Hoisting:** Code is structured strictly with `let` and `const` to avoid hoisting-related bugs, and function declarations are placed logically.
