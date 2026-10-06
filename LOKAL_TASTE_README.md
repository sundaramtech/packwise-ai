# Lokal Taste

A dedicated `lokal-taste-app` branch was created without changing `main`.

The complete Lokal Taste monorepo is generated separately as `Lokal-Taste-Full-Source.zip` in the ChatGPT conversation because this GitHub connector cannot create a new repository or bulk-upload the generated archive/source tree.

Target apps:
- Customer: `com.lokaltaste.customer`
- Vendor: `com.lokaltaste.vendor`
- Admin: `com.lokaltaste.admin`

Backend: Node.js + Express + PostgreSQL + Socket.IO. Payment is direct vendor UPI with manual vendor verification; no fake payment confirmation.
