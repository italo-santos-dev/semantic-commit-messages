# Conventional Commits 1.0.0 Specification Reference

This document summarizes the canonical **Conventional Commits 1.0.0** specification, formal grammar, and structural rules.

Official specification: [https://www.conventionalcommits.org/en/v1.0.0/](https://www.conventionalcommits.org/en/v1.0.0/)

---

## 1. Commit Structure

A conventional commit message must adhere to the following layout:

```text
<type>[optional scope][optional !]: <description>

[optional body]

[optional footer(s)]
```

### Key Elements:
1. **Header (Mandatory)**: Single line containing `type`, optional `scope`, optional breaking change indicator (`!`), a colon, a space, and the `description`.
2. **Body (Optional)**: Free-form text explaining the motivation, context, and difference with previous behavior. Must be separated from the header by exactly one blank line.
3. **Footer (Optional)**: One or more git-trailer lines formatted as `<token>: <value>` or `<token> #<value>` (e.g., `Fixes #123`, `BREAKING CHANGE: description`). Must be separated from previous content by exactly one blank line.

---

## 2. Formal Grammar (Backus-Naur Form)

```bnf
<commit> ::= <header> <blank-line> <body> <blank-line> <footer>
           | <header> <blank-line> <body>
           | <header> <blank-line> <footer>
           | <header>

<header> ::= <type> "(" <scope> ")" <breaking-exclamation> ":" <whitespace> <description>
           | <type> <breaking-exclamation> ":" <whitespace> <description>
           | <type> "(" <scope> ")" ":" <whitespace> <description>
           | <type> ":" <whitespace> <description>

<type> ::= [a-zA-Z0-9_-]+
<scope> ::= [^()\r\n]+
<breaking-exclamation> ::= "!"
<description> ::= [^\r\n]+
<blank-line> ::= "\n" | "\r\n"
<body> ::= [^\0]+
<footer> ::= <footer-entry> (<blank-line> <footer-entry>)*
<footer-entry> ::= <footer-token> (": " | " #") <footer-value>
<footer-token> ::= "BREAKING CHANGE" | "BREAKING-CHANGE" | [a-zA-Z0-9_-]+
```

---

## 3. Structural Rules Checklist

| # | Rule | Requirement |
| :--- | :--- | :--- |
| **1** | Type Prefix | Must start with a noun indicating the intent (`feat`, `fix`, etc.). |
| **2** | Scope | Optional. Enclosed in parentheses immediately following the type. |
| **3** | Colon and Space | A colon followed immediately by a single space must terminate the prefix. |
| **4** | Description | A concise summary in the imperative mood, immediately following `: `. |
| **5** | Breaking Indicator | May append `!` before the colon (e.g. `feat!:`) OR include a `BREAKING CHANGE:` footer. |
| **6** | Blank Line before Body | A blank line **must** separate header from body if a body is present. |
| **7** | Blank Line before Footer | A blank line **must** separate body/header from footer section. |
| **8** | Git Trailer Footers | Footers use token-separator syntax (`Token: Value` or `Token #Value`). |
