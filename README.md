
---
### 1. Delete all existing migrations


Go to your `prisma/migrations/` folder and  **delete all subfolders** .


* Each folder corresponds to an old migration.
* This ensures you start fresh with a clean migration history.


<pre class="overflow-visible!" data-start="357" data-end="395"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>rm</span><span> -rf prisma/migrations/*
</span></span></code></div></div></pre>
---
### 2. Reset the database

This will **drop all tables** in your DB (PostgreSQL) and apply the new schema.

<pre class="overflow-visible!" data-start="509" data-end="557"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>npx prisma migrate reset --skip-seed
</span></span></code></div></div></pre>

* Confirms you want to reset → type `y`.
* `--skip-seed` ensures no seed script runs.

---

### 3. Create a fresh migration

Generate a new first migration from your current schema:

<pre class="overflow-visible!" data-start="745" data-end="791"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>npx prisma migrate dev --name init
</span></span></code></div></div></pre>

* `init` is just a descriptive name; you can call it anything.
* Creates new SQL migration based on your current schema.
* Applies it to the DB.

---

### 4. Regenerate Prisma Client

<pre class="overflow-visible!" data-start="980" data-end="1011"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>npx prisma generate
</span></span></code></div></div></pre>

* Ensures your application has the latest model types and queries.

---

### 5. Verify

<pre class="overflow-visible!" data-start="1102" data-end="1131"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>npx prisma studio
</span></span></code></div></div></pre>

* Opens a web GUI to confirm tables exist and relationships are correct.

---

⚡  **One-liner alternative (dev-only)** :

<pre class="overflow-visible!" data-start="1257" data-end="1396"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>rm</span><span> -rf prisma/migrations/* && npx prisma migrate reset --skip-seed && npx prisma migrate dev --name init && npx prisma generate
</span></span></code></div></div></pre>

* Deletes migrations
* Resets DB
* Creates new migration
* Regenerates client

This will give you a completely fresh database matching your current Prisma schema.
