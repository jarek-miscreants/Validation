# Work Email Validation Script

Client-side form validation that blocks disposable and personal email domains on work email fields. Built for Webflow. Zero class dependencies — everything is driven by **data attributes**.

## Files

| File | Purpose |
|------|---------|
| `form-validation-v2.js` | Validation logic (loaded on your Webflow pages) |
| `invalid-domains.json` | Blocklist of ~4,700 disposable/personal email domains |
| `form-validation.js` | Legacy v1 script (class-based selectors) |

## Dependencies

- **jQuery** — included by default in all Webflow projects (loaded automatically)

## Webflow Setup

### 1. Required Data Attributes

The script uses only custom data attributes — no CSS classes required for functionality.

| Element | Attribute | Value | Purpose |
|---------|-----------|-------|---------|
| Form | `data-form` | `validate` | Identifies forms to validate on submit |
| Form | `data-redirect` | URL path (e.g. `/meet/pixee`) | Redirect destination after successful validation. The email is appended as `?email=...` |
| Email input | `data-validate` | `work-email` | Identifies email fields to validate on input |
| Error message | `data-validate` | `error` | Identifies the error text element (must be a **sibling** of the input) |

#### How to add in Webflow Designer

1. Select the element
2. Open the **Settings panel** (gear icon)
3. Scroll to **Custom Attributes**
4. Click **+** and add the attribute name and value from the table above

### 2. Auto-Applied Attribute

The script automatically adds/removes this attribute — **do not add it manually**:

| Attribute | Applied To | When |
|-----------|-----------|------|
| `data-invalid` | Email input | Validation fails (removed when input becomes valid) |

Use this for CSS styling (see below).

### 3. Error Message Element

Add a **Text Block** or **Div** directly next to (sibling of) the email input with:
- Attribute: `data-validate="error"`
- Default state: **hidden** (`display: none`)

The script shows/hides this element and sets its text dynamically:
- `"This email domain is not accepted"` — domain is on the blocklist
- `"Please enter a valid email address"` — format is invalid

### 4. CSS

Add these styles in Webflow (or via an Embed block / custom code):

```css
/* Invalid state — applied via data attribute, not class */
input[data-invalid] {
  border-color: #e74c3c;
}

/* Error message — hidden by default */
[data-validate="error"] {
  display: none;
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 4px;
}
```

### 5. Loading the Script

Add in **Project Settings > Custom Code > Footer Code**:

```html
<script src="https://cdn.jsdelivr.net/gh/jarek-miscreants/Validation@main/form-validation-v2.js"></script>
```

Or use the raw GitHub URL:

```html
<script src="https://raw.githubusercontent.com/jarek-miscreants/Validation/main/form-validation-v2.js"></script>
```

## Example HTML Structure

Reference of what Webflow generates with the attributes applied:

```html
<form data-form="validate" data-redirect="/meet/pixee">
  <input
    type="email"
    data-validate="work-email"
    placeholder="Work email"
  />
  <div data-validate="error" style="display: none;"></div>
  <button type="submit">Submit</button>
</form>
```

## Attribute Reference (Quick Summary)

```
data-form="validate"        → on the <form>
data-redirect="/meet/pixee" → on the <form> (redirect URL after valid submit)
data-validate="work-email"  → on the email <input>
data-validate="error"       → on the error <div> or <span> (sibling of input)
data-invalid                → auto-added/removed by script (use in CSS selectors)
```

## How It Works

1. On page load, the script fetches `invalid-domains.json` from GitHub
2. On each keystroke in a `data-validate="work-email"` input:
   - Checks email format (has `@`, domain, TLD)
   - Checks if the domain is on the blocklist
3. If invalid: adds `data-invalid` to the input and shows the sibling `[data-validate="error"]` element
4. If valid: removes `data-invalid` and hides the error
5. On form submit: **always prevents Webflow's default submission** (no data sent to Webflow)
6. If invalid: blocks submission entirely
7. If valid: redirects to the URL in `data-redirect` with `?email=` appended

## Updating the Blocklist

Edit `invalid-domains.json` directly — no script changes needed. Format is a flat JSON array:

```json
[
  "0-mail.com",
  "guerrillamail.com",
  "mailinator.com"
]
```

## Multiple Forms

Works on **all forms** on the page that have `data-form="validate"`. Each form's email input is validated independently.
