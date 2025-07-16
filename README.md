# patchsecurityscanner

🔐 A CLI tool to detect vulnerabilities in npm **patch versions** before installation.

## 🚨 Why?

Running `npm install` with `^` or `~` often installs patch versions you didn’t explicitly request. If that patch is vulnerable — you won’t know until it's too late.

This tool stops that *before* it happens.

## 🛠 Features

- 📦 Resolves what exact patch version would be installed
- 🕵️ Scans for known vulnerabilities via [OSV.dev](https://osv.dev)
- ✅ Prevents risky installs and saves debugging later

---

## 🚀 Usage

```bash
npx patchsecurityscanner lodash@^4.17.21

Safe Output:
✅ Safe packages:
  - lodash@4.17.21

If vulnerable:
❌ Vulnerabilities found:
  - lodash@4.17.20
    CVE-2021-23337: Prototype pollution
