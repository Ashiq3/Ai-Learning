# Beginner Glossary — Classes 1–3

This glossary follows the order of the first three ready classes in the course. It is written for learners who are new to web development and AI backends.

A definition explains the idea; the analogy makes it easier to remember. Analogies are learning aids, not exact technical descriptions.

## Class 1 — The web: Frontend, Backend & Servers

### Frontend (also called the client side)
**Meaning:** The part of an app that runs on the user's device and that the user can see or interact with: screens, buttons, forms, menus and browser-side behavior.

**Analogy:** The dining area of a restaurant: the menu, tables and things a customer can touch.

### Browser
**Meaning:** Software such as Chrome, Firefox or Safari that opens websites and runs their frontend code.

**Analogy:** The customer's window into the restaurant's dining area.

### Backend (server side)
**Meaning:** The part of an app that runs away from the user's screen and handles work such as checking permissions, applying business rules, accessing databases and calling other services.

**Analogy:** The restaurant kitchen: customers do not see every step, but the work happens there.

### Server
**Meaning:** In everyday web development, this word can mean the computer that hosts an app, or the server program running on that computer and waiting for requests. The context tells you which meaning is intended.

**Analogy:** The building can be the computer; the staff taking and handling orders can be the server program.

### Cloud server
**Meaning:** A computer rented from a cloud provider and accessed over a network. It can keep an app running without relying on the developer's personal laptop.

**Analogy:** Renting a professional kitchen that stays available even after you go home.

### IP address
**Meaning:** A numeric network address used to route data to a device or service. An IP address helps computers find where to send network traffic.

**Analogy:** A street address that helps a delivery reach the right building.

### DNS (Domain Name System)
**Meaning:** The system that looks up the IP address associated with a domain name, such as `example.com`.

**Analogy:** A phone's contacts: you remember a person's name, and the contacts app looks up the number.

### Request and response
**Meaning:** A request is a message asking a server or service to do something. A response is the reply it sends back, often containing data or an error.

**Analogy:** A customer places an order; the restaurant returns the food or explains why it cannot fulfil the order.

## Class 2 — APIs, HTTP, JSON & API Keys

### API (Application Programming Interface)
**Meaning:** A defined way for one piece of software to ask another piece of software to perform an action or provide data. The API describes what can be requested and how.

**Analogy:** A restaurant menu plus the ordering rules: it tells you what you can ask for without showing you the whole kitchen.

### API endpoint
**Meaning:** A specific URL or route where an API accepts a particular kind of request. The HTTP method is often part of what makes the operation specific.

**Analogy:** A particular service counter in a large building, such as the counter for placing an order.

### HTTP
**Meaning:** The common web protocol that defines how clients and servers exchange requests and responses.

**Analogy:** A shared set of delivery rules so different companies can exchange parcels in a predictable way.

### HTTP method
**Meaning:** A label that describes the intended action of a request. Common examples are `GET` (read), `POST` (send or create), `PUT` (replace/update) and `DELETE` (remove). The API's documentation defines the exact behavior of each endpoint.

**Analogy:** The instruction written on an order slip: “show me”, “place this order”, “replace this order” or “cancel this order”.

### JSON
**Meaning:** A text format for organizing data with objects, arrays, strings, numbers, booleans and null values. APIs commonly use JSON for request and response bodies.

**Analogy:** A neatly structured order form with named boxes, so the kitchen knows which value belongs to which field.

### HTTP headers
**Meaning:** Extra information sent with an HTTP request or response. Headers can describe the content type, authentication method, caching rules and other metadata.

**Analogy:** The label attached to a parcel: it gives delivery instructions without being the parcel's contents.

### API key
**Meaning:** A secret credential that an API provider uses to identify or authorize an application. Anyone who obtains a usable key may be able to use the associated account or quota, so it must be protected.

**Analogy:** A keycard for a staff-only door. Do not print it on a public noticeboard or put it in code that every visitor can inspect.

