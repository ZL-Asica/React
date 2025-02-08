import{_ as s,c as e,o as i,ag as t}from"./chunks/framework.CkHWihve.js";const d=JSON.parse('{"title":"pick()","description":"","frontmatter":{},"headers":[],"relativePath":"docs/utils/pick.md","filePath":"docs/utils/pick.md"}'),n={name:"docs/utils/pick.md"};function p(r,a,l,h,o,c){return i(),e("div",null,a[0]||(a[0]=[t(`<h1 id="pick" tabindex="-1">pick() <a class="header-anchor" href="#pick" aria-label="Permalink to &quot;pick()&quot;">​</a></h1><blockquote><p><strong>pick</strong>&lt;<code>T</code>&gt;(<code>object</code>, <code>keys</code>): <code>Partial</code>&lt;<code>T</code>&gt;</p></blockquote><p>Defined in: <a href="https://github.com/ZL-Asica/React/blob/e18738cc49ff40aa2d8b2a9bb55ae47821286223/src/utils/objectUtils.ts#L91" target="_blank" rel="noreferrer">src/utils/objectUtils.ts:91</a></p><p>Picks specified keys from an object.</p><h2 id="type-parameters" tabindex="-1">Type Parameters <a class="header-anchor" href="#type-parameters" aria-label="Permalink to &quot;Type Parameters&quot;">​</a></h2><p>• <strong>T</strong> <em>extends</em> <code>Record</code>&lt;<code>string</code>, <code>unknown</code>&gt;</p><h2 id="parameters" tabindex="-1">Parameters <a class="header-anchor" href="#parameters" aria-label="Permalink to &quot;Parameters&quot;">​</a></h2><h3 id="object" tabindex="-1">object <a class="header-anchor" href="#object" aria-label="Permalink to &quot;object&quot;">​</a></h3><p><code>T</code></p><p>The object to pick properties from.</p><h3 id="keys" tabindex="-1">keys <a class="header-anchor" href="#keys" aria-label="Permalink to &quot;keys&quot;">​</a></h3><p>keyof <code>T</code>[]</p><p>The keys to pick.</p><h2 id="returns" tabindex="-1">Returns <a class="header-anchor" href="#returns" aria-label="Permalink to &quot;Returns&quot;">​</a></h2><p><code>Partial</code>&lt;<code>T</code>&gt;</p><p>A new object containing only the specified keys.</p><h2 id="example" tabindex="-1">Example <a class="header-anchor" href="#example" aria-label="Permalink to &quot;Example&quot;">​</a></h2><div class="language-tsx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> obj</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { a: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, b: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, c: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> };</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> picked</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> pick</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(obj, [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;a&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;c&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(picked); </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// { a: 1, c: 3 }</span></span></code></pre></div>`,18)]))}const g=s(n,[["render",p]]);export{d as __pageData,g as default};
