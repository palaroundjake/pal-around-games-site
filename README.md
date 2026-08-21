# Pal Around Games — Marketing Site

A single-page marketing site for **Pal Around Games** and its debut title, **Get Up**
(launching November/December 2026). Built as plain HTML/CSS/JS — no build step, no
dependencies, deploys anywhere.

## Structure

```
index.html          Page content (hero, game showcase, about, email signup)
css/style.css        All styling
js/main.js           Mobile nav, scroll animations, signup form guard
assets/images/       Placeholder SVG illustrations — swap these for real art/photos/GIFs
```

## Previewing locally

From this folder, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser. (Opening `index.html` directly by
double-clicking will mostly work, but some browsers restrict local file loading —
the local server avoids that.)

## Replacing placeholder art

Everything in `assets/images/` is placeholder illustration, clearly labeled where it
appears on the page ("GAMEPLAY GIF — slot 1", etc). To swap in real assets:

- Keep the same filenames (`gallery-1.svg` → `gallery-1.gif` or `.jpg`, etc.) and just
  update the `src` in `index.html`, **or**
- Add your real files to `assets/images/` and update the `<img>` `src` attributes in
  `index.html` under the `#game` gallery section and the hero.
- The gallery grid (`.gallery` in `css/style.css`) expects roughly 4:3 images/GIFs but
  will adapt to other ratios reasonably well.

## Connecting the email signup form to Mailchimp

The form in `index.html` (`#notify` section) is built to match Mailchimp's classic
embedded form format, but needs your real audience details:

1. In Mailchimp, go to **Audience** → look for a **"Manage Audience"** dropdown or a
   separate **Forms** / **Website** section in the left nav (this has moved around in
   different Mailchimp versions) → **Signup forms** → **Embedded forms**.
2. Copy the generated `<form ... action="https://xxxx.usXX.list-manage.com/subscribe/post?u=...&id=...">`
   URL.
3. In `index.html`, replace `action="#MAILCHIMP_FORM_ACTION_URL"` with that real URL.
4. In that same Mailchimp code, find the hidden anti-bot input that looks like
   `<input type="text" name="b_XXXXXXXXXXXXXXXXXXXXXXXX_XXXXXXXXXX" ...>` and copy its
   exact `name` attribute into the matching hidden input in `index.html` (currently a
   placeholder inside the `.honeypot` div).
5. That's it — the form already posts the `EMAIL` field, which is what Mailchimp's
   embedded forms expect.

Until step 3 is done, submitting the form shows a friendly on-page message instead of
sending anywhere ("Signup form isn't connected to Mailchimp yet...") — see `js/main.js`.

## Deploying

Any static host works. Easiest options:

- **Netlify**: drag-and-drop this whole folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
- **Vercel**: `vercel deploy` from this folder (via their CLI), or connect the repo in their dashboard.
- **GitHub Pages**: push this folder to a GitHub repo and enable Pages in the repo settings.

No environment variables or build step are needed — it's ready to deploy as-is.

## Content still marked as placeholder

- Game description copy in the hero and `#game` section is generic and should be
  refined with real details about how **Get Up** is played.
- Social links in the footer (`#` hrefs) need real Instagram/X/Facebook URLs once those
  accounts exist.
- Open Graph preview image (`og:image` in `<head>`) points at the placeholder hero
  illustration — swap once real key art exists.