### Environment variable and `.env` file
**Meaning:** An environment variable is a named value supplied to a running program, often for configuration. A local `.env` file is one common way to store those values during development. Keep real secrets out of Git and out of frontend code.

**Analogy:** A sealed instruction sheet given to the kitchen staff, not printed on the public menu.

### HTTP status code
**Meaning:** A number in the server's response that summarizes the result. For example: `200` means success; `400` means the request was invalid; `401` means authentication is missing or invalid; `404` means the resource was not found; `429` means too many requests; and `500` means the server encountered an unexpected problem.

**Analogy:** A delivery update: delivered, incomplete address, ID required, item not found, too many orders, or a problem at the depot.

## Class 3 — Backend Code, Databases & AI Tokens

### Programming language
**Meaning:** A formal language used to write instructions that a computer can execute. Python and JavaScript are two common choices for backend work.

**Analogy:** Two different human languages that can both be used to give clear instructions.

### Runtime
**Meaning:** The software environment that executes a program. For example, Node.js runs JavaScript outside the browser.

**Analogy:** The stage and equipment needed for a written script to become a live performance.

### Framework
**Meaning:** A set of reusable tools and conventions that provides a structure for building an application. FastAPI and Express are examples used for backend development.

**Analogy:** A ready-made kitchen layout with common equipment already arranged, so a chef does not have to build every station from scratch.

### Package or dependency
**Meaning:** Reusable code that a project installs so it can use functionality built by someone else. A project may depend on many packages.

**Analogy:** Buying a ready-made appliance for the kitchen instead of manufacturing that appliance yourself.

### Database
**Meaning:** An organized system for storing, finding and updating information. A backend can use a database to keep information between requests and between user sessions.

**Analogy:** The restaurant's record room where customer orders, inventory and account details are stored.

### Table, row and column
**Meaning:** In a relational database, a table stores one kind of record; each row is one record; each column is one field shared by those records.

**Analogy:** A spreadsheet: a row is one person's entry, and columns hold fields such as name, email or order date.

### CRUD
**Meaning:** The four basic operations used to work with stored data: Create, Read, Update and Delete.

**Analogy:** Add a customer record, look it up, correct it, or remove it when appropriate.

### Token (in an AI model)
**Meaning:** A piece of text produced by a model's tokenizer. A token may be a whole short word, part of a longer word, punctuation or another text fragment. One token is not always one word or one character.

**Analogy:** Building a sentence from small language tiles. The tiles do not always line up with whole words.

### Tokenizer
**Meaning:** The component that splits text into the tokens a particular model uses. Different models may use different tokenization rules.

**Analogy:** A machine that cuts a long strip of text into the pieces used by a particular factory.

### Context window
**Meaning:** The maximum amount of input and generated content a model can consider in one interaction, measured in tokens. Long conversations and large documents use up this capacity.

**Analogy:** A desk with limited space: when it becomes full, some older papers may need to be removed to make room for new ones.

## Preview terms used later in the course

### Webhook
**Meaning:** An automatic HTTP request that one service sends to another when a particular event happens, such as a payment succeeding. The receiving app should verify that the webhook really came from the expected provider.

**Analogy:** A doorbell that rings when a delivery arrives, instead of someone repeatedly checking the street.

### Deployment
**Meaning:** The process of putting an application onto a hosting environment and configuring it so users can access it. A deployment may include building the app, setting environment variables, connecting a domain and enabling HTTPS.

**Analogy:** Moving a finished restaurant from a practice kitchen into a real location where customers can visit.

---

## Quick way to connect the ideas

1. The **Frontend** runs in the user's browser.
2. It sends a **Request** using **HTTP**, often to an **API endpoint**.
3. The **Backend** checks the request, may read or write a **Database**, and may call an AI service.
4. The service returns a **Response**, commonly containing **JSON** and an HTTP status code.
5. An AI model processes text as **Tokens** within its **Context Window**.

When debugging, follow the same path one step at a time: browser → request → backend/API → database or AI service → response → screen.
