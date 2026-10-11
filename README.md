# Dawn

[![Build status](https://github.com/shopify/dawn/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Shopify/dawn/actions/workflows/ci.yml?query=branch%3Amain)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?color=informational)](/.github/CONTRIBUTING.md)

[Getting started](#getting-started) |
[Staying up to date with Dawn changes](#staying-up-to-date-with-dawn-changes) |
[Developer tools](#developer-tools) |
[Contributing](#contributing) |
[Code of conduct](#code-of-conduct) |
[Theme Store submission](#theme-store-submission) |
[License](#license)

Dawn represents a HTML-first, JavaScript-only-as-needed approach to theme development. It's Shopify's first source available theme with performance, flexibility, and [Online Store 2.0 features](https://www.shopify.com/partners/blog/shopify-online-store) built-in and acts as a reference for building Shopify themes.

* **Web-native in its purest form:** Themes run on the [evergreen web](https://www.w3.org/2001/tag/doc/evergreen-web/). We leverage the latest web browsers to their fullest, while maintaining support for the older ones through progressive enhancement—not polyfills.
* **Lean, fast, and reliable:** Functionality and design defaults to “no” until it meets this requirement. Code ships on quality. Themes must be built with purpose. They shouldn’t support each and every feature in Shopify.
* **Server-rendered:** HTML must be rendered by Shopify servers using Liquid. Business logic and platform primitives such as translations and money formatting don’t belong on the client. Async and on-demand rendering of parts of the page is OK, but we do it sparingly as a progressive enhancement.
* **Functional, not pixel-perfect:** The Web doesn’t require each page to be rendered pixel-perfect by each browser engine. Using semantic markup, progressive enhancement, and clever design, we ensure that themes remain functional regardless of the browser.

You can find a more detailed version of our theme code principles in the [contribution guide](https://github.com/Shopify/dawn/blob/main/.github/CONTRIBUTING.md#theme-code-principles).

## Getting started
We recommend using Dawn as a starting point for theme development. [Learn more on Shopify.dev](https://shopify.dev/themes/getting-started/create).

> If you're building a theme for the Shopify Theme Store, then you can use Dawn as a starting point. However, the theme that you submit needs to be [substantively different from Dawn](https://shopify.dev/themes/store/requirements#uniqueness) so that it provides added value for merchants. Learn about the [ways that you can use Dawn](https://shopify.dev/themes/tools/dawn#ways-to-use-dawn).

Please note that the main branch may include code for features not yet released. The "stable" version of Dawn is available in the theme store.

## Staying up to date with Dawn changes

Say you're building a new theme off Dawn but you still want to be able to pull in the latest changes, you can add a remote `upstream` pointing to this Dawn repository.

1. Navigate to your local theme folder.
2. Verify the list of remotes and validate that you have both an `origin` and `upstream`:
```sh
git remote -v
```
3. If you don't see an `upstream`, you can add one that points to Shopify's Dawn repository:
```sh
git remote add upstream https://github.com/Shopify/dawn.git
```
4. Pull in the latest Dawn changes into your repository:
```sh
git fetch upstream
git pull upstream main
```

## Developer tools

There are a number of really useful tools that the Shopify Themes team uses during development. Dawn is already set up to work with these tools.

### Shopify CLI

[Shopify CLI](https://github.com/Shopify/shopify-cli) helps you build Shopify themes faster and is used to automate and enhance your local development workflow. It comes bundled with a suite of commands for developing Shopify themes—everything from working with themes on a Shopify store (e.g. creating, publishing, deleting themes) or launching a development server for local theme development.

You can follow this [quick start guide for theme developers](https://shopify.dev/docs/themes/tools/cli) to get started.

### Offline preview (without Shopify CLI)

For a local, approximate preview using sample catalog and customer data, install the development dependency once and start the server:

```bash
npm install
npm run preview:offline
```

Open `http://localhost:4173`. The preview renders the theme's JSON templates and sections locally, uses the normalized 1200 x 1500 product-photo assets, and supports adding the sample product to a local cart. Refresh the browser to see Liquid, CSS, JavaScript, and template changes. It does not connect to Shopify or publish anything.

This is a development aid, not a Shopify emulator: the sample product can be added to a local cookie-backed cart, but checkout, customer authentication, inventory, search results, and Shopify-managed account pages are simulated or non-functional. The preview uses sample content, and Shopify-specific Liquid features may not render identically to a real store.

The homepage shows a configurable collection preview with manually navigable image controls (up to three previews per product; advancing beyond the last preview opens that product), filters for “Casa y trabajo” and “Confort y descanso”, an editorial area, clear purchase-policy information, FAQs, and a contact call-to-action. The comfort filter recognizes product handles or types containing `cojin`, `almohada`, or `descanso`, and the lowercase Shopify product tags `confort`, `cojines`, and `almohadas`. Keep the featured collection broad enough to include both product families. Unavailable products show a diagonal “Próximamente” ribbon across their listing image. Their product page replaces the add-to-cart control with an email signup that adds a product-specific customer tag; configure a Shopify Flow or back-in-stock app to send notifications when inventory returns. The offline preview contains a fictitious unavailable desk lamp for testing and simulates signup without sending email. The header uses a Nekova wordmark when no custom Shopify logo has been selected. Facebook, Instagram, TikTok, and WhatsApp icons are visible on the contact page and global footer; they remain non-clickable until their destination URLs are configured. Product URLs use a separate premium detail template, with product-specific content and a reusable media gallery. Choose the collection and blog in the homepage section settings in the Shopify theme editor. Product content and inventory are managed in Shopify, not in this theme repository.

For the adjustable wooden reading stand, the detailed product template includes its specifications and product photos. Set its Shopify price to ARS 120,000 and compare-at price to ARS 150,000 to display the 20% launch discount. The K25 RGB video light uses the handle `lampara-video-portatil-k25-rgb`, has a sample offline-preview price of ARS 99,000, and includes its product images and MP4 in the theme assets. Create the product in Shopify with that handle, set its price to ARS 99,000, and add it to the featured collection for the homepage; the theme does not create Shopify catalog records. The ergonomic double-layer seat cushion uses the handle `cojin-ergonomico-doble-capa`, has a sample offline-preview price of ARS 72,000 (compare-at price ARS 90,000), and includes eight optimized product photos in the theme assets. Create the product in Shopify with that handle, the supplied Spanish description, price ARS 72,000, and compare-at price ARS 90,000; add it to the featured collection for the homepage. Other products use their own title, description, price, and product media; add their technical specifications to the `custom.specifications` metafield if needed. Product pages include a reviews area that supports Shopify review app blocks: install a reviews app that supports verified-purchase reviews and add its block to the “Nekova · producto destacado” section in the theme editor. The empty state remains until the app publishes real customer reviews.

The storefront FAQ and purchase information use the provided store policies: 60-day warranty, dispatch the same day for orders placed before 13:00 or within 24 hours otherwise, and refund requests within 10 days from purchase if returned complete and in perfect condition. Shipping transit estimates and payment methods are confirmed at checkout. The homepage does not show illustrative star ratings or sample customer quotes; product review areas remain empty until a reviews app displays real reviews. Product descriptions focus on verifiable product features and avoid promises of medical outcomes. The contact page at `/pages/contact` uses Shopify's contact form.

The stand and K25 photos use `product-media-`-prefixed JPGs in the root `assets/` directory on a shared 1200 x 1500 canvas. The cushion photos are converted to optimized JPGs with a maximum dimension of 1200 px; duplicate source files are included only once. The stand's clean cover image is tightly framed to make the product more prominent; the remaining source images retain their full content. Theme product cards and premium galleries use `contain`, so product images keep their complete content visible; Shopify-managed product uploads are not rewritten by theme code.

### Theme Check

We recommend using [Theme Check](https://github.com/shopify/theme-check) as a way to validate and lint your Shopify themes.

We've added Theme Check to Dawn's [list of VS Code extensions](/.vscode/extensions.json) so if you're using Visual Studio Code as your code editor of choice, you'll be prompted to install the [Theme Check VS Code](https://marketplace.visualstudio.com/items?itemName=Shopify.theme-check-vscode) extension upon opening VS Code after you've forked and cloned Dawn.

You can also run it from a terminal with the following Shopify CLI command:

```bash
shopify theme check
```

### Continuous Integration

Dawn uses [GitHub Actions](https://github.com/features/actions) to maintain the quality of the theme. [This is a starting point](https://github.com/Shopify/dawn/blob/main/.github/workflows/ci.yml) and what we suggest to use in order to ensure you're building better themes. Feel free to build off of it!

#### Shopify/lighthouse-ci-action

We love fast websites! Which is why we created [Shopify/lighthouse-ci-action](https://github.com/Shopify/lighthouse-ci-action). This runs a series of [Google Lighthouse](https://developers.google.com/web/tools/lighthouse) audits for the home, product and collections pages on a store to ensure code that gets added doesn't degrade storefront performance over time.

#### Shopify/theme-check-action

Dawn runs [Theme Check](#Theme-Check) on every commit via [Shopify/theme-check-action](https://github.com/Shopify/theme-check-action).

## Contributing

Want to make commerce better for everyone by contributing to Dawn? We'd love your help! Please read our [contributing guide](https://github.com/Shopify/dawn/blob/main/.github/CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements, and how to build for Dawn.

## Code of conduct

All developers who wish to contribute through code or issues, please first read our [Code of Conduct](https://github.com/Shopify/dawn/blob/main/.github/CODE_OF_CONDUCT.md).

## Theme Store submission

The [Shopify Theme Store](https://themes.shopify.com/) is the place where Shopify merchants find the themes that they'll use to showcase and support their business. As a theme partner, you can create themes for the Shopify Theme Store and reach an international audience of an ever-growing number of entrepreneurs.

Ensure that you follow the list of [theme store requirements](https://shopify.dev/themes/store/requirements) if you're interested in becoming a [Shopify Theme Partner](https://themes.shopify.com/services/themes/guidelines) and building themes for the Shopify platform.

## License

Copyright (c) 2021-present Shopify Inc. See [LICENSE](/LICENSE.md) for further details.
