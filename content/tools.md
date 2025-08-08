---
title: "Tools & Projects"
layout: staticpage
description: "Discover web services and developer tools created by Matthew Gall, including asnjson.com, dnsjson.com, and other utilities for network data, DNS queries, and API development."
---

Building useful tools that solve real problems is what I love most about development. Here's a collection of web services and utilities I've created to make working with network data, DNS, and APIs easier for developers and system administrators.

## 🌐 Developer & Infrastructure Tools

### 🔍 asnjson.com
**IP to ASN Lookup Made Simple**

Transform IP addresses into autonomous system numbers with ease. Built as an elegant frontend to Team Cymru's powerful IP-to-ASN mapping service, returning clean JSON responses perfect for automation and integration.

**Perfect for:** Network analysis, security research, infrastructure mapping

[🚀 Try it now](https://asnjson.com) • [📂 View source](https://github.com/matthewgall/asnjson.com)

---

### 📡 dnsjson.com  
**DNS Queries Without the Headache** *(2016 - Predating DoH by 2 years!)*

Stop fighting with DNS parsing libraries! Query any DNS record type and get back perfectly formatted JSON or plain text responses. Whether you need A records, MX records, or TXT records, this service handles the complexity so you don't have to.

Built in 2016, this was arguably one of the first practical implementations of DNS-over-HTTP, predating the official DNS-over-HTTPS (DoH) RFC 8484 specification by two years. What started as a solution to a personal pain point became a precursor to what would eventually become an internet standard.

**Perfect for:** API integrations, monitoring scripts, DNS troubleshooting

[🚀 Try it now](https://dnsjson.com) • [📂 View source](https://github.com/matthewgall/dnsjson.com)

---

### 🛡️ findabuse.email
**Contact Abuse Teams Instantly** 

Dealing with malicious IP addresses or need to report abuse? This tool instantly finds the right abuse contact for any IP address, taking the guesswork out of incident response.

**Perfect for:** Security teams, system administrators, incident response

[🚀 Try it now](https://findabuse.email)

---

### 🌍 ipinfo.in
**Your IP, Instantly**

A clean, fast alternative to services like canhazip.com. Get your public IP address in various formats with a simple HTTP request. Built with Python and Bottle for reliability and speed.

**Perfect for:** Scripts, monitoring, network diagnostics

[🚀 Try it now](https://ipinfo.in) • [📂 View source](https://github.com/matthewgall/ipinfo.in)

---

### 🛡️ throwaway.cloud
**Disposable Email Detection Made Simple**

Identify throwaway and temporary email addresses in real-time to prevent fraud and abuse while respecting user privacy. Built with a serverless architecture delivering sub-50ms response times globally, this API helps businesses make informed decisions without compromising legitimate privacy use cases.

**Perfect for:** Fraud prevention, user registration validation, platform security, e-commerce protection

[🚀 Try it now](https://throwaway.cloud)

---

## ⛽ Consumer Applications

### 🚗 fuelaround.me
**Find the Cheapest Fuel Near You**

Never overpay for petrol or diesel again! This web app analyzes real-time fuel price data across the UK to help you find the cheapest stations in your area. Built with modern web technologies and updated multiple times daily with the latest pricing information.

**Perfect for:** UK drivers, fleet managers, anyone wanting to save money on fuel

[🚀 Try it now](https://fuelaround.me) • [📂 View source](https://github.com/matthewgall/fuelfeed)

---

## 💡 Why These Tools Exist

Each tool solves a specific pain point I've encountered in my development and infrastructure work. They're designed to be:

- **Fast & Reliable** - Built for production use
- **Developer-Friendly** - Clean APIs and JSON responses  
- **Open Source** - Learn from the code, contribute improvements
- **Free to Use** - No API keys, no rate limits for reasonable use

Have an idea for a tool that would make your work easier? [Get in touch](/contact) - I love hearing about interesting problems to solve!