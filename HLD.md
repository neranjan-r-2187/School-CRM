# High-Level Design (HLD): School CRM v23

## 1. System Architecture
School CRM v23 uses a hybrid database architecture to separate unstructured/document data from highly relational data, integrating modern engineering practices.

## 2. Engineering Practices
- **Containerization with Docker** for consistent local and production environments.
- **Environment variables & secrets management** strictly enforced.
- **Git workflow** utilizing feature branches and pull requests.
- **Writing unit tests** and **Automated API testing / integration tests** (e.g., Jest/Supertest) implemented in CI/CD pipelines.

## 3. Database Architecture (Hybrid NoSQL + SQL)

### 3.1 NoSQL (Mongo) - User Profiles & Chat Logs
- **Schema modeling (Mongo)** using Mongoose for flexible document structures.
- **CRUD operations (Mongo)** for fast read/writes of chat messages and basic user profiles.
- Strategic **Embedding vs referencing relationships** (e.g., embedding recent notifications within the user document, referencing large chat threads).
- **Aggregation pipelines** for generating complex analytical reports.
- **Indexing for query performance (Mongo)** applied to frequently searched fields (e.g., email, timestamps).

### 3.2 SQL (Postgres) - Financials & Inventory
- **Relational schema design with PK/FK** for strict data integrity in the tuition payment and school inventory modules.
- **Normalization basics** applied (up to 3NF) to reduce data redundancy.
- **ORM usage (Prisma/Sequelize)** for type-safe database queries.
- Complex **SQL JOINs** used to relate Students, Classes, and Invoices.
- **Filtering, ordering, grouping** implemented at the database level for paginated tables.
- **Transactions** used to guarantee ACID compliance during payment processing.
- **Indexing for query performance (SQL)** applied to foreign keys and lookup columns.

## 4. Frontend High-Level Design
- **React component composition** for modular UI.
- **State management with useState** and appropriate handling of **Side effects with useEffect**.
- **Async data fetching from API** utilizing modern hooks and cache management (React Query).
- **Client-side routing** seamlessly integrated with the SSR framework.
